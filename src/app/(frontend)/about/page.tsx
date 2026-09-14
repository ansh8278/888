import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '../../../components/Hero'
import { CtaBanner } from '../../../components/blocks'
import { getSiteSettings, getLocations, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, localBusinessSchema, absolute } from '../../../lib/schema'
import { Icon } from '../../../components/Icon'

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()
  return {
    title: `About Us — Real Locksmiths, Real Shops & Upfront Pricing | ${settings.companyName ?? '888 Lock & Key'}`,
    description:
      'Discover why thousands of homeowners, drivers, and businesses trust 888 Lock & Key. We operate physical walk-in shops and a 24/7 mobile fleet with upfront flat pricing and licensed, badged W-2 locksmiths.',
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
        title="Real Locksmiths. Real Shops. Upfront Honest Pricing."
        intro="Founded to permanently eliminate deceptive locksmith scams, 888 Lock & Key operates physical walk-in storefronts and an agile 24/7 mobile workshop fleet across California, Arizona, and New York."
        crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
      />

      {/* Trust Badges Strip */}
      <section className="about-trust-strip">
        <div className="wrap">
          <div className="about-trust-pills">
            <div className="about-trust-pill">
              <Icon name="shield" />
              <span><strong>BSIS Licensed</strong> #{settings.licenseNumber || 'LCO-000000'}</span>
            </div>
            <div className="about-trust-pill">
              <Icon name="bolt" />
              <span><strong>$2,000,000</strong> Liability Insured</span>
            </div>
            <div className="about-trust-pill">
              <Icon name="people" />
              <span><strong>W-2 Employed</strong> &amp; Fingerprinted Techs</span>
            </div>
            <div className="about-trust-pill">
              <Icon name="check" />
              <span><strong>90-Day</strong> Workmanship Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Impact Numbers */}
      <section className="sec sec-tight">
        <div className="wrap">
          <div className="about-stats-grid">
            <div className="about-stat-card">
              <div className="about-stat-number">{settings.averageArrival || '15–25m'}</div>
              <div className="about-stat-label">Average On-Site Arrival</div>
              <p className="about-stat-sub">GPS-dispatched mobile units staged across every metro zone.</p>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-number">25,000+</div>
              <div className="about-stat-label">Jobs Successfully Completed</div>
              <p className="about-stat-sub">Automotive lockouts, rekeying, master systems &amp; installations.</p>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-number">6 Hubs</div>
              <div className="about-stat-label">Physical Retail &amp; Dispatch Centers</div>
              <p className="about-stat-sub">Walk-in key cutting, lock repair, and central fleet coordination.</p>
            </div>
            <div className="about-stat-card">
              <div className="about-stat-number">{settings.rating || '4.9'} ★</div>
              <div className="about-stat-label">Google Verified Rating</div>
              <p className="about-stat-sub">Based on {settings.reviewCount || '1,200'}+ verified customer reviews.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Story & Industry Comparison */}
      <section className="sec sec-sand">
        <div className="wrap">
          <div className="about-editorial-grid">
            <div className="about-story-col">
              <div className="eyebrow eyebrow-dash">OUR ORIGIN STORY</div>
              <h2>The Locksmith Industry Had an Honesty Problem. We Fixed It.</h2>
              <div className="about-story-text">
                <p>
                  For years, online search results for &ldquo;emergency locksmith&rdquo; have been dominated by lead-broker call centers. These middlemen advertise unrealistic &ldquo;$15 service calls&rdquo; to bait stressed, locked-out drivers and homeowners.
                </p>
                <p>
                  When the subcontractor arrives in an unmarked car, they quickly claim the lock is &ldquo;unpickable,&rdquo; drill it into pieces with a cordless tool, and demand $300 to $600 in cash. Once paid, the phone number is disconnected and the customer is left with a damaged door and cheap replacement hardware.
                </p>
                <p>
                  <strong>888 Lock &amp; Key was created to provide the complete opposite:</strong> We operate real physical walk-in shops with permanent addresses. Every technician is an insured W-2 employee in uniform. We prioritize non-destructive picking, publish our starting rates, and guarantee your quote over the phone before our wheels turn.
                </p>
              </div>

              <div className="about-story-quote">
                <blockquote>
                  &ldquo;If a locksmith quotes you $15 on the phone and drills your deadbolt without trying to pick it, you are being scammed. We built 888 to bring genuine master craftsmanship and transparency back to security.&rdquo;
                </blockquote>
                <div className="quote-author">
                  <strong>The 888 Lock &amp; Key Founding Team</strong>
                  <span>Master Locksmiths &amp; Dispatch Directors</span>
                </div>
              </div>
            </div>

            <div className="about-comparison-col">
              <div className="comparison-card">
                <div className="comparison-head">
                  <h3>The 888 Standard vs. The Industry Average</h3>
                  <p>How our operational model protects you from bait-and-switch tactics</p>
                </div>

                <div className="comparison-table">
                  <div className="comp-row comp-header">
                    <div className="comp-feature">Standard</div>
                    <div className="comp-us">888 Lock &amp; Key</div>
                    <div className="comp-them">Typical Competitor</div>
                  </div>

                  <div className="comp-row">
                    <div className="comp-feature">
                      <strong>Pricing Policy</strong>
                    </div>
                    <div className="comp-us">
                      <Icon name="check" /> Firm flat rate quoted before dispatch
                    </div>
                    <div className="comp-them">
                      <span>&ldquo;$15 service fee&rdquo; bait-and-switch at door</span>
                    </div>
                  </div>

                  <div className="comp-row">
                    <div className="comp-feature">
                      <strong>Lock Entry Method</strong>
                    </div>
                    <div className="comp-us">
                      <Icon name="check" /> Non-destructive picking first (96%+ rate)
                    </div>
                    <div className="comp-them">
                      <span>Immediate drilling to sell cheap replacement</span>
                    </div>
                  </div>

                  <div className="comp-row">
                    <div className="comp-feature">
                      <strong>Technician Status</strong>
                    </div>
                    <div className="comp-us">
                      <Icon name="check" /> Direct W-2 employees, Live Scan screened
                    </div>
                    <div className="comp-them">
                      <span>Untrained 1099 lead buyers in unmarked cars</span>
                    </div>
                  </div>

                  <div className="comp-row">
                    <div className="comp-feature">
                      <strong>Equipment &amp; Fleet</strong>
                    </div>
                    <div className="comp-us">
                      <Icon name="check" /> Laser cutters &amp; diagnostic computers onboard
                    </div>
                    <div className="comp-them">
                      <span>Basic hand tools and drill set only</span>
                    </div>
                  </div>

                  <div className="comp-row">
                    <div className="comp-feature">
                      <strong>Accountability &amp; Warranty</strong>
                    </div>
                    <div className="comp-us">
                      <Icon name="check" /> Physical shops + 90-day written guarantee
                    </div>
                    <div className="comp-them">
                      <span>No physical address, no warranty, burner phones</span>
                    </div>
                  </div>
                </div>

                <div className="comp-footer">
                  <a href={`tel:${settings.phoneHref}`} className="btn btn-primary btn-block">
                    <Icon name="phone" /> Speak With a Licensed Dispatcher
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Operational Commitments */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head-center">
            <div>
              <div className="eyebrow eyebrow-dash">OUR CODE OF ETHICS</div>
              <h2>4 Core Commitments to Every Customer</h2>
              <p className="sec-sub-center">
                Whether you are stranded in a parking lot at 2:00 AM or upgrading an entire commercial facility, these four rules govern every job we take.
              </p>
            </div>
          </div>

          <div className="about-commitments-grid">
            <div className="commitment-card">
              <div className="commit-num">01</div>
              <div className="commit-icon"><Icon name="shield" /></div>
              <h3>100% Upfront Pricing Integrity</h3>
              <p>
                We ask the right questions during dispatch so we can quote a firm, all-inclusive price before sending a van. If a lock has hidden structural damage upon arrival, our technician explains the issue and gives you a revised quote in writing before touching anything.
              </p>
            </div>

            <div className="commitment-card">
              <div className="commit-num">02</div>
              <div className="commit-icon"><Icon name="lock" /></div>
              <h3>Mandatory Ownership Verification</h3>
              <p>
                A locksmith holds immense power over property access. To protect homeowners, tenants, and drivers, we require valid government-issued photo ID and proof of residence or vehicle registration before bypassing any lock. We never open a door for someone who cannot prove authorization.
              </p>
            </div>

            <div className="commitment-card">
              <div className="commit-num">03</div>
              <div className="commit-icon"><Icon name="key" /></div>
              <h3>Non-Destructive Entry Priority</h3>
              <p>
                Drilling a lock should always be the absolute last resort, not the first step. Our vans carry specialized lock decoders, tension wrenches, and auto air wedges. Over 96% of lockouts are opened with the original lock intact and undamaged.
              </p>
            </div>

            <div className="commitment-card">
              <div className="commit-num">04</div>
              <div className="commit-icon"><Icon name="bolt" /></div>
              <h3>Continuous Training &amp; High-End Tech</h3>
              <p>
                Modern vehicles and smart access systems require electronic expertise. Our technicians receive continuous training on automotive transponder cryptography, high-security laser key cutting, and commercial ADA/life-safety compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Inside an 888 Mobile Workshop */}
      <section className="sec sec-sand">
        <div className="wrap">
          <div className="fleet-showcase-box">
            <div className="fleet-showcase-content">
              <div className="eyebrow eyebrow-dash">THE 888 MOBILE FLEET</div>
              <h2>What&apos;s Inside Our Mobile Workshops?</h2>
              <p>
                When an 888 Lock &amp; Key van arrives, you are not receiving a technician with a toolbox—you are getting a complete commercial lock &amp; key laboratory on wheels.
              </p>

              <div className="fleet-features-grid">
                <div className="fleet-feature-item">
                  <div className="fleet-feature-dot" />
                  <div>
                    <strong>Computerized Laser Key Cutters</strong>
                    <p>High-precision automated CNC key machines (Condor &amp; HPC) that cut automotive laser side-milled keys and commercial mortise keys to exact factory micrometer depth.</p>
                  </div>
                </div>

                <div className="fleet-feature-item">
                  <div className="fleet-feature-dot" />
                  <div>
                    <strong>OBD-II Transponder Key Diagnostic Computers</strong>
                    <p>Direct ECU diagnostic interfaces capable of reading immobilizer pin codes and programming smart push-to-start fobs for Toyota, Ford, BMW, Audi, Mercedes, and more.</p>
                  </div>
                </div>

                <div className="fleet-feature-item">
                  <div className="fleet-feature-dot" />
                  <div>
                    <strong>1,500+ Key Blanks &amp; OEM Fobs Stocked</strong>
                    <p>Massive inventory carried on every van, ensuring 98% of replacement key jobs are completed on the first trip without waiting for parts.</p>
                  </div>
                </div>

                <div className="fleet-feature-item">
                  <div className="fleet-feature-dot" />
                  <div>
                    <strong>Full Pinning Stations &amp; Master Rekeying Kits</strong>
                    <p>Lab pinning stations for Schlage, Kwikset, Yale, Sargent, Corbin Russwin, and Medeco cylinders, allowing instant on-site rekeying and master key charting.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="fleet-showcase-side">
              <div className="fleet-badge-card">
                <div className="fleet-badge-icon">
                  <Icon name="car" />
                </div>
                <h3>Active Mobile Fleet</h3>
                <p>Liveried, GPS-tracked mobile service vehicles operating 24 hours a day, 7 days a week.</p>
                <div className="fleet-spec-list">
                  <div><span>Response Time</span><strong>15–25 Mins</strong></div>
                  <div><span>Service Radius</span><strong>Full Metro Areas</strong></div>
                  <div><span>Dispatch</span><strong>24/7 Live Operators</strong></div>
                  <div><span>Coverage</span><strong>CA · AZ · NY</strong></div>
                </div>
                <a href={`tel:${settings.phoneHref}`} className="btn btn-primary btn-block">
                  <Icon name="phone" /> Request Mobile Unit Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Physical Locations Hub */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-head-center">
            <div>
              <div className="eyebrow eyebrow-dash">BRICK &amp; MORTAR HUBS</div>
              <h2>Our Walk-In Shops &amp; Regional Service Centers</h2>
              <p className="sec-sub-center">
                Unlike broker networks that only exist on paper, 888 Lock &amp; Key operates physical stores where you can walk in for key duplication, lock rekeying, or hardware advice.
              </p>
            </div>
          </div>

          <div className="about-locs-grid">
            {locations.map((loc) => (
              <div key={loc.id} className="about-loc-card">
                <div className="about-loc-header">
                  <h3>{loc.shopName ?? `${loc.city} Hub`}</h3>
                  {loc.badge ? <span className="loc-badge">{loc.badge}</span> : null}
                </div>
                <div className="about-loc-sub">{loc.shopSubtitle ?? `${loc.city}, ${loc.stateAbbr}`}</div>
                {loc.addressLine ? (
                  <p className="about-loc-addr">
                    <Icon name="pin" /> {loc.addressLine}, {loc.city}, {loc.stateAbbr} {loc.postcode}
                  </p>
                ) : null}
                <div className="about-loc-hours">
                  <span className="livedot" /> {loc.hours ?? 'Open 24/7 for mobile dispatch'}
                </div>
                <Link href={`/locations/${loc.slug}`} className="about-loc-link">
                  View {loc.city} Services <Icon name="arrow" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 90-Day Guarantee Banner */}
      <section className="about-warranty-sec">
        <div className="wrap">
          <div className="about-warranty-box">
            <div className="about-warranty-left">
              <div className="about-warranty-shield">
                <Icon name="shield" />
              </div>
              <div>
                <h2>Backed by Our 90-Day Workmanship &amp; Hardware Guarantee</h2>
                <p>
                  Every lock installed, rekeyed cylinder, or automotive key programmed by 888 Lock &amp; Key carries an all-inclusive 90-day warranty. If hardware fails or a cylinder binds, our technician returns and resolves it immediately at zero cost.
                </p>
              </div>
            </div>
            <div className="about-warranty-actions">
              <a href={`tel:${settings.phoneHref}`} className="btn btn-primary">
                <Icon name="phone" /> Call {settings.phone}
              </a>
              <Link href="/book" className="btn btn-secondary">
                Book Service Online
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        heading={copy.ctaHeading ?? 'Ready for honest, professional locksmith service?'}
        subtitle={copy.ctaSubtitle ?? 'Call our 24/7 live dispatch team for immediate quotes and rapid dispatch.'}
      />
    </>
  )
}

export default AboutPage
