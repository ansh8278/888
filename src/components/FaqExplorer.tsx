'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Icon } from './Icon'
import type { Faq } from '../payload-types'

export type FaqCategory = 'all' | 'pricing' | 'automotive' | 'residential' | 'commercial'

export interface EnrichedFaq {
  id: string | number
  question: string
  answer: string
  category: 'pricing' | 'automotive' | 'residential' | 'commercial'
}

export const COMPREHENSIVE_FAQS: EnrichedFaq[] = [
  {
    id: 'pricing-1',
    category: 'pricing',
    question: 'How do you price your locksmith services?',
    answer:
      'We believe in 100% upfront flat-rate pricing. When you call our 24/7 dispatch, we ask about your lock or vehicle type and quote the exact total cost before a technician is dispatched. What we quote on the phone is what you pay—never any hidden call-out fees, mileage surcharges, or surprises on site.',
  },
  {
    id: 'pricing-2',
    category: 'pricing',
    question: 'How fast can a technician arrive at my location?',
    answer:
      'Our average arrival time across all service areas is 15 to 25 minutes. We operate mobile workshop vans staged strategically across California, Arizona, and New York, dispatched by real-time GPS tracking from the closest available unit.',
  },
  {
    id: 'pricing-3',
    category: 'pricing',
    question: 'Are your locksmiths fully licensed, bonded, and insured?',
    answer:
      'Yes, 100%. 888 Lock & Key is a state-licensed locksmith company (BSIS Locksmith License #LCO-000000) and carries $2,000,000 in commercial general liability insurance. Every technician is a direct W-2 employee who has completed state Live Scan fingerprinting and comprehensive criminal background checks.',
  },
  {
    id: 'pricing-4',
    category: 'pricing',
    question: 'Do you charge extra for night, weekend, or holiday calls?',
    answer:
      'Emergency call-outs between 10pm and 6am carry a clear, flat after-hours fee that is quoted to you on the phone before dispatch. Standard weekends and holidays carry no surge pricing—our flat daytime rates remain identical 365 days a year.',
  },
  {
    id: 'pricing-5',
    category: 'pricing',
    question: 'What payment methods do you accept?',
    answer:
      'All our mobile units carry secure point-of-sale card readers accepting Visa, MasterCard, American Express, Discover, Apple Pay, Google Pay, Zelle, and cash. You only pay once the job is fully completed and tested to your satisfaction.',
  },
  {
    id: 'pricing-6',
    category: 'pricing',
    question: 'What warranty do you offer on locks and workmanship?',
    answer:
      'Every installation, rekey, and repair carries an all-inclusive 90-day workmanship warranty. Hardware we supply is additionally covered by full manufacturer warranties (up to lifetime on select commercial grade deadbolts). If anything fails, our technician returns and resolves it at no charge.',
  },
  {
    id: 'auto-1',
    category: 'automotive',
    question: 'Can you unlock my vehicle without scratching the paint or damaging weatherstripping?',
    answer:
      'Yes, guaranteed. Our technicians use professional non-destructive automotive entry equipment—including scratch-free coated air wedges, long-reach bypass tools, and specialized Lishi keyway decoders. We never use coat hangers or pry bars that could bend doors or mar your paint.',
  },
  {
    id: 'auto-2',
    category: 'automotive',
    question: 'Can you make a replacement car key if all original keys are lost?',
    answer:
      'Yes. Our mobile workshop vans are outfitted with computerized laser key cutting machines and OBD-II transponder programming computers. We can decode your vehicle ignition on site, cut a factory-spec high-security key blade, and program the transponder chip on the spot.',
  },
  {
    id: 'auto-3',
    category: 'automotive',
    question: 'Do you program proximity push-to-start smart key fobs?',
    answer:
      'Yes. We program push-button start smart keys, flip keys, and proximity remotes for over 95% of domestic and import vehicles—including Toyota, Honda, Ford, Chevrolet, Nissan, BMW, Mercedes-Benz, Audi, Hyundai, Kia, and Subaru—at a fraction of dealership prices.',
  },
  {
    id: 'auto-4',
    category: 'automotive',
    question: 'My key snapped off inside the ignition or door lock. Can it be saved?',
    answer:
      'Yes. We use micro-hook broken key extractors to safely slide the broken piece out without damaging the internal tumblers. Once extracted, we can trace or code-cut a fresh replacement key immediately from the mobile workshop.',
  },
  {
    id: 'auto-5',
    category: 'automotive',
    question: 'Can you program foreign and luxury vehicle keys (BMW, Mercedes, Audi)?',
    answer:
      'Yes. Our advanced diagnostic programmers support European vehicles requiring EEPROM reading, CAS/FEM programming (BMW), EIS/FBS3 systems (Mercedes-Benz), and VAG immobilizers (Audi/VW). We test every function before completing the service.',
  },
  {
    id: 'res-1',
    category: 'residential',
    question: 'Should I rekey my locks or replace the hardware completely?',
    answer:
      'If your existing deadbolts and locksets are in good mechanical condition, rekeying is significantly faster and more economical. During a rekey, we replace the internal brass pins inside the cylinder so old keys no longer work. We only recommend replacement if the hardware is damaged, worn out, or if you want to upgrade to high-security or smart locks.',
  },
  {
    id: 'res-2',
    category: 'residential',
    question: 'What do I need to show to prove the home or apartment is mine?',
    answer:
      'To prevent unlawful entry and protect property owners, our technicians are legally required to verify ownership. You will need a valid government-issued photo ID matching the address, a current lease agreement, or recent utility bill. If your ID is locked inside, we verify it immediately upon unlocking the door.',
  },
  {
    id: 'res-3',
    category: 'residential',
    question: 'Can you install smart locks and keypad deadbolts that I purchased myself?',
    answer:
      'Yes. We install and calibrate all customer-supplied smart locks—including Schlage Encode, Yale Assure, August Wi-Fi, and Ultraloq. We ensure exact latch alignment so the motorized bolt extends smoothly without jamming or draining the lock batteries prematurely.',
  },
  {
    id: 'res-4',
    category: 'residential',
    question: 'Can you key all the doors in my home to open with a single key?',
    answer:
      'Yes! As long as your deadbolts and door knobs share the same keyway profile (such as Schlage C or Kwikset KW1), we can re-pin every lock in your home so you only need to carry one convenient master key for your front, back, and garage entry doors.',
  },
  {
    id: 'res-5',
    category: 'residential',
    question: 'Can you pick high-security deadbolts without drilling them?',
    answer:
      'Yes. Our technicians are trained in advanced lock manipulation, bypass techniques, and specialized pick tools. In over 96% of lockout calls, we open doors without drilling. We only drill as a last resort when the internal mechanism has physically failed, and only with your prior explicit consent.',
  },
  {
    id: 'com-1',
    category: 'commercial',
    question: 'What is a Master Key System and how does it protect my business?',
    answer:
      'A Master Key System allows individual employees to open only their designated offices or store areas, while managers carry a single master key that opens all doors. We design, cut, and document custom master key matrices for commercial offices, retail plazas, clinics, and multi-tenant buildings.',
  },
  {
    id: 'com-2',
    category: 'commercial',
    question: 'Do you install and service commercial panic exit crash bars and fire doors?',
    answer:
      'Yes. We supply and install heavy-duty ANSI Grade 1 rim and vertical rod panic exit bars, alarm-equipped exit devices, and hydraulic door closers compliant with NFPA 101 Life Safety Code and local fire marshal accessibility regulations.',
  },
  {
    id: 'com-3',
    category: 'commercial',
    question: 'How fast can you rekey our commercial building after employee turnover?',
    answer:
      'We offer priority same-day and after-hours commercial rekeying to prevent business disruption. Our mobile technicians can re-pin standard mortise cylinders, interchangeable core (IC) cylinders, and keypads on site within a few hours.',
  },
  {
    id: 'com-4',
    category: 'commercial',
    question: 'Do you offer keyless commercial access control systems?',
    answer:
      'Yes. We install standalone digital keypad locks, heavy-duty smart cylinders, electromagnetic locks, electric strikes, and proximity card/fob access systems tailored for offices, retail stores, and warehouse facilities.',
  },
]

