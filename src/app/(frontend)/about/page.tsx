import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageHero } from '../../../components/Hero'
import { CtaBanner } from '../../../components/blocks'
import { getSiteSettings, getLocations, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, localBusinessSchema, absolute } from '../../../lib/schema'
import { Icon } from '../../../components/Icon'

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()
  return {
    title: `About Us | ${settings.companyName ?? '888 Lock & Key'}`,
    description:
      '888 Lock & Key is a licensed locksmith company providing 24/7 mobile service and physical walk-in shops across California, Arizona, and New York.',
    alternates: { canonical: absolute('/about') },
  }
}

const AboutPage = async () => {
  const [settings, locations, copy] = await Promise.all([
    getSiteSettings(),
    getLocations(),
    getPageCopy(),
  ])

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about' },
        ])}
      />
      <JsonLd data={localBusinessSchema(settings, locations)} />

      <PageHero
        eyebrow="ABOUT OUR COMPANY"
        title="About 888 Lock & Key"
        intro="A licensed locksmith company with real shops, real technicians, and prices we publish before you call."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      {/* Main Story & Team Photo */}
      <section className="sec">
        <div className="wrap">
          <div className="about-main-split">
            <div className="about-text-content">
              <h2>Who We Are</h2>
              <p>
                888 Lock &amp; Key is a licensed locksmith company operating across California, Arizona, and New York. We operate physical walk-in shops and a fleet of mobile service vans, so every technician who arrives is our own employee—background-checked, qualified, and badged.
              </p>

              <h2>How We Price</h2>
              <p>
                You get a clear, firm price on the phone before a van moves. If a job turns out to require additional parts or labor beyond what was quoted, we stop and explain the cost before continuing. There are no call-out surprises and no mystery service fees at the door.
              </p>

              <h2>What We Will Not Do</h2>
              <ul className="about-rules-list">
                <li>
                  <Icon name="check" />
                  <span><strong>We will not open a lock without proof of ownership.</strong> For your protection, our technician will verify your ID and property documentation before unlocking.</span>
                </li>
                <li>
                  <Icon name="check" />
                  <span><strong>We will not drill a lock that can be picked.</strong> We prioritize non-destructive entry to protect your doors and existing hardware.</span>
                </li>
                <li>
                  <Icon name="check" />
                  <span><strong>We will not quote one price on the phone and another on your doorstep.</strong> What we quote is what you pay.</span>
                </li>
              </ul>
            </div>

            <div className="about-team-image-box">
              <Image
                src="/images/888-team.webp"
                alt="888 Lock & Key technician and mobile service van"
                width={700}
                height={500}
                className="about-team-photo"
                priority
                unoptimized
              />
              <div className="about-photo-caption">
                <strong>888 Lock &amp; Key Mobile Fleet</strong>
                <span>Serving cars, homes, and businesses 24 hours a day</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Commitments */}
      <section className="sec sec-sand">
        <div className="wrap">
          <div className="sec-head-center">
            <div>
              <div className="eyebrow eyebrow-dash">OUR STANDARDS</div>
              <h2>Built on Honesty and Quality Service</h2>
              <p className="sec-sub-center">
                Three simple standards that guide every emergency lockout, rekey, and installation we perform.
              </p>
            </div>
          </div>

          <div className="about-pillars-three">
            <div className="about-pillar-simple">
              <div className="pillar-icon"><Icon name="shield" /></div>
              <h3>Upfront Pricing</h3>
              <p>
                We quote clear prices before dispatching a van. No hidden call-out fees or unexpected doorstep surcharges.
              </p>
            </div>

            <div className="about-pillar-simple">
              <div className="pillar-icon"><Icon name="key" /></div>
              <h3>Non-Destructive Entry</h3>
              <p>
                We use specialized lock-picking and bypass equipment to open vehicles and properties without damaging your locks.
              </p>
            </div>

            <div className="about-pillar-simple">
              <div className="pillar-icon"><Icon name="people" /></div>
              <h3>Qualified Technicians</h3>
              <p>
                Every locksmith is directly employed, background-checked, and equipped with precision key cutting tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Locations */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head-center">
            <div>
              <div className="eyebrow eyebrow-dash">LOCATIONS</div>
              <h2>Our Service Hubs</h2>
              <p className="sec-sub-center">
                Walk into one of our retail locations, or have a mobile service van come directly to your location.
              </p>
            </div>
          </div>

          <div className="about-hubs-grid">
            {locations.map((loc) => (
              <div key={loc.id} className="about-hub-card">
                <h3>{loc.shopName ?? loc.city}</h3>
                <div className="hub-city">{loc.city}, {loc.stateAbbr}</div>
                {loc.addressLine ? (
                  <div className="hub-addr">
                    <Icon name="pin" /> {loc.addressLine}
                  </div>
                ) : null}
                {loc.hours ? (
                  <div className="hub-hours">
                    <span className="livedot" /> {loc.hours}
                  </div>
                ) : null}
                <Link href={`/locations/${loc.slug}`} className="hub-link">
                  <span>{loc.city} locksmith details</span>
                  <Icon name="arrow" width={16} height={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        heading={copy.ctaHeading ?? 'Need a locksmith near you?'}
        subtitle={copy.ctaSubtitle ?? 'Call our 24/7 live dispatch team for immediate assistance.'}
      />
    </>
  )
}

export default AboutPage
