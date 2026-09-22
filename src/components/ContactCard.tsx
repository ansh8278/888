import { CallButton } from './CallButton'
import type { Phone } from '../lib/contact'
import type { SiteSetting } from '../payload-types'

/**
 * The side card on the Contact and Request pages: how to reach dispatch.
 * Shows only what Site settings actually contains — no hours, licence or
 * arrival claim appears until the client has supplied it.
 */
export const ContactCard = ({ settings, phone, title, note }: { settings: SiteSetting; phone: Phone | null; title?: string | null; note?: string | null }) => (
  <div className="price-card">
    <div className="price-card-label">{title ?? 'Dispatch'}</div>
    {phone ? <div className="price-card-value small">{phone.display}</div> : null}
    {note ? <p className="price-card-note">{note}</p> : null}
    <CallButton phone={phone} className="btn-hero-primary price-card-cta" label="Call now" hideNumber primary />
    {settings.email ? (
      <a href={`mailto:${settings.email}`} className="btn-hero-secondary price-card-cta">
        {settings.email}
      </a>
    ) : null}
    {settings.hours ? (
      <div className="loc-open-status">
        <span className="livedot" /> {settings.hours}
      </div>
    ) : null}
    {settings.licenseNumber ? <p className="price-card-note">{settings.licenseNumber}</p> : null}
  </div>
)

/** Confirmed dispatch hubs from Site settings — never a per-city storefront. */
export const DispatchHubs = ({ settings, heading }: { settings: SiteSetting; heading?: string | null }) => {
  const hubs = settings.dispatchHubs ?? []
  if (hubs.length === 0) return null
  return (
    <section className="sec sec-sand">
      <div className="wrap">
        <h2>{heading ?? 'Our dispatch hub'}</h2>
        <p className="muted">
          {settings.companyName ?? '888 Lock & Key'} is a mobile locksmith. Technicians are dispatched from here to every city we serve — there is no need to visit.
        </p>
        <div className="contact-grid">
          {hubs.map((hub) => (
            <div className="contact-card" key={hub.id ?? hub.name}>
              <h3>{hub.name}</h3>
              <p>
                {hub.addressLine}
                <br />
                {hub.city}, {hub.stateAbbr} {hub.postcode}
              </p>
              {hub.mapUrl ? (
                <a href={hub.mapUrl} target="_blank" rel="noopener noreferrer">
                  Get directions
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
