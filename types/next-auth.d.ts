import 'next-auth'
import 'next-auth/jwt'

// Extend NextAuth types to include role in session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'USER' | 'ADMIN'
    }
  }

  interface User {
    id: string
    email: string
    role: 'USER' | 'ADMIN'
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'USER' | 'ADMIN'
  }
}


