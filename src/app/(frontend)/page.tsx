import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Hero } from '../../components/Hero'
import { FaqList } from '../../components/FaqList'
import {
  SectionHead,
  ServiceCard,
  LocationCard,
  ReviewMarquee,
  CallCard,
  PricingTable,
  mediaUrl,
  mediaAlt,
} from '../../components/blocks'
import { Icon } from '../../components/Icon'
import {
  getHomePage,
  getSiteSettings,
  getServices,
  getLocations,
  getReviews,
  getHomeFaqs,
  getPageCopy,
} from '../../lib/data'
import { localBusinessSchema, faqSchema, JsonLd, absolute } from '../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const [home, settings] = await Promise.all([getHomePage(), getSiteSettings()])
  return {
    title: home.seo?.title || `${settings.companyName} — 24/7 Mobile Locksmith`,
    description: home.seo?.description || home.lede,
    alternates: { canonical: absolute('/') },
  }
}

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

  const featuredServices = services.filter((s) => s.featured)
  const featuredLocations = locations.filter((l) => l.featured)
  const pricingServices = services.filter((s) => s.showInPricingTable)

  return (
    <>
      <JsonLd data={localBusinessSchema(settings, locations)} />
      <JsonLd data={faqSchema(faqs)} />

      <Hero home={home} settings={settings} />

      {/* Cities */}
      <section className="sec sec-tight" id="locations-cards">
        <div className="wrap">
          <SectionHead
            eyebrow={home.locationsEyebrow}
            heading={home.locationsHeading ?? 'Find a locksmith near you'}
            link={{ href: '/locations', label: 'View All Locations' }}
          />
          <div className="city-grid">
            {featuredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="sec sec-sand" id="services">
        <div className="wrap">
          <SectionHead
            heading={home.servicesHeading ?? 'Our Locksmith Services'}
            subtitle={home.servicesEyebrow}
            link={{ href: '/services', label: 'All Services' }}
          />
          <div className="services-grid-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="trust-bar">
        <div className="wrap trust-bar-inner">
          <div className="trust-bar-item">
            <Icon name="clock" />
            <div>
              <div className="tb-v">{settings.hours ?? '24/7'}</div>
              <div className="tb-l">Live Dispatch</div>
            </div>
          </div>
          <div className="trust-bar-item">
            <Icon name="shield" />
            <div>
              <div className="tb-v">Licensed &amp; Insured</div>
              <div className="tb-l">{settings.licenseNumber}</div>
            </div>
          </div>
          <div className="trust-bar-item">
            <Icon name="star" />
            <div>
              <div className="tb-v">{settings.rating}</div>
              <div className="tb-l">{settings.reviewCount}+ Google Reviews</div>
            </div>
          </div>
          <div className="trust-bar-item">
            <Icon name="people" />
            <div>
              <div className="tb-v">Trusted by Thousands</div>
              <div className="tb-l">Homes, cars, businesses</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="sec sec-about" id="about">
        <div className="wrap">
          <div className="about-home-grid">
            <div className="about-home-text">
              <div className="eyebrow eyebrow-dash">ABOUT 888 LOCK &amp; KEY</div>
              <h2>Reliable Mobile Locksmith Services You Can Trust</h2>
              <p className="about-home-lead">
                888 Lock &amp; Key provides professional 24/7 mobile locksmith solutions across California, Arizona, and New York. We operate physical retail shops and a fleet of mobile workshop vans, delivering upfront pricing and quality workmanship for cars, homes, and businesses.
              </p>

              <div className="about-home-features">
                <div className="about-feature-item">
                  <div className="feature-icon">
                    <Icon name="shield" />
                  </div>
                  <div>
                    <strong>Upfront, Transparent Pricing</strong>
                    <p>Clear estimates confirmed before work begins—no unexpected charges or doorstep surprises.</p>
                  </div>
                </div>

                <div className="about-feature-item">
                  <div className="feature-icon">
                    <Icon name="key" />
                  </div>
                  <div>
                    <strong>Non-Destructive Entry Priority</strong>
                    <p>Skilled lock-picking and bypass techniques to preserve your existing door hardware whenever possible.</p>
                  </div>
                </div>

                <div className="about-feature-item">
                  <div className="feature-icon">
                    <Icon name="people" />
                  </div>
                  <div>
                    <strong>Licensed &amp; Background-Checked</strong>
                    <p>Qualified, insured locksmith technicians equipped with modern key cutting and diagnostic tools.</p>
                  </div>
                </div>
              </div>

              <div className="about-home-actions">
                <Link href="/about" className="btn btn-primary">
                  Learn More About Us <Icon name="arrow" />
                </Link>
                <a href={`tel:${settings.phoneHref}`} className="btn btn-secondary">
                  <Icon name="phone" /> Call {settings.phone}
                </a>
              </div>
            </div>

            <div className="about-home-image-wrap">
              <Image
                src="/images/888-team.png"
                alt="888 Lock & Key technician and mobile service van"
                width={700}
                height={500}
                className="about-home-photo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="sec" id="reviews">
        <div className="wrap">
          <SectionHead
            heading={home.reviewsHeading ?? 'What Our Customers Say'}
            subtitle={home.reviewsSubtitle}
            link={{ href: '/reviews', label: 'View All Reviews' }}
          />
          <div className="reviews-row">
            <ReviewMarquee reviews={reviews} />
            <CallCard
              phone={settings.phone}
              phoneHref={settings.phoneHref}
              title={copy.callCardTitle}
              subtitle={copy.callCardSubtitle}
              note={copy.callCardNote}
            />
          </div>
        </div>
      </section>

      {/* Shops */}
      <section className="sec sec-sand" id="shops">
        <div className="wrap">
          <SectionHead
            eyebrow={home.shopsEyebrow}
            heading={home.shopsHeading ?? 'Walk in, or we drive to you.'}
            subtitle={home.shopsSubtitle}
          />
          <div className="loc-grid">
            {featuredLocations.slice(0, 3).map((location) => {
              const url = mediaUrl(location.image)
              return (
                <div className="loc-card" key={location.id}>
                  <div className="loc-map-header">
                    {url ? (
                      <Image
                        src={url}
                        alt={mediaAlt(location.image, location.city)}
                        width={600}
                        height={300}
                        sizes="(max-width: 900px) 100vw, 33vw"
                      />
                    ) : null}
                    {location.badge ? <span className="loc-badge">{location.badge}</span> : null}
                  </div>
                  <div className="loc-body">
                    <h3>{location.shopName ?? location.city}</h3>
                    <div className="loc-body-sub">{location.shopSubtitle}</div>
                    <div className="loc-info-list">
                      {location.addressLine ? (
                        <div>
                          <Icon name="pin" />
                          <span>
                            {location.addressLine}
                            <br />
                            {location.city}, {location.stateAbbr} {location.postcode}
                          </span>
                        </div>
                      ) : null}
                      <div>
                        <Icon name="phone" />
                        <a href={`tel:${location.phone || settings.phoneHref}`}>
                          {location.phone || settings.phone}
                        </a>
                      </div>
                    </div>
                    {location.hours ? (
                      <div className="loc-open-status">
                        <span className="livedot" /> {location.hours}
                      </div>
                    ) : null}
                    <Link href={`/locations/${location.slug}`} className="loc-card-link">
                      {location.city} locksmith services <Icon name="arrow" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="sec" id="pricing">
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

      {/* FAQ */}
      <section className="sec sec-sand" id="faq">
        <div className="wrap">
          <div className="sec-head-center">
            <div>
              {home.faqEyebrow ? <div className="eyebrow eyebrow-dash">{home.faqEyebrow}</div> : null}
              <h2>{home.faqHeading ?? 'Frequently Asked Questions'}</h2>
              <p className="sec-sub-center">
                Clear, straightforward answers about our mobile dispatch, pricing, and services.
              </p>
            </div>
          </div>
          <div className="faq-wrap-center">
            <FaqList faqs={faqs} />
            <div className="faq-bottom-bar">
              <span>Have more questions about our services?</span>
              <div className="faq-bottom-links">
                <Link href="/faq" className="btn btn-secondary btn-sm">
                  View All FAQs <Icon name="arrow" />
                </Link>
                <a href={`tel:${settings.phoneHref}`} className="btn btn-primary btn-sm">
                  <Icon name="phone" /> Call {settings.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
