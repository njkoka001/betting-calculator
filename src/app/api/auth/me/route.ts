import { NextResponse } from 'next/server'
import { getFullCurrentUser } from '@/lib/auth'

export async function GET() {
  const user = await getFullCurrentUser()
  if (!user) {
    return NextResponse.json({ user: null })
  }
  
  const activePackage = user.userPackages?.[0]?.package || null

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      whatsappNumber: user.whatsappNumber,
      email: user.email,
      mpesaNumber: user.mpesaNumber,
      role: user.role,
      profileComplete: user.profileComplete,
      activePackage,
    },
  })
}
