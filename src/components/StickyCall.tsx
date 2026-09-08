'use client'

import { useEffect, useState } from 'react'

/**
 * The always-there call button on phones.
 *
 * It exists for when the real call button has scrolled out of view, so it
 * hides itself while one is on screen — otherwise the top of the page shows
 * two identical "Call …" buttons stacked on top of each other.
 *
 * Any call button marked `data-call-cta` counts.
 */
export const StickyCall = ({ phone, phoneHref }: { phone: string; phoneHref: string }) => {
  const [hidden, setHidden] = useState(true)

  useEffect(() => {
    const targets = document.querySelectorAll('[data-call-cta]')

    // No main call button on this page (or no observer support): always show.
    if (targets.length === 0 || typeof IntersectionObserver === 'undefined') {
      setHidden(false)
      return
    }

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
    <a
      href={`tel:${phoneHref}`}
      className={`sticky-call${hidden ? ' sticky-call--hidden' : ''}`}
      aria-label={`Call ${phone}`}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : undefined}
    >
      Call {phone}
    </a>
  )
}
