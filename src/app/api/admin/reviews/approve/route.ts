import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { submissionId, approvedViews, action } = await req.json()

    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        user: {
          include: {
            userPackages: {
              where: { status: 'ACTIVE' },
              include: { package: true },
            },
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (action === 'APPROVE') {
      const activePackage = submission.user.userPackages?.[0]?.package
      const rate = activePackage?.ratePerView || 1.0
      const finalViews = Number(approvedViews) || 0
      const amount = finalViews * rate

      // Update submission status
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          approvedViews: finalViews,
          status: 'APPROVED',
          reviewedAt: new Date(),
        },
      })

      // Create Earning record
      await prisma.earning.create({
        data: {
          submissionId,
          approvedViews: finalViews,
          rate,
          amount,
        },
      })

      // Calculate current wallet balance
      const userTxs = await prisma.walletTransaction.findMany({
        where: { userId: submission.userId },
      })
      const prevBalance = userTxs.reduce((sum, tx) => sum + tx.amount, 0)
      const newBalance = prevBalance + amount

      // Add REWARD transaction to wallet ledger
      await prisma.walletTransaction.create({
        data: {
          userId: submission.userId,
          type: 'REWARD',
          amount,
          balance: newBalance,
          description: `Daily Campaign Reward (${finalViews} approved views @ KSh ${rate.toFixed(2)})`,
        },
      })
    } else {
      await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 'REJECTED',
          reviewedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Review approval error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
