'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export const ProgressBar = () => {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  // Reset/complete progress when pathname changes
  useEffect(() => {
    if (loading) {
      setProgress(100)
      const timer = setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [pathname])

  useEffect(() => {
    let progressTimer: NodeJS.Timeout

    if (loading) {
      setProgress(25)
      progressTimer = setTimeout(() => {
        setProgress(70)
        progressTimer = setTimeout(() => {
          setProgress(85)
        }, 300)
      }, 100)
    }

    return () => clearTimeout(progressTimer)
  }, [loading])

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return

      const href = target.getAttribute('href')
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('javascript:') ||
        target.getAttribute('target') === '_blank'
      ) {
        return
      }

      // Check if it's an internal route
      try {
        const url = new URL(href, window.location.href)
        if (url.origin === window.location.origin) {
          // If navigating to the exact same URL + hash, don't show loading
          if (url.pathname === window.location.pathname && url.search === window.location.search) {
            return
          }
          setLoading(true)
          setProgress(20)
        }
      } catch {
        // Ignore invalid URLs
      }
    }

    window.addEventListener('click', handleAnchorClick, { capture: true })
    return () => window.removeEventListener('click', handleAnchorClick, { capture: true })
  }, [])

  if (!loading && progress === 0) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        zIndex: 999999,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #ea580c, #f97316, #fbbf24)',
          boxShadow: '0 0 10px #ea580c, 0 0 5px #fbbf24',
          transition: progress === 100 ? 'width 150ms ease-out, opacity 200ms ease-out' : 'width 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  )
}
