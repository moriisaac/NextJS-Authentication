import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { signOut } from 'next-auth/react'
import LogoutButton from '@/components/auth/LogoutButton'

// Server component - runs on the server
// This page is protected by middleware, but we also check session here
export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // If not authenticated, redirect to login
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-900">ALOVATE Auth System</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {session.user.email}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                {session.user.role}
              </span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Dashboard
            </h2>
            <p className="text-gray-700 mb-4">
              Welcome to your dashboard! This page is accessible to all authenticated users.
            </p>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Session Info:</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-gray-800"><strong className="text-gray-900">Email:</strong> {session.user.email}</p>
                <p className="text-gray-800"><strong className="text-gray-900">Role:</strong> {session.user.role}</p>
                <p className="text-gray-800"><strong className="text-gray-900">User ID:</strong> {session.user.id}</p>
              </div>
            </div>
            {session.user.role === 'ADMIN' && (
              <div className="mt-6">
                <a
                  href="/admin"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Go to Admin Panel →
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

