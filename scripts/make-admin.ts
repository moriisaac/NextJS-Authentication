// Script to make a user an admin
// Usage: npx tsx scripts/make-admin.ts your-email@example.com

// This optional if you would prefer using npx prisma studio to make a user an admin

import { prisma } from '../lib/prisma'

const email = process.argv[2]

if (!email) {
  console.error('Please provide an email address')
  console.log('Usage: npx tsx scripts/make-admin.ts your-email@example.com')
  process.exit(1)
}

async function makeAdmin() {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    })
    console.log(`✅ Successfully updated ${user.email} to ADMIN role`)
  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin()

