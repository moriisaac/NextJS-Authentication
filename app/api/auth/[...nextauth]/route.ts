import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// NextAuth API route handler
// This creates endpoints like /api/auth/signin, /api/auth/signout, etc.
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }


