'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Icon } from './Icon'
import { CallButton } from './CallButton'
import type { Phone } from '../lib/contact'
import type { Faq } from '../payload-types'

export type FaqCategory = 'all' | 'pricing' | 'automotive' | 'residential' | 'commercial'

export interface CleanFaq {
  id: string | number
  question: string
  answer: string
  category: 'pricing' | 'automotive' | 'residential' | 'commercial'
}


type Props = {
  initialFaqs?: Faq[]
  phone: Phone | null
}

export const FaqExplorer = ({ initialFaqs, phone }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState<string | number | null>('faq-1')

  // Only questions written in the admin are shown: nothing hard-coded, so no
  // claim can appear on the site that the business has not entered itself.
  const allFaqs = useMemo<CleanFaq[]>(() => {
    return (initialFaqs ?? []).map((f) => {
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
            <p>Mobile technicians dispatched across San Jose and the Bay Area for automotive, home and business locksmith needs.</p>
            <CallButton phone={phone} className="btn btn-primary btn-block" />
            <div className="faq-contact-links">
              <Link href="/book" className="link-arrow">
                <span>Book a service appointment</span>
                <Icon name="arrow" width={15} height={15} />
              </Link>
              <Link href="/bay-area-locksmith" className="link-arrow">
                <span>View all service areas</span>
                <Icon name="arrow" width={15} height={15} />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
