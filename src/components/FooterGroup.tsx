'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Icon } from './Icon'

type FooterLink = { label: string; href: string; id?: string | null }

/**
 * A footer link group: a plain column on desktop, a collapsible row on phones
 * (four groups of links is a wall of text on a small screen).
 *
 * The `open` state is set from a media query rather than CSS, because a
 * browser hides <details> content in a way a stylesheet cannot reliably
 * reverse. It renders open on the server, so the links are in the HTML for
 * search engines and for anyone without JavaScript.
 */
export const FooterGroup = ({ heading, links }: { heading: string; links: FooterLink[] }) => {
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const phone = window.matchMedia('(max-width: 720px)')
    const apply = () => setOpen(!phone.matches)
    apply()
    phone.addEventListener('change', apply)
    return () => phone.removeEventListener('change', apply)
  }, [])

  return (
    <details className="footer-nav-col" open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary className="footer-heading">
        {heading}
        <Icon name="chevron" className="footer-heading-chevron" />
      </summary>
      <ul className="footer-links">
        {links.map((link) => (
          <li key={link.id ?? link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </details>
  )
}
