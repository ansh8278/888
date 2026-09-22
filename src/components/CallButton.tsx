import Link from 'next/link'
import { Icon } from './Icon'
import type { Phone } from '../lib/contact'

type Props = {
  phone: Phone | null
  className?: string
  /** Button text; the number is appended unless `hideNumber`. Default "Call". */
  label?: string | null
  hideNumber?: boolean
  icon?: boolean
  /** Counts as the page's main call button so the sticky bar can hide behind it. */
  primary?: boolean
}

/**
 * Every call-to-action button on the site. With a phone number it is a
 * tel: link; without one (not yet supplied by the client) it becomes a
 * "Request Service" link to the booking form. See src/lib/contact.ts.
 */
export const CallButton = ({ phone, className = 'btn-hero-primary', label, hideNumber, icon = true, primary }: Props) => {
  if (!phone) {
    return (
      <Link href="/book" className={className} data-call-cta={primary ? '' : undefined}>
        {icon ? <Icon name="phone" /> : null}
        Request Service
      </Link>
    )
  }
  const text = label ?? 'Call'
  return (
    <a href={`tel:${phone.href}`} className={className} data-call-cta={primary ? '' : undefined}>
      {icon ? <Icon name="phone" /> : null}
      {hideNumber ? text : `${text} ${phone.display}`}
    </a>
  )
}

/**
 * Hero button pair: Call (or its Request fallback) plus Request Service. The
 * second button is dropped while there is no phone number, otherwise the hero
 * would show two identical "Request Service" buttons.
 */
export const HeroActions = ({ phone, label, hideNumber }: { phone: Phone | null; label?: string | null; hideNumber?: boolean }) => (
  <>
    <CallButton phone={phone} label={label ?? 'Call Now —'} hideNumber={hideNumber} primary />
    {phone ? (
      <Link href="/book" className="btn-hero-secondary">
        Request Service
      </Link>
    ) : null}
  </>
)
