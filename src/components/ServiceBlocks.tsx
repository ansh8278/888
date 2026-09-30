import Link from 'next/link'
import { Icon, type IconName } from './Icon'
import { fillTemplate } from '../lib/template'
import { serviceAreasWithCities } from '../lib/data'
import type { Service, Location } from '../payload-types'

/**
 * The service card grid used on every city page (8 cards, same on each city)
 * and on category pages (that category's services). Text comes from the
 * service's "Card on city pages" fields, with {city} filled in.
 */
export const ServiceCardGrid = ({ services, city }: { services: Service[]; city?: string }) => (
  <div className="city-link-grid">
    {services.map((service) => {
      const title = (city && service.cityCard?.title) || service.title
      const text = city ? fillTemplate(service.cityCard?.text, { city }) : service.shortDescription
      return (
        <Link key={service.id} href={`/services/${service.slug}`} className="city-link">
          <Icon name={(service.icon ?? 'lock') as IconName} />
          <span>
            <strong>{title}</strong>
            {text ? <em>{text}</em> : null}
          </span>
          <Icon name="arrow" className="city-link-arrow" />
        </Link>
      )
    })}
  </div>
)

/**
 * "Areas We Serve" on service pages: a few cities from each service area the
 * business covers, each followed by a link to that area's full list.
 */
export const AreasWeServe = ({ locations, limit = 6 }: { locations: Location[]; limit?: number }) => (
  <div className="areas-served">
    {serviceAreasWithCities(locations).map(({ area, regions }) => (
      <div className="areas-served-row" key={area.key}>
        <span className="areas-served-label">{area.short}</span>
        <div className="link-pills">
          {regions
            .flatMap((r) => r.cities)
            .slice(0, limit)
            .map((l) => (
              <Link key={l.id} href={`/locations/${l.slug}`}>
                {l.city}
              </Link>
            ))}
          <Link href={area.hub}>
            All {area.short} areas <Icon name="arrow" />
          </Link>
        </div>
      </div>
    ))}
  </div>
)

/** "You May Also Need" / "Also Serving" — a row of related page links. */
export const LinkPills = ({ items }: { items: { href: string; label: string }[] }) => (
  <div className="link-pills">
    {items.map((i) => (
      <Link key={i.href} href={i.href}>
        {i.label} <Icon name="arrow" />
      </Link>
    ))}
  </div>
)

/** A relationship field's value, whether Payload returned ids or documents. */
export const asDocs = <T extends { id: number }>(value: (number | T)[] | null | undefined): T[] =>
  (value ?? []).filter((v): v is T => typeof v === 'object' && v !== null)
