import Link from 'next/link'
import { CallButton } from './CallButton'
import type { Phone } from '../lib/contact'

/**
 * The sticky bar at the bottom of the screen on phones, per the client
 * prototype: Call Now + Request Service, always reachable. Hidden on
 * desktop and in print by CSS.
 */
export const StickyCall = ({ phone }: { phone: Phone | null }) => (
  <div className="stickybar" aria-label="Quick actions">
    {phone ? (
      <CallButton phone={phone} className="stickybar-call" label="📞 Call Now" hideNumber icon={false} />
    ) : null}
    <Link href="/book" className="stickybar-book">
      Request Service
    </Link>
  </div>
)