type Props = {
  initialFaqs?: Faq[]
  phone: string
  phoneHref: string
}

export const FaqExplorer = ({ initialFaqs, phone, phoneHref }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState<string | number | null>('pricing-1')

  // Merge CMS faqs if any are provided, classifying them cleanly
  const allFaqs = useMemo<EnrichedFaq[]>(() => {
    if (!initialFaqs || initialFaqs.length === 0) return COMPREHENSIVE_FAQS

    const cmsItems: EnrichedFaq[] = initialFaqs.map((f) => {
      const q = f.question.toLowerCase()
      let cat: EnrichedFaq['category'] = 'pricing'
      if (q.includes('car') || q.includes('vehicle') || q.includes('ignition') || q.includes('fob')) {
        cat = 'automotive'
      } else if (q.includes('home') || q.includes('house') || q.includes('rekey') || q.includes('residential')) {
        cat = 'residential'
      } else if (q.includes('business') || q.includes('commercial') || q.includes('master key') || q.includes('panic')) {
        cat = 'commercial'
      }
      return {
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: cat,
      }
    })

    // Combine with comprehensive list, avoiding duplicate questions
    const existingQuestions = new Set(cmsItems.map((c) => c.question.toLowerCase().trim()))
    const uniqueDefaults = COMPREHENSIVE_FAQS.filter(
      (df) => !existingQuestions.has(df.question.toLowerCase().trim()),
    )
    return [...cmsItems, ...uniqueDefaults]
  }, [initialFaqs])

  const filteredFaqs = useMemo(() => {
    return allFaqs.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
      if (!matchesCategory) return false

      if (!searchQuery.trim()) return true
      const query = searchQuery.toLowerCase().trim()
      return (
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
      )
    })
  }, [allFaqs, selectedCategory, searchQuery])

  const categories: { key: FaqCategory; label: string; icon: 'key' | 'shield' | 'car' | 'home' | 'building' }[] = [
    { key: 'all', label: 'All Questions', icon: 'key' },
    { key: 'pricing', label: 'Pricing & Arrival', icon: 'shield' },
    { key: 'automotive', label: 'Automotive & Keys', icon: 'car' },
    { key: 'residential', label: 'Residential & Rekey', icon: 'home' },
    { key: 'commercial', label: 'Commercial & Access', icon: 'building' },
  ]

  const toggleFaq = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="faq-explorer">
      {/* Category Pills & Search Row */}
      <div className="faq-controls">
        <div className="faq-pills" role="tablist" aria-label="FAQ Categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.key}
              className={`faq-pill ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              <Icon name={cat.icon} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="faq-search-wrapper">
          <div className="faq-search-box">
            <Icon name="search" className="faq-search-icon" />
            <input
              type="text"
              placeholder="Search questions (e.g. car key, drill, quote, arrival, rekey)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faq-search-input"
              aria-label="Search frequently asked questions"
            />
            {searchQuery ? (
              <button
                type="button"
                className="faq-search-clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search query"
              >
                &times;
              </button>
            ) : null}
          </div>
          <div className="faq-result-count">
            Showing <strong>{filteredFaqs.length}</strong> of {allFaqs.length} questions
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="faq-main-layout">
        {/* Accordion List Column */}
        <div className="faq-accordion-col">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-state">
              <div className="faq-empty-icon">
                <Icon name="search" />
              </div>
              <h3>No matching questions found</h3>
              <p>We could not find any questions matching &ldquo;{searchQuery}&rdquo;.</p>
              <div className="faq-empty-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  Reset Filters
                </button>
                <a href={`tel:${phoneHref}`} className="btn btn-primary btn-sm">
                  <Icon name="phone" /> Ask Our Dispatch Team
                </a>
              </div>
            </div>
          ) : (
            <div className="faq-rich-list">
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id
                return (
                  <div key={faq.id} className={`faq-card-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="faq-card-head"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <div className="faq-card-head-content">
                        <span className="faq-cat-tag">
                          {faq.category === 'automotive'
                            ? 'Automotive'
                            : faq.category === 'residential'
                            ? 'Residential'
                            : faq.category === 'commercial'
                            ? 'Commercial'
                            : 'Pricing & Policy'}
                        </span>
                        <h3 className="faq-card-q">{faq.question}</h3>
                      </div>
                      <span className={`faq-chevron-indicator ${isOpen ? 'rotate' : ''}`} aria-hidden="true">
                        <Icon name="chevron" />
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="faq-card-body">
                        <p>{faq.answer}</p>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Support & Dispatch Sidebar */}
        <aside className="faq-sidebar-col">
          <div className="faq-sidebar-card faq-dispatch-spotlight">
            <div className="faq-dispatch-img-wrap">
              <Image
                src="/images/faq-support.jpg"
                alt="24/7 Locksmith Live Emergency Dispatch Support Desk"
                width={500}
                height={320}
                className="faq-support-img"
              />
              <span className="faq-img-badge">
                <span className="livedot" /> 24/7 Live Operators
              </span>
            </div>
            <div className="faq-spotlight-status">
              <span className="livedot" />
              <span className="faq-live-label">24/7 Mobile Dispatch Active</span>
            </div>
            <h3>Have an Emergency?</h3>
            <p>
              Our vans are mobile workshops ready to dispatch right now. We arrive in an average of 15–25 minutes with upfront flat pricing.
            </p>
            <a href={`tel:${phoneHref}`} className="btn btn-primary btn-block">
              <Icon name="phone" /> Call {phone}
            </a>
            <div className="faq-quick-perks">
              <div className="faq-perk-item">
                <Icon name="check" />
                <span>100% Upfront Quotes (No Bait &amp; Switch)</span>
              </div>
              <div className="faq-perk-item">
                <Icon name="check" />
                <span>Non-Destructive Entry Priority (No Drilling)</span>
              </div>
              <div className="faq-perk-item">
                <Icon name="check" />
                <span>Licensed, Bonded &amp; Insured ($2M Coverage)</span>
              </div>
              <div className="faq-perk-item">
                <Icon name="check" />
                <span>90-Day Parts &amp; Workmanship Warranty</span>
              </div>
            </div>
          </div>

          <div className="faq-sidebar-card faq-guarantee-box">
            <div className="faq-shield-badge">
              <Icon name="shield" />
            </div>
            <h4>Our 90-Day Guarantee</h4>
            <p>
              Every new lock installed, rekeyed cylinder, or key programmed comes with full 90-day coverage. If it sticks or fails, we return and resolve it at zero cost.
            </p>
            <Link href="/about" className="link-arrow">
              Learn about our standards <Icon name="arrow" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
