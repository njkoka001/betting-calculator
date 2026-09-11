import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { campaignId, imageUrl, detectedViews } = await req.json()

    if (!campaignId || !imageUrl) {
      return NextResponse.json({ error: 'Campaign ID and image are required' }, { status: 400 })
    }

    // Check if user already submitted proof for this campaign
    const existingSubmission = await prisma.submission.findFirst({
      where: {
        userId: user.id,
        campaignId,
      },
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted a screenshot proof for today\'s campaign.' },
        { status: 400 }
      )
    }

    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        campaignId,
        imageUrl,
        detectedViews: Number(detectedViews) || 0,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ success: true, submissionId: submission.id })
  } catch (error: any) {
    console.error('Submission API error:', error)
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 })
  }
}
