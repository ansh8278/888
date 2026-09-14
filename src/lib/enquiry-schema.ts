import { z } from 'zod'

/**
 * What a customer is allowed to send through the website form — nothing else.
 *
 * Every field is trimmed and capped. Unknown keys are silently dropped by
 * Zod's default object behaviour, which is exactly what we want: a client
 * sending `status: 'booked'` or `notes: '...'` must never reach the database.
 */

// `error` covers the field being missing entirely, so a customer sees
// "Please enter your name" rather than "expected string, received undefined".
const trimmed = (max: number, error?: string) => z.string({ error }).trim().max(max)

// Optional text that may arrive as '' from an empty input — treat that as absent.
const optionalText = (max: number) =>
  trimmed(max)
    .optional()
    .transform((v) => (v ? v : undefined))

/**
 * Deliberately loose: real numbers arrive as "(408) 555-0199", "408.555.0199",
 * "+1 408 555 0199". Seven digits is enough to be dialable; a rejected booking
 * costs far more than a badly formatted one.
 */
const PHONE_MESSAGE = 'Please enter a phone number we can reach you on.'
const phone = trimmed(40, PHONE_MESSAGE).refine((v) => (v.match(/\d/g) ?? []).length >= 7, {
  message: PHONE_MESSAGE,
})

const email = trimmed(200)
  .optional()
  .transform((v) => (v ? v : undefined))
  .refine((v) => v === undefined || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), {
    message: 'That email address does not look right.',
  })

export const enquirySchema = z.object({
  type: z.enum(['order', 'quote', 'contact']).catch('order'),
  name: trimmed(120, 'Please enter your name.').min(2, 'Please enter your name.'),
  phone,
  email,
  serviceLabel: optionalText(120),
  cityLabel: optionalText(120),
  when: optionalText(120),
  message: optionalText(2000),
  sourcePage: optionalText(200),
  /** Honeypot. Bots fill it, people cannot see it. */
  company: optionalText(100),
})

export type EnquiryInput = z.infer<typeof enquirySchema>

/** The first human-readable problem, for the form's error line. */
export const firstError = (error: z.ZodError): string =>
  error.issues[0]?.message ?? 'Please check the form and try again.'
