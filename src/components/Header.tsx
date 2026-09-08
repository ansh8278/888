'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Icon } from './Icon'

export type NavItem = { label: string; href: string }

type Props = {
  companyName: string
  tagline?: string | null
  phone: string
  phoneHref: string
  items: NavItem[]
}

export const Header = ({ companyName, tagline, phone, phoneHref, items }: Props) => {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const pathname = usePathname()

  // Close the drawer whenever navigation happens, otherwise it stays open
  // over the new page on mobile.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Stop the page scrolling behind the open drawer.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      <header id="header" className={stuck ? 'stuck' : undefined}>
      <div className="wrap">
        <div className="nav-inner">
          <Link href="/" className="logo">
            <div className="logo-icon-box">
              <Icon name="lock" strokeWidth={2.2} />
            </div>
            <div className="logo-text-block">
              <span className="logo-title">{companyName}</span>
              {tagline ? <span className="logo-sub">{tagline}</span> : null}
            </div>
          </Link>

          <nav className="desk" aria-label="Main">
            <ul className="nav-links">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="nav-link"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-actions">
            <a href={`tel:${phoneHref}`} className="nav-phone-pill">
              <Icon name="phone" />
              {phone}
            </a>
            <Link href="/book" className="btn-request-nav">
              Request Service
            </Link>
            <button
              className="burger"
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <span className={open ? 'is-open' : undefined} />
            </button>
          </div>
        </div>
      </div>
      </header>

      {/* Outside <header> on purpose: the header uses backdrop-filter, which
          makes it a containing block for position:fixed children — the drawer
          was being sized against the 80px header instead of the viewport. */}
      <div
        id="mobile-nav"
        className={`mobile-nav${open ? ' open' : ''}`}
        hidden={!open}
        aria-label="Mobile"
      >
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <a href={`tel:${phoneHref}`} className="btn-hero-primary mobile-nav-call">
          <Icon name="phone" />
          Call {phone}
        </a>
        <Link href="/book" className="btn-hero-secondary mobile-nav-book">
          Request Service
        </Link>
      </div>
      {open ? <button className="mobile-nav-scrim" aria-hidden="true" tabIndex={-1} onClick={() => setOpen(false)} /> : null}
    </>
  )
}
