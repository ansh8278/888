import Link from 'next/link'
import { Icon } from './Icon'
import { SERVICE_AREAS, regionsOf, serviceAreasWithCities, type ServiceArea } from '../lib/data'
import type { Location } from '../payload-types'

/**
 * The coverage grid: one card per region, listing its cities. Used for a
 * single service area (the hub pages) or for every area at once (the home
 * page, where each area gets its own headed block).
 */
export const RegionGrid = ({
  locations,
  area,
  limit,
  showBlurb = true,
}: {
  locations: Location[]
  /** Restrict to one service area; omit to show the first one. */
  area?: ServiceArea
  limit?: number
  showBlurb?: boolean
}) => {
  const regions = regionsOf(area ?? SERVICE_AREAS[0], locations)

  // One region (Arizona today) would leave a single card stranded beside three
  // empty columns, so its cities fill the row instead.
  if (regions.length === 1) {
    return (
      <ul className="city-link-list">
        {regions[0].cities.slice(0, limit ?? regions[0].cities.length).map((c) => (
          <li key={c.id}>
            <Link href={`/locations/${c.slug}`}>
              {c.city} Locksmith <Icon name="arrow" />
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  return (
  <div className="region-grid">
    {regions.map((region) => (
      <div className="region-card" key={region.key}>
        <h3>{region.label}</h3>
        {showBlurb ? <p className="region-blurb">{region.cities.map((c) => c.city).join(', ')}.</p> : null}
        <ul className="region-links">
          {region.cities.slice(0, limit ?? region.cities.length).map((c) => (
            <li key={c.id}>
              <Link href={`/locations/${c.slug}`}>
                {c.city} Locksmith <Icon name="arrow" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
  )
}

/** Every service area the business covers, each under its own heading. */
export const ServiceAreaBlocks = ({ locations, limit }: { locations: Location[]; limit?: number }) => (
  <>
    {serviceAreasWithCities(locations).map(({ area }) => (
      <div className="area-block" key={area.key}>
        <div className="area-block-head">
          <h3>{area.label}</h3>
          <Link href={area.hub} className="area-block-link">
            All {area.short} areas <Icon name="arrow" />
          </Link>
        </div>
        <RegionGrid locations={locations} area={area} limit={limit} showBlurb={false} />
      </div>
    ))}
  </>
)
