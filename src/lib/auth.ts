import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || 'trendmark-secret-key-2026-secure-jwt-auth'
)

export interface UserSession {
  id: string
  fullName: string
  phone: string
  role: string
}

export async function signToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY)
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as unknown as UserSession
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = cookies()
  const token = cookieStore.get('trendmark_token')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function getFullCurrentUser() {
  const session = await getCurrentUser()
  if (!session) return null
  return prisma.user.findUnique({
    where: { id: session.id },
    include: {
      userPackages: {
        where: { status: 'ACTIVE' },
        include: { package: true },
      },
    },
  })
}
