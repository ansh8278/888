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

      {/* About / Why 888 */}
      <section className="sec sec-about" id="about">
        <div className="wrap">
          <div className="about-split-head">
            <div>
              <div className="eyebrow eyebrow-dash">WHY 888 LOCK &amp; KEY</div>
              <h2>Real Locksmiths. Real Shops. No Lead-Broker Scams.</h2>
            </div>
            <p className="about-lead-desc">
              Most online locksmith listings are offshore call-centers quoting fake $15 service fees, only to dispatch unvetted subcontractors who drill your locks and demand $400+. 888 Lock &amp; Key was founded to be the licensed, transparent alternative.
            </p>
          </div>

          <div className="about-showcase-grid">
            <div className="about-pillars-grid">
              <div className="about-pillar-card">
                <div className="pillar-icon-box">
                  <Icon name="shield" />
                </div>
                <h3>100% Upfront Firm Pricing</h3>
                <p>
                  We quote your exact total on the phone before our technician is dispatched. What we quote is what you pay—never any travel fees or surprise doorstep upcharges.
                </p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon-box">
                  <Icon name="key" />
                </div>
                <h3>Non-Destructive Entry First</h3>
                <p>
                  Over 96% of our lockout calls are resolved using precision lock-picks and bypass tools. We never drill your locks unless the hardware has suffered irreparable mechanical failure.
                </p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon-box">
                  <Icon name="people" />
                </div>
                <h3>W-2 Badged &amp; Screened Techs</h3>
                <p>
                  Every locksmith is a direct employee, Live Scan fingerprinted, state licensed, and covered by $2,000,000 in commercial liability insurance for complete peace of mind.
                </p>
              </div>

              <div className="about-pillar-card">
                <div className="pillar-icon-box">
                  <Icon name="building" />
                </div>
                <h3>Real Physical Shops &amp; Mobile Fleet</h3>
                <p>
                  We operate real walk-in retail service centers and a fleet of mobile workshop vans stocked with computerized laser key cutters and OBD-II key diagnostic computers.
                </p>
              </div>
            </div>

            <div className="about-showcase-img-card">
              <Image
                src="/images/about-van.jpg"
                alt="888 Lock & Key licensed locksmith technician with mobile workshop service van"
                width={700}
                height={550}
                className="about-van-photo"
              />
              <div className="about-photo-glass-badge">
                <span className="livedot" />
                <div>
                  <strong>Official 888 Mobile Workshop Fleet</strong>
                  <span>Stocked with laser cutters, 1,500+ blanks &amp; diagnostic computers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-banner-strip">
            <div className="about-stat-item">
              <span className="stat-num">15–25m</span>
              <span className="stat-desc">Average Rapid Arrival</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat-item">
              <span className="stat-num">25,000+</span>
              <span className="stat-desc">Completed Lockouts &amp; Installs</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat-item">
              <span className="stat-num">6 Hubs</span>
              <span className="stat-desc">Physical Walk-in Locations</span>
            </div>
            <div className="about-stat-divider" />
            <div className="about-stat-item">
              <span className="stat-num">90 Days</span>
              <span className="stat-desc">Workmanship &amp; Parts Warranty</span>
            </div>
            <div className="about-action-btn">
              <Link href="/about" className="btn btn-primary">
                Our Story &amp; Standards <Icon name="arrow" />
              </Link>
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
          <div className="faq-split-grid">
            <div className="faq-intro-col">
              <div className="eyebrow eyebrow-dash">{home.faqEyebrow ?? 'FREQUENTLY ASKED QUESTIONS'}</div>
              <h2>{home.faqHeading ?? 'Clear answers before our van even rolls.'}</h2>
              <p className="faq-intro-desc">
                Have questions about pricing, lockouts, or arrival times? We believe in 100% upfront clarity—no surprises, no mystery call-out fees.
              </p>

              <div className="faq-dispatch-box">
                <div className="faq-dispatch-img-wrap">
                  <Image
                    src="/images/faq-support.jpg"
                    alt="24/7 Locksmith Live Emergency Dispatch Support Desk"
                    width={500}
                    height={320}
                    className="faq-support-img"
                  />
                  <span className="faq-img-badge">
                    <span className="livedot" /> Live GPS Dispatch
                  </span>
                </div>
                <div className="faq-dispatch-header">
                  <strong>24/7 Live Emergency Dispatch Desk</strong>
                </div>
                <p>Need urgent assistance? A licensed technician is staged near your neighborhood right now.</p>
                <a href={`tel:${settings.phoneHref}`} className="btn btn-primary btn-block">
                  <Icon name="phone" /> Call {settings.phone}
                </a>
                <div className="faq-dispatch-badges">
                  <span><Icon name="clock" /> 15–25 min avg arrival</span>
                  <span><Icon name="shield" /> Licensed &amp; Insured</span>
                </div>
              </div>

              <div className="faq-more-link">
                <span>Looking for car key or master key answers?</span>
                <Link href="/faq" className="link-arrow">
                  Explore full 20+ FAQ library <Icon name="arrow" />
                </Link>
              </div>
            </div>

            <div className="faq-list-col">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage
