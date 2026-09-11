import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { packageId, mpesaMessage } = await req.json()

    if (!packageId || !mpesaMessage) {
      return NextResponse.json({ error: 'Package ID and M-Pesa SMS message are required' }, { status: 400 })
    }

    const pkg = await prisma.package.findUnique({
      where: { id: packageId },
    })

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 })
    }

    // Extract transaction code from SMS message (e.g. QK87123456 or first 10-char alphanumeric string)
    const codeMatch = mpesaMessage.match(/\b([A-Z0-9]{10})\b/i)
    const transactionReference = codeMatch ? codeMatch[1].toUpperCase() : mpesaMessage.trim().slice(0, 30)

    // Check if user already submitted this reference code
    const existingRef = await prisma.paymentTransaction.findFirst({
      where: { transactionReference },
    })

    if (existingRef) {
      return NextResponse.json(
        { error: 'This M-Pesa transaction proof has already been submitted.' },
        { status: 400 }
      )
    }

    // Create payment transaction record
    const payment = await prisma.paymentTransaction.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        amount: pkg.price,
        transactionReference,
        status: 'PENDING',
      },
    })

    // Upsert or create PENDING UserPackage
    await prisma.userPackage.create({
      data: {
        userId: user.id,
        packageId: pkg.id,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, paymentId: payment.id })
  } catch (error: any) {
    console.error('Purchase error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
