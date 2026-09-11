import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { fullName, phone, whatsappNumber, email, mpesaNumber, password } = await req.json()

    if (!fullName || !phone || !whatsappNumber || !mpesaNumber || !password) {
      return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        fullName,
        phone,
        whatsappNumber,
        email: email || null,
        mpesaNumber,
        passwordHash,
        role: 'USER',
        profileComplete: true,
      },
    })

    const token = await signToken({
      id: user.id,
      fullName: user.fullName,
      phone: user.phone,
      role: user.role,
    })

    cookies().set('trendmark_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.json({ success: true, user: { id: user.id, fullName: user.fullName, phone: user.phone } })
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
