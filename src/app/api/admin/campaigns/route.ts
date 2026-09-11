import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const admin = await getCurrentUser()
    if (!admin || admin.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { productId, campaignDate, promoText } = await req.json()

    if (!productId || !campaignDate || !promoText) {
      return NextResponse.json({ error: 'Product, Date and Promo Text are required' }, { status: 400 })
    }

    const campaign = await prisma.campaign.create({
      data: {
        productId,
        campaignDate: campaignDate.trim(),
        promoText: promoText.trim(),
        status: 'ACTIVE',
      },
    })

    return NextResponse.json({ success: true, campaignId: campaign.id })
  } catch (error: any) {
    console.error('Campaign creation error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
