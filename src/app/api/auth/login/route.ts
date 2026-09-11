import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json()

    if (!phone || !password) {
      return NextResponse.json({ error: 'Phone and password are required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { phone },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 })
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash)
    if (!passwordValid) {
      return NextResponse.json({ error: 'Invalid phone or password' }, { status: 401 })
    }

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

    return NextResponse.json({ success: true, user: { id: user.id, fullName: user.fullName, role: user.role } })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
