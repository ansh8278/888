'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { CallButton } from './CallButton'
import type { Phone } from '../lib/contact'

/**
 * The Call / Request bar pinned to the bottom of the screen on phones.
 *
 * It exists for the moments when no call button is in view, so it steps out
 * of the way while one is: without that, scrolling a long page showed the bar
 * stacked under a call button again and again.
 *
 * Any call button marked `data-call-cta` counts (see CallButton).
 */
export const StickyCall = ({ phone }: { phone: Phone | null }) => {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll('[data-call-cta]')
    if (targets.length === 0 || typeof IntersectionObserver === 'undefined') return

    const onScreen = new Set<Element>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.add(entry.target)
          else onScreen.delete(entry.target)
        }
        setHidden(onScreen.size > 0)
      },
      // A button half off the bottom edge still counts as reachable.
      { threshold: 0.4 },
    )
    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`stickybar${hidden ? ' stickybar--hidden' : ''}`} aria-hidden={hidden} aria-label="Quick actions">
      {phone ? <CallButton phone={phone} className="stickybar-call" label="📞 Call Now" hideNumber icon={false} /> : null}
      <Link href="/book" className="stickybar-book" tabIndex={hidden ? -1 : undefined}>
        Request Service
      </Link>
    </div>
  )
}
