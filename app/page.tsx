import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

// Landing page - shows different content based on auth status
export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ALOVATE Auth System
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Secure authentication and authorization system built with Next.js
          </p>

          {session ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-700 mb-4">
                You are signed in as <strong>{session.user.email}</strong>
              </p>
              <p className="text-sm text-gray-700 mb-6">
                Role: <strong className="text-gray-900">{session.user.role}</strong>
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
                {session.user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="secondary">Admin Panel</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-700 mb-6">
                Get started by signing in or creating an account
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="secondary">Sign Up</Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure</h3>
            <p className="text-gray-700 text-sm">
              Passwords are hashed with bcrypt. Sessions are managed securely with NextAuth.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based</h3>
            <p className="text-gray-700 text-sm">
              Access control based on user roles (USER/ADMIN). Protected routes and middleware.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Type-Safe</h3>
            <p className="text-gray-700 text-sm">
              Built with TypeScript and Prisma for type safety and better developer experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
