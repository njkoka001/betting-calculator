import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { walletLedger: true },
    })

    if (!fullUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const currentBalance = fullUser.walletLedger.reduce((sum, tx) => sum + tx.amount, 0)

    if (currentBalance < 100) {
      return NextResponse.json(
        { error: 'Minimum payout request balance is KSh 100.' },
        { status: 400 }
      )
    }

    // Check if there is already a pending payout
    const existingPending = await prisma.payout.findFirst({
      where: { userId: user.id, status: 'PENDING' },
    })

    if (existingPending) {
      return NextResponse.json(
        { error: 'You already have a pending payout request in payroll.' },
        { status: 400 }
      )
    }

    const payout = await prisma.payout.create({
      data: {
        userId: user.id,
        amount: currentBalance,
        mpesaNumber: fullUser.mpesaNumber,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, payoutId: payout.id })
  } catch (error: any) {
    console.error('Payout request error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
