import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { paymentId, userId, packageId, action } = await req.json()

    if (action === 'VERIFY') {
      // Mark PaymentTransaction VERIFIED
      await prisma.paymentTransaction.update({
        where: { id: paymentId },
        data: {
          status: 'VERIFIED',
          verifiedAt: new Date(),
          verifiedBy: admin.id,
        },
      })

      // Deactivate any existing active packages
      await prisma.userPackage.updateMany({
        where: { userId, status: 'ACTIVE' },
        data: { status: 'EXPIRED' },
      })

      // Update or create ACTIVE UserPackage
      const pendingPkg = await prisma.userPackage.findFirst({
        where: { userId, packageId, status: 'PENDING' },
      })

      if (pendingPkg) {
        await prisma.userPackage.update({
          where: { id: pendingPkg.id },
          data: {
            status: 'ACTIVE',
            activatedAt: new Date(),
          },
        })
      } else {
        await prisma.userPackage.create({
          data: {
            userId,
            packageId,
            status: 'ACTIVE',
            activatedAt: new Date(),
          },
        })
      }
    } else {
      await prisma.paymentTransaction.update({
        where: { id: paymentId },
        data: { status: 'REJECTED' },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Payment approval error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
