import Link from 'next/link'
import Image from 'next/image'
import { Icon, type IconName } from './Icon'
import { mediaUrl, mediaAlt } from './blocks'
import { CallButton } from './CallButton'
import { phoneOf } from '../lib/contact'
import type { HomePage, SiteSetting } from '../payload-types'

type Props = {
  home: HomePage
  settings: SiteSetting
}

export const Hero = ({ home, settings }: Props) => {
  const image = home.heroImage ?? settings.defaultHeroImage
  const url = mediaUrl(image)
  const scriptLines = (settings.scriptLine ?? '').split(/\s+(?=Our\b)/)

  return (
    <section className="hero" id="top">
      {url ? (
        <div className="hero-photo-layer">
          <Image
            src={url}
            alt={mediaAlt(image, `${settings.companyName} mobile locksmith van and technician`)}
            fill
            priority
            sizes="100vw"
          />
        </div>
      ) : null}

      <div className="wrap hero-inner">
        <div className="hero-left-content">
          {home.eyebrow ? <div className="hero-eyebrow">{home.eyebrow}</div> : null}

          <h1>
            <span className="line">{home.headingLine1}</span>{' '}
            <span className="line orange-txt">{home.headingLine2}</span>
          </h1>

          <p className="lede">{home.lede}</p>

          {(home.trustItems ?? []).length > 0 ? (
            <div className="hero-trust">
              {(home.trustItems ?? []).map((item) => (
                <div className="hero-trust-item" key={item.id ?? item.value}>
                  <Icon name={item.icon as IconName} />
                  <div>
                    <div className="t-v">{item.value}</div>
                    <div className="t-l">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="hero-cta">
            <CallButton phone={phoneOf(settings)} label={home.primaryCtaLabel ?? 'Call'} primary />
            <Link href="/book" className="btn-hero-secondary">
              {home.secondaryCtaLabel ?? 'Request Service'}
              <Icon name="arrow" />
            </Link>
          </div>

          {url ? (
            <div className="hero-mobile-img">
              <Image
                src={url}
                alt={mediaAlt(image, `${settings.companyName} mobile locksmith van`)}
                width={960}
                height={404}
                sizes="100vw"
              />
            </div>
          ) : null}
        </div>

        <div className="hero-right-rail">
          {settings.scriptLine ? (
            <div className="hero-script">
              {scriptLines.map((line, i) => (
                <span key={line}>
                  {line}
                  {i < scriptLines.length - 1 ? <br /> : null}
                </span>
              ))}
              <svg viewBox="0 0 150 26" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" aria-hidden="true">
                <path d="M4 18C34 6 96 4 146 12" />
                <path d="M26 24C52 16 100 15 138 21" opacity=".65" />
              </svg>
            </div>
          ) : null}

          {(home.categories ?? []).length > 0 ? (
            <div className="hero-card">
              <ul className="hero-cat-list">
                {(home.categories ?? []).map((cat) => (
                  <li key={cat.id ?? cat.label}>
                    <Icon name={cat.icon as IconName} />
                    {cat.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {settings.averageArrival ? (
            <div className="hero-card hero-eta">
              <Icon name="bolt" />
              <div>
                <div className="e-l">Average Arrival</div>
                <div className="e-v">{settings.averageArrival}</div>
                <div className="e-l">Across Our Cities</div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

/** Compact header used by every page that is not the home page. */
export const PageHero = ({
  eyebrow,
  title,
  intro,
  image,
  crumbs,
  actions,
}: {
  eyebrow?: string | null
  title: string
  intro?: string | null
  image?: unknown
  crumbs?: { label: string; href?: string }[]
  /** Call / Request buttons under the intro, as on the client's city and service pages. */
  actions?: React.ReactNode
}) => {
  const url = mediaUrl(image)
  return (
    <section className={`page-hero${url ? ' has-image' : ''}`}>
      {url ? (
        <div className="page-hero-photo">
          <Image src={url} alt={mediaAlt(image, title)} fill priority sizes="100vw" />
        </div>
      ) : null}
      <div className="wrap page-hero-inner">
        {crumbs && crumbs.length > 0 ? (
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              {crumbs.map((c) => (
                <li key={c.label}>
                  {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}
        {eyebrow ? <div className="hero-eyebrow">{eyebrow}</div> : null}
        <h1>{title}</h1>
        {intro ? <p className="page-hero-intro">{intro}</p> : null}
        {actions ? <div className="hero-cta page-hero-actions">{actions}</div> : null}
      </div>
    </section>
  )
}
