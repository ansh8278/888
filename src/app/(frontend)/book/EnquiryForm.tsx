'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '../../../components/Icon'

type Option = { label: string; value: string }

type Props = {
  type: 'order' | 'quote' | 'contact'
  services: Option[]
  cities: Option[]
  submitLabel: string
}

type State = 'idle' | 'sending' | 'sent' | 'error'

export const EnquiryForm = ({ type, services, cities, submitLabel }: Props) => {
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setState('sending')
    setError(null)

    const form = event.currentTarget
    const payload = Object.fromEntries(new FormData(form).entries())

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, type, sourcePage: window.location.pathname }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong. Please call us instead.')
      }
      setState('sent')
      form.reset()
      // A real URL for the confirmation, so it can carry conversion tracking
      // and survives a refresh. The inline success below is the fallback if
      // navigation is blocked for any reason.
      router.push('/thank-you')
    } catch (err) {
      setState('error')
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (state === 'sent') {
    return (
      <div className="form-success" role="status">
        <Icon name="check" />
        <div>
          <strong>Request received.</strong>
          <p>A dispatcher will call you shortly. If it is an emergency, calling is still fastest.</p>
        </div>
      </div>
    )
  }

  return (
    <form className="enquiry-form" onSubmit={onSubmit} noValidate={false}>
      <div className="form-row">
        <label className="field">
          <span>Your name</span>
          <input type="text" name="name" required autoComplete="name" placeholder="Alex Morgan" />
        </label>
        <label className="field">
          <span>Phone number</span>
          <input
            type="tel"
            name="phone"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="(408) 555-0199"
          />
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span>What do you need?</span>
          <div className="select-wrap">
            <select name="serviceLabel" defaultValue={services[0]?.value ?? ''}>
              {services.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <Icon name="chevron" className="select-chevron" />
          </div>
        </label>
        <label className="field">
          <span>City or ZIP</span>
          <div className="select-wrap">
            <select name="cityLabel" defaultValue={cities[0]?.value ?? ''}>
              {cities.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <Icon name="chevron" className="select-chevron" />
          </div>
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span>When?</span>
          <div className="select-wrap">
            <select name="when" defaultValue="Right now — emergency">
              <option>Right now — emergency</option>
              <option>Later today</option>
              <option>Tomorrow</option>
              <option>This week</option>
            </select>
            <Icon name="chevron" className="select-chevron" />
          </div>
        </label>
        <label className="field">
          <span>Email (optional)</span>
          <input type="email" name="email" autoComplete="email" placeholder="you@example.com" />
        </label>
      </div>

      <label className="field">
        <span>Anything else? (optional)</span>
        <textarea name="message" rows={3} placeholder="Vehicle make and model, door type, gate code…" />
      </label>

      {/* Bots fill hidden fields; people do not. Cheaper than a captcha. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />

      <button type="submit" className="btn-hero-primary form-submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : submitLabel}
      </button>

      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
