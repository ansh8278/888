import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { PageHero } from '../../../components/Hero'
import { CtaBanner, Prose } from '../../../components/blocks'
import { DispatchHubs } from '../../../components/ContactCard'
import { getSiteSettings, getLocations, getPageCopy, getPage } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, localBusinessSchema, absolute } from '../../../lib/schema'
import { Icon } from '../../../components/Icon'
import { phoneOf } from '../../../lib/contact'

export const generateMetadata = async (): Promise<Metadata> => {
  const [settings, page] = await Promise.all([getSiteSettings(), getPage('about')])
  return {
    title: page?.seo?.title || `About Us | ${settings.companyName ?? '888 Lock & Key'}`,
    description:
      page?.seo?.description ||
      page?.intro ||
      `${settings.companyName} is a licensed mobile locksmith serving San Jose and the entire Bay Area.`,
    alternates: { canonical: absolute('/about') },
  }
}

/**
 * About page. The wording comes from the "About Us" page in the admin
 * (Pages → About Us); this file only supplies the layout around it.
 */
const AboutPage = async () => {
  const [settings, locations, copy, page] = await Promise.all([getSiteSettings(), getLocations(), getPageCopy(), getPage('about')])
  const name = settings.companyName ?? '888 Lock & Key'

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
        eyebrow="About our company"
        title={page?.title ?? `About ${name}`}
        intro={page?.intro ?? `A licensed mobile locksmith serving San Jose and the entire Bay Area.`}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      {/* Story (from the admin) & team photo */}
      <section className="sec">
        <div className="wrap">
          <div className="about-main-split">
            <div className="about-text-content">
              {page?.body ? (
                <Prose data={page.body} />
              ) : (
                <p>
                  {name} is a California BSIS-licensed, bonded and insured mobile locksmith company dispatching technicians across San Jose and the Bay Area.
                </p>
              )}
            </div>

            <div className="about-team-image-box">
              <Image
                src="/images/888-team.webp"
                alt={`${name} technician and mobile service van`}
                width={700}
                height={500}
                className="about-team-photo"
                priority
                unoptimized
              />
              <div className="about-photo-caption">
                <strong>{name} mobile fleet</strong>
                <span>{settings.serviceAreaLine ?? 'Serving San Jose & the Entire Bay Area'}</span>
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
                Three standards that guide every lockout, rekey and installation we perform.
              </p>
            </div>
          </div>

          <div className="about-pillars-three">
            <div className="about-pillar-simple">
              <div className="pillar-icon"><Icon name="shield" /></div>
              <h3>Upfront Pricing</h3>
              <p>
                The price is confirmed with you before any work begins — no doorstep surprises.
              </p>
            </div>

            <div className="about-pillar-simple">
              <div className="pillar-icon"><Icon name="key" /></div>
              <h3>Non-Destructive Entry</h3>
              <p>
                Vehicles and properties are opened without damage to your locks or doors wherever possible.
              </p>
            </div>

            <div className="about-pillar-simple">
              <div className="pillar-icon"><Icon name="people" /></div>
              <h3>Qualified Technicians</h3>
              <p>
                Background-checked, licensed and insured technicians, dispatched across the Bay Area.
              </p>
            </div>
          </div>
        </div>
      </section>

      <DispatchHubs settings={settings} heading="Where we dispatch from" />

      <section className="sec">
        <div className="wrap">
          <div className="sec-head-center">
            <div>
              <div className="eyebrow eyebrow-dash">Service area</div>
              <h2>Serving {locations.filter((l) => !l.parent).length} Bay Area cities</h2>
              <p className="sec-sub-center">
                South Bay, the Peninsula, the East Bay and the Tri-Valley — see every city we cover.
              </p>
              <p>
                <Link href="/bay-area-locksmith" className="btn btn-secondary">
                  View all service areas <Icon name="arrow" />
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        phone={phoneOf(settings)}
        heading={copy.ctaHeading ?? 'Need a locksmith near you?'}
        subtitle={copy.ctaSubtitle ?? 'Mobile technicians dispatched across San Jose and the Bay Area.'}
      />
    </>
  )
}

export default AboutPage
