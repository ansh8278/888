'use client'

import { useState } from 'react'
import { withBase } from '../../lib/base-path'

export const LogoutButton = ({ signedInAs }: { signedInAs?: string | null }) => {
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (loggingOut) return
    setLoggingOut(true)

    try {
      // 1. Call Payload's logout API endpoint
      await fetch(withBase('/api/users/logout'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (_err) {
      // Continue with client-side cleanup regardless
    }

    // 2. Clear client cookies
    document.cookie = 'payload-token=; Max-Age=0; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    // 3. Clear storage
    try {
      localStorage.clear()
      sessionStorage.clear()
    } catch (_e) {}

    // 4. Force browser navigation to the server-side logout route which redirects to login
    window.location.href = withBase('/admin/logout')
  }

  return (
    <button
      type="button"
      className="dash__logout"
      onClick={handleLogout}
      disabled={loggingOut}
      style={{ cursor: loggingOut ? 'wait' : 'pointer', background: 'none', border: 'none' }}
    >
      {loggingOut ? 'Logging out...' : signedInAs ? `Log out (${signedInAs})` : 'Log out'}
    </button>
  )
}
