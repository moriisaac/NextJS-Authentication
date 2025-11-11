import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

// Middleware runs on every request before the page renders
// This protects routes and enforces role-based access

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin-only routes
    if (path.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        // Redirect non-admins to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    // Pages that require authentication
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // Public routes (no auth required)
        if (path.startsWith('/login') || path.startsWith('/register') || path === '/') {
          return true
        }

        // Protected routes require a valid token
        return !!token
      }
    }
  }
)

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*'
  ]
}


