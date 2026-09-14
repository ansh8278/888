'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Icon } from './Icon'
import type { Faq } from '../payload-types'

export type FaqCategory = 'all' | 'pricing' | 'automotive' | 'residential' | 'commercial'

export interface CleanFaq {
  id: string | number
  question: string
  answer: string
  category: 'pricing' | 'automotive' | 'residential' | 'commercial'
}

export const AUTHENTIC_FAQS: CleanFaq[] = [
  {
    id: 'faq-1',
    category: 'pricing',
    question: 'Are you fully licensed and insured?',
    answer:
      'Yes. 888 Lock & Key holds official state Locksmith Company licensing, and all technicians are individually background-checked, Live Scan fingerprinted, and badged.',
  },
  {
    id: 'faq-2',
    category: 'pricing',
    question: 'How fast can a technician arrive?',
    answer:
      'Our mobile vans are mobile workshops dispatched by GPS from the closest service location in real time. We provide an estimated arrival time when you call.',
  },
  {
    id: 'faq-3',
    category: 'pricing',
    question: 'How do you determine your pricing?',
    answer:
      'We quote a firm price on the phone before dispatching a technician. If an on-site inspection reveals additional work or parts are required, we explain the cost and obtain your approval before proceeding.',
  },
  {
    id: 'faq-4',
    category: 'pricing',
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit and debit cards, Apple Pay, Google Pay, Zelle, and cash. Payment is collected once the work is completed to your satisfaction.',
  },
  {
    id: 'faq-5',
    category: 'pricing',
    question: 'Do you charge extra at night, on weekends, or holidays?',
    answer:
      'Emergency calls late at night carry a flat after-hours fee that is quoted to you on the phone before we dispatch. Standard weekend and holiday calls are billed at regular rates.',
  },
  {
    id: 'faq-6',
    category: 'pricing',
    question: 'Is there a warranty on parts and labour?',
    answer:
      'Every installation carries a 90-day workmanship warranty. Hardware we supply carries the manufacturer warranty in addition to our installation coverage.',
  },
  {
    id: 'faq-7',
    category: 'automotive',
    question: 'Can you unlock a car without damaging the door or paint?',
    answer:
      'Yes. We utilize specialized non-destructive automotive lock-picks and inflator wedges engineered specifically for all vehicle makes and models.',
  },
  {
    id: 'faq-8',
    category: 'automotive',
    question: 'Can you make a replacement car key if I lost all original keys?',
    answer:
      'Yes. Our mobile service vans carry computerized key cutting equipment and OBD diagnostic programmers to cut and program replacement keys and transponder chips on site.',
  },
  {
    id: 'faq-9',
    category: 'automotive',
    question: 'Do you program push-to-start smart key fobs?',
    answer:
      'Yes. We program keyless entry remotes, flip keys, and proximity push-to-start fobs for most domestic and import vehicle brands.',
  },
  {
    id: 'faq-10',
    category: 'automotive',
    question: 'Can you remove a broken key snapped in an ignition or door lock?',
    answer:
      'Yes. We use broken key extraction tools to safely remove the broken fragment without damaging the internal lock cylinder, and can cut a new replacement key on the spot.',
  },
  {
    id: 'faq-11',
    category: 'residential',
    question: 'What do you need from me to prove the property or car is mine?',
    answer:
      'Photo ID matching the address, or for vehicles a registration, title, or insurance document. If your documents are locked inside, our technician will verify your identity immediately upon unlocking.',
  },
  {
    id: 'faq-12',
    category: 'residential',
    question: 'Can you rekey a lock instead of replacing it?',
    answer:
      'Usually, yes—and it is much more economical. If the existing hardware is in good shape, we repin the cylinder so old keys stop working. We only recommend replacement when the hardware is worn or damaged.',
  },
  {
    id: 'faq-13',
    category: 'residential',
    question: 'Can you key all the doors in my home to open with one key?',
    answer:
      'Yes, as long as the locks share the same keyway profile (such as Schlage or Kwikset), we can re-pin all your entry deadbolts and knobs to work with a single convenient key.',
  },
  {
    id: 'faq-14',
    category: 'residential',
    question: 'Can you install smart locks and digital keypads?',
    answer:
      'Yes. We install and align electronic deadbolts and smart locks from leading brands, ensuring smooth motorized bolt operation and proper door alignment.',
  },
  {
    id: 'faq-15',
    category: 'commercial',
    question: 'What commercial locksmith services do you provide?',
    answer:
      'We design and install master key systems, panic exit crash bars, commercial storefront mortise locks, door closers, and digital keypad access systems for offices, clinics, and retail stores.',
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
  const [openId, setOpenId] = useState<string | number | null>('faq-1')

  const allFaqs = useMemo<CleanFaq[]>(() => {
    if (!initialFaqs || initialFaqs.length === 0) return AUTHENTIC_FAQS

    const cmsItems: CleanFaq[] = initialFaqs.map((f) => {
      const q = f.question.toLowerCase()
      let cat: CleanFaq['category'] = 'pricing'
      if (q.includes('car') || q.includes('vehicle') || q.includes('ignition') || q.includes('fob')) {
        cat = 'automotive'
      } else if (q.includes('home') || q.includes('house') || q.includes('rekey') || q.includes('residential')) {
        cat = 'residential'
      } else if (q.includes('commercial') || q.includes('business') || q.includes('master key') || q.includes('panic')) {
        cat = 'commercial'
      }
      return {
        id: f.id,
        question: f.question,
        answer: f.answer,
        category: cat,
      }
    })

    const existingQuestions = new Set(cmsItems.map((c) => c.question.toLowerCase().trim()))
    const uniqueDefaults = AUTHENTIC_FAQS.filter(
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

  const categories: { key: FaqCategory; label: string }[] = [
    { key: 'all', label: 'All Questions' },
    { key: 'pricing', label: 'Pricing & Service' },
    { key: 'automotive', label: 'Automotive' },
    { key: 'residential', label: 'Residential' },
    { key: 'commercial', label: 'Commercial' },
  ]

  const toggleFaq = (id: string | number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <div className="faq-explorer-simple">
      {/* Category Pills & Search */}
      <div className="faq-filter-bar">
        <div className="faq-pills-row" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat.key}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.key}
              className={`faq-pill-btn ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="faq-search-inline">
          <Icon name="search" className="search-icon" />
          <input
            type="text"
            placeholder="Search questions (e.g. car, rekey, pricing)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search questions"
          />
          {searchQuery ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              &times;
            </button>
          ) : null}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="faq-columns-layout">
        {/* Accordion Questions */}
        <div className="faq-accordion-container">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-simple">
              <p>No questions found matching &ldquo;{searchQuery}&rdquo;.</p>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
              >
                Clear Search
              </button>
            </div>
          ) : (
            <div className="faq-clean-list">
              {filteredFaqs.map((faq) => {
                const isOpen = openId === faq.id
                return (
                  <div key={faq.id} className={`faq-clean-item ${isOpen ? 'open' : ''}`}>
                    <button
                      type="button"
                      className="faq-clean-btn"
                      onClick={() => toggleFaq(faq.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="faq-question-text">{faq.question}</span>
                      <span className="faq-toggle-icon" aria-hidden="true">
                        <Icon name="chevron" />
                      </span>
                    </button>
                    {isOpen ? (
                      <div className="faq-clean-answer">
                        <p>{faq.answer}</p>
                      </div>
                    ) : null}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar Dispatch Card */}
        <aside className="faq-simple-sidebar">
          <div className="faq-contact-card">
            <h3>Need Immediate Help?</h3>
            <p>
              Our mobile technicians are available 24/7 for automotive, home, and business locksmith emergencies.
            </p>
            <a href={`tel:${phoneHref}`} className="btn btn-primary btn-block">
              <Icon name="phone" /> Call {phone}
            </a>
            <div className="faq-contact-links">
              <Link href="/book" className="link-arrow">
                Book a service appointment <Icon name="arrow" />
              </Link>
              <Link href="/locations" className="link-arrow">
                View all service locations <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
