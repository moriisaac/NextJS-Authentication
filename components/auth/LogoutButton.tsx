'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

// Client component for logout button
export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <Button variant="secondary" onClick={handleLogout}>
      Sign out
    </Button>
  )
}


