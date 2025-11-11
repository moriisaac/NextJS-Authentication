import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// NextAuth configuration
// This file defines how authentication works in our app
export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials provider allows email/password login
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error('Invalid email or password')
        }

        // Verify password using bcrypt
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          throw new Error('Invalid email or password')
        }

        // Return user object (will be stored in session)
        return {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  // Session strategy: JWT stores session in a token (no database needed)
  session: {
    strategy: 'jwt'
  },
  // Callbacks modify the session and JWT token
  callbacks: {
    async jwt({ token, user }) {
      // When user first logs in, add their data to the token
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      // Add user data from token to session object
      // This makes it available in components via useSession()
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'USER' | 'ADMIN'
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}


