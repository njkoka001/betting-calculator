import { prisma } from '@/lib/prisma'
import ReviewApprovalCard from '@/components/ReviewApprovalCard'
import { ImageIcon, Eye } from 'lucide-react'

export default async function AdminReviewsPage() {
  const submissions = await prisma.submission.findMany({
    where: { status: 'PENDING' },
    include: {
      user: {
        include: {
          userPackages: {
            where: { status: 'ACTIVE' },
            include: { package: true },
          },
        },
      },
      campaign: { include: { product: true } },
    },
    orderBy: { submittedAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white">Screenshot Reviews & OCR Audit</h1>
        <p className="text-slate-400 text-xs mt-1">
          Verify user screenshots, validate OCR view counts, and credit earnings to user wallets.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-10 text-center text-xs text-slate-400 space-y-2">
          <ImageIcon className="w-8 h-8 text-slate-500 mx-auto" />
          <p>No screenshot proofs pending review in queue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((sub) => {
            const activePackage = sub.user.userPackages?.[0]?.package
            const rate = activePackage?.ratePerView || 1.0

            return (
              <ReviewApprovalCard
                key={sub.id}
                submissionId={sub.id}
                imageUrl={sub.imageUrl}
                detectedViews={sub.detectedViews}
                userName={sub.user.fullName}
                userPhone={sub.user.phone}
                packageName={activePackage?.name || 'Standard'}
                rate={rate}
                campaignTitle={sub.campaign.product.name}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
