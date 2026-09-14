import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('payload-token')?.value
  if (token && !request.headers.get('authorization')) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('authorization', `Bearer ${token}`)
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  return NextResponse.next()
}

export default proxy

export const config = {
  matcher: ['/api/:path*'],
}
