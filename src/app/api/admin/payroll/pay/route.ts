import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { payoutId, userId, amount, mpesaRefCode, action } = await req.json()

    if (action === 'PAID') {
      // Mark Payout PAID
      await prisma.payout.update({
        where: { id: payoutId },
        data: {
          status: 'PAID',
          mpesaRefCode,
          processedAt: new Date(),
        },
      })

      // Fetch user's current wallet balance
      const userTxs = await prisma.walletTransaction.findMany({
        where: { userId },
      })
      const prevBalance = userTxs.reduce((sum, tx) => sum + tx.amount, 0)
      const newBalance = prevBalance - amount

      // Add negative PAYOUT transaction to user wallet ledger
      await prisma.walletTransaction.create({
        data: {
          userId,
          type: 'PAYOUT',
          amount: -amount,
          balance: newBalance,
          description: `M-Pesa Payout Processed (Ref: ${mpesaRefCode})`,
        },
      })
    } else {
      await prisma.payout.update({
        where: { id: payoutId },
        data: {
          status: 'REJECTED',
          processedAt: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Payroll payment error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
