import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Hero } from '../../components/Hero'
import { FaqList } from '../../components/FaqList'
import { RegionGrid } from '../../components/RegionGrid'
import { SectionHead, ServiceCard, ReviewMarquee, CallCard, PricingTable, CtaBanner } from '../../components/blocks'
import { Icon, type IconName } from '../../components/Icon'
import { getHomePage, getSiteSettings, getServices, getLocations, getReviews, getHomeFaqs, getPageCopy } from '../../lib/data'
import { phoneOf } from '../../lib/contact'
import { localBusinessSchema, faqSchema, JsonLd, absolute } from '../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  return {
    title: {
      absolute: home.seo?.title || `Mobile Locksmith Serving San Jose & the Entire Bay Area | ${settings.companyName}`,
    },
    description: home.seo?.description || home.lede,
    alternates: { canonical: absolute('/') },
  }
}

/**
 * Home page, section for section as in the client's index.html:
 * hero → where we dispatch (4 regions) → emergency band → service categories
 * → about → FAQ. Reviews and pricing appear only once real data exists.
 */
const HomePage = async () => {
  const [home, settings, services, locations, reviews, faqs, copy] = await Promise.all([
    getHomePage(),
    getSiteSettings(),
    getServices(),
    getLocations(),
    getReviews(true),
    getHomeFaqs(),
    getPageCopy(),
  ])
  const phone = phoneOf(settings)

  const categories = services.filter((s) => s.kind === 'category' && s.featured)
  const pricingServices = services.filter((s) => s.showInPricingTable && s.startingPrice)

  return (
    <>
      <JsonLd data={localBusinessSchema(settings, locations)} />
      <JsonLd data={faqSchema(faqs)} />

      <Hero home={home} settings={settings} />

      {/* Where we dispatch */}
      <section className="sec" id="locations">
        <div className="wrap">
          <SectionHead
            eyebrow={home.locationsEyebrow}
            heading={home.locationsHeading ?? 'Mobile Locksmith Coverage Across the Bay Area'}
            link={{ href: '/bay-area-locksmith', label: 'View all service areas' }}
          />
          <RegionGrid locations={locations} limit={4} />
          <p className="region-more">
            <Link href="/bay-area-locksmith" className="btn btn-secondary">
              View all {locations.filter((l) => !l.parent).length} service areas <Icon name="arrow" />
            </Link>
          </p>
        </div>
      </section>

      <CtaBanner phone={phone} heading={copy.ctaHeading} subtitle={copy.ctaSubtitle} />

      {/* Services */}
      <section className="sec sec-sand" id="services">
        <div className="wrap">
          <SectionHead
            eyebrow={home.servicesEyebrow}
            heading={home.servicesHeading ?? 'Locksmith Services Throughout the Bay Area'}
            link={{ href: '/services', label: 'All Services' }}
          />
          <div className="services-grid-4">
            {categories.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="sec sec-about" id="about">
        <div className="wrap">
          <div className="about-home-grid">
            <div className="about-home-text">
              {home.aboutEyebrow ? <div className="eyebrow eyebrow-dash">{home.aboutEyebrow}</div> : null}
              <h2>{home.aboutHeading ?? 'A mobile locksmith that comes to you'}</h2>
              {home.aboutLead ? <p className="about-home-lead">{home.aboutLead}</p> : null}

              <div className="about-home-features">
                {(home.aboutFeatures ?? []).map((f) => (
                  <div className="about-feature-item" key={f.id ?? f.title}>
                    <div className="feature-icon">
                      <Icon name={f.icon as IconName} />
                    </div>
                    <div>
                      <strong>{f.title}</strong>
                      <p>{f.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="about-home-actions">
                <Link href="/about" className="btn btn-primary">
                  {home.aboutCtaLabel ?? 'More about us'} <Icon name="arrow" />
                </Link>
              </div>
            </div>

            <div className="about-home-image-wrap">
              <Image
                src="/images/888-team.webp"
                alt={`${settings.companyName} technician and mobile service van`}
                width={700}
                height={500}
                className="about-home-photo"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews — only once real, verified reviews have been entered */}
      {reviews.length > 0 ? (
        <section className="sec" id="reviews">
          <div className="wrap">
            <SectionHead
              heading={home.reviewsHeading ?? 'What Our Customers Say'}
              subtitle={home.reviewsSubtitle}
              link={{ href: '/reviews', label: 'View All Reviews' }}
            />
            <div className="reviews-row">
              <ReviewMarquee reviews={reviews} />
              <CallCard phone={phone} title={copy.callCardTitle} subtitle={copy.callCardSubtitle} note={copy.callCardNote} />
            </div>
          </div>
        </section>
      ) : null}

      {/* Pricing — only once confirmed starting prices exist */}
      {pricingServices.length > 0 ? (
        <section className="sec sec-sand" id="pricing">
          <div className="wrap">
            <SectionHead
              eyebrow={home.pricingEyebrow}
              heading={home.pricingHeading ?? 'Starting prices, published up front.'}
              subtitle={home.pricingSubtitle}
              link={{ href: '/pricing', label: 'Full Pricing' }}
            />
            <PricingTable services={pricingServices} />
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {faqs.length > 0 ? (
        <section className="sec" id="faq">
          <div className="wrap">
            <div className="sec-head-center">
              <div>
                {home.faqEyebrow ? <div className="eyebrow eyebrow-dash">{home.faqEyebrow}</div> : null}
                <h2>{home.faqHeading ?? 'Frequently Asked Questions'}</h2>
              </div>
            </div>
            <div className="faq-wrap-center">
              <FaqList faqs={faqs} />
              <div className="faq-bottom-bar">
                <span>{home.faqBarText ?? 'Have more questions?'}</span>
                <div className="faq-bottom-links">
                  <Link href="/faq" className="btn btn-primary btn-sm">
                    View All FAQs <Icon name="arrow" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

export default HomePage
