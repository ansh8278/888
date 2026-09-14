import Link from 'next/link'
import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Icon, GoogleG, type IconName } from './Icon'
import type { Media, Service, Location, Review } from '../payload-types'
import { withBase } from '../lib/base-path'

/**
 * Media relationships come back as an id or the populated doc, depending on depth.
 *
 * Payload returns absolute URLs once `serverURL` is set, which makes next/image
 * treat its own uploads as remote images needing a per-host allowlist. Media is
 * served by this same app, so the origin is stripped: the path works in every
 * environment and stays a local image.
 */
export const mediaUrl = (m: unknown): string | null => {
  if (!m || typeof m !== 'object' || !('url' in m)) return null
  const url = (m as Media).url
  if (!url) return null
  // next/image does not add basePath to local src itself, so it is added here.
  if (!/^https?:\/\//i.test(url)) return withBase(url)
  // Our own absolute URLs become relative; anything else (Vercel Blob, a CDN)
  // is served from that host and must stay absolute.
  try {
    const parsed = new URL(url)
    const own = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    if (parsed.host !== own.host) return url
    return withBase(`${parsed.pathname}${parsed.search}`)
  } catch {
    return url
  }
}

export const mediaAlt = (m: unknown, fallback = ''): string =>
  m && typeof m === 'object' && 'alt' in m ? ((m as Media).alt ?? fallback) : fallback

export const Prose = ({ data }: { data: unknown }) =>
  data ? (
    <div className="prose">
      <RichText data={data as SerializedEditorState} />
    </div>
  ) : null

export const SectionHead = ({
  eyebrow,
  heading,
  subtitle,
  link,
  center,
}: {
  eyebrow?: string | null
  heading: string
  subtitle?: string | null
  link?: { href: string; label: string }
  center?: boolean
}) => (
  <div className={center ? 'sec-head-center' : 'sec-head-row'}>
    <div>
      {eyebrow ? <div className="eyebrow eyebrow-dash">{eyebrow}</div> : null}
      <h2>{heading}</h2>
      {subtitle ? <p className="sec-subtitle">{subtitle}</p> : null}
    </div>
    {link ? (
      <Link href={link.href} className="view-all-link">
        {link.label} →
      </Link>
    ) : null}
  </div>
)

export const ServiceCard = ({ service }: { service: Service }) => (
  <Link href={`/services/${service.slug}`} className="svc-card-item">
    <div>
      <div className="svc-ico-box">
        <Icon name={(service.icon ?? 'lock') as IconName} />
      </div>
      <h3 className="svc-title">{service.title}</h3>
      <p className="svc-desc">{service.shortDescription}</p>
    </div>
    {/* The editor controls the whole price string ("$95", "From $45 / lock",
        "Custom quote"), so the card must not prepend wording of its own. */}
    <span className="svc-action">
      {service.startingPrice} <span aria-hidden="true">&rarr;</span>
    </span>
  </Link>
)

export const LocationCard = ({ location }: { location: Location }) => {
  const url = mediaUrl(location.image)
  return (
    <Link href={`/locations/${location.slug}`} className="city-card">
      {url ? (
        <Image
          src={url}
          alt={mediaAlt(location.image, `${location.city} skyline`)}
          width={480}
          height={320}
          sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 16vw"
        />
      ) : null}
      <div className="city-card-overlay">
        <div className="city-card-left">
          <Icon name="pin" className="city-pin-ico" />
          <div className="city-card-meta">
            <span className="city-name">{location.city}</span>
            <span className="city-state">{location.state}</span>
          </div>
        </div>
        <span className="city-arrow-circle">
          <Icon name="arrow" />
        </span>
      </div>
    </Link>
  )
}

export const ReviewCard = ({ review }: { review: Review }) => (
  <article className="rev-card-standard">
    <div>
      <div className="rev-stars-row" aria-label={`${review.rating} out of 5 stars`}>
        {'★'.repeat(review.rating ?? 5)}
      </div>
      <p className="rev-quote-text">&ldquo;{review.quote}&rdquo;</p>
    </div>
    <div className="rev-bottom-row">
      <div>
        <span className="rev-author-name">{review.author}</span>
        {review.cityLabel ? <span className="rev-author-city">{review.cityLabel}</span> : null}
      </div>
      {review.source === 'google' ? <GoogleG className="google-icon-svg" /> : null}
    </div>
  </article>
)

/**
 * Two identical tracks side by side. When the first has fully scrolled out the
 * second sits exactly where it started, so the loop never jumps. Pure CSS —
 * no timer to drift and nothing to re-run on resize.
 */
export const ReviewMarquee = ({ reviews }: { reviews: Review[] }) => {
  if (reviews.length === 0) return null
  return (
    <div className="rev-marquee">
      {[0, 1].map((track) => (
        <div className="rev-track" key={track} aria-hidden={track === 1 || undefined}>
          {reviews.map((review) => (
            <ReviewCard key={`${track}-${review.id}`} review={review} />
          ))}
        </div>
      ))}
    </div>
  )
}

export const CallCard = ({
  phone,
  phoneHref,
  title = 'Need a Locksmith?',
  subtitle = "We're here 24/7.",
  note = 'Same day service. No call-centre. Real people.',
}: {
  phone: string
  phoneHref: string
  title?: string | null
  subtitle?: string | null
  note?: string | null
}) => (
  <article className="rev-card-dark">
    <div className="dark-card-head">
      <div className="dark-padlock-box">
        <Icon name="lock" strokeWidth={2.2} />
      </div>
      <div className="dark-head-text">
        <h3>{title}</h3>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </div>
    <div>
      <a href={`tel:${phoneHref}`} className="btn-dark-call" data-call-cta>
        <Icon name="phone" />
        Call {phone}
      </a>
      {note ? <div className="dark-card-note">{note}</div> : null}
    </div>
  </article>
)

export const PricingTable = ({ services }: { services: Service[] }) => (
  <div className="p-table-wrap">
    <table className="p-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Notes</th>
          <th>Starting at</th>
        </tr>
      </thead>
      <tbody>
        {services.map((service) => (
          <tr key={service.id}>
            <td>
              <Link href={`/services/${service.slug}`}>{service.title}</Link>
            </td>
            <td className="p-note">{service.priceNote}</td>
            <td className="p-price">{service.startingPrice}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

export const CtaBanner = ({
  phone,
  phoneHref,
  heading,
  subtitle,
}: {
  phone: string
  phoneHref: string
  heading?: string | null
  subtitle?: string | null
}) => (
  <section className="cta-banner">
    <div className="wrap cta-banner-inner">
      <div>
        <h2>{heading || 'Locked out right now?'}</h2>
        <p>{subtitle || 'One call. A real dispatcher. A van on the way.'}</p>
      </div>
      <div className="cta-banner-actions">
        <a href={`tel:${phoneHref}`} className="btn-hero-primary" data-call-cta>
          <Icon name="phone" />
          Call {phone}
        </a>
        <Link href="/book" className="btn-hero-secondary">
          Request Service
          <Icon name="arrow" />
        </Link>
      </div>
    </div>
  </section>
)
