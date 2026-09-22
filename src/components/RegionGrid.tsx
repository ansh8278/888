import Link from 'next/link'
import { Icon } from './Icon'
import { locationsByRegion } from '../lib/data'
import type { Location } from '../payload-types'

/**
 * The Bay Area coverage grid from the client prototype: one card per region
 * (South Bay, Peninsula, East Bay, Tri-Valley) listing its cities. The home
 * page shows the first few cities of each region; the hub shows them all.
 */
export const RegionGrid = ({ locations, limit, showBlurb = true }: { locations: Location[]; limit?: number; showBlurb?: boolean }) => (
  <div className="region-grid">
    {locationsByRegion(locations).map((region) => (
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
