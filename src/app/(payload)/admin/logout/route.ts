import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const cookieStore = await cookies()
  cookieStore.delete('payload-token')

  const url = new URL('/admin/login', request.url)
  const response = NextResponse.redirect(url, { status: 303 })

  // Explicitly set cookie expired header across all paths
  response.cookies.delete('payload-token')
  response.cookies.set('payload-token', '', {
    path: '/',
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
  })

  return response
}

export async function POST(request: Request) {
  return GET(request)
}
