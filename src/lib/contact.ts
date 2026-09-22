/**
 * The one place that decides whether the site has a phone number to show.
 *
 * The business phone is client-supplied and may be missing until launch.
 * Nothing on the site may print a placeholder or made-up number, so every
 * call button goes through this: with a number it dials, without one it
 * sends the visitor to the request form.
 */
export type Phone = { display: string; href: string }

type Settings = { phone?: string | null; phoneHref?: string | null }

const dialable = (value: string) => value.replace(/[^\d+]/g, '')

/** `override` is a per-location number shown and dialled as written. */
export const phoneOf = (settings: Settings, override?: string | null): Phone | null => {
  if (override) return { display: override, href: dialable(override) }
  const display = settings.phone?.trim()
  if (!display) return null
  return { display, href: settings.phoneHref?.trim() || dialable(display) }
}
