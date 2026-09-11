import { redirect } from 'next/navigation'
import { getFullCurrentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CopyButton } from '@/components/CopyButton'
import { 
  Sparkles, 
  Clock, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Download,
  Award
} from 'lucide-react'

export default async function CampaignPage() {
  const user = await getFullCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const activeUserPackage = user.userPackages?.[0]

  if (!activeUserPackage || activeUserPackage.status !== 'ACTIVE') {
    return (
      <div className="max-w-xl mx-auto py-16 px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto">
            <Award className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">Subscription Package Required</h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your account does not have an active reward package subscription. Activate a package to access today's promotional campaign.
            </p>
          </div>
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow"
          >
            Activate Package Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Fetch today's campaign (e.g. 2026-09-08 or latest ACTIVE campaign)
  const todayStr = '2026-09-08'
  let campaign = await prisma.campaign.findFirst({
    where: { campaignDate: todayStr, status: 'ACTIVE' },
    include: { product: true },
  })

  if (!campaign) {
    campaign = await prisma.campaign.findFirst({
      where: { status: 'ACTIVE' },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  if (!campaign) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4">
          <h1 className="text-xl font-black text-slate-900">No Active Campaign Today</h1>
          <p className="text-xs text-slate-500">Check back shortly. An admin will post today's featured electronics product.</p>
        </div>
      </div>
    )
  }

  // Check if user already submitted proof for this campaign
  const existingSubmission = await prisma.submission.findFirst({
    where: {
      userId: user.id,
      campaignId: campaign.id,
    },
  })

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-8">
      {/* Campaign Header */}
      <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              <Sparkles className="w-3 h-3" /> Today's Product Campaign
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">{campaign.product.name}</h1>
          </div>
          <div className="bg-slate-800/80 px-4 py-2 rounded-2xl border border-slate-700/80 text-xs font-medium text-slate-300 flex items-center gap-2 self-start sm:self-center">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Date: {campaign.campaignDate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300">
          <div>
            Your Active Package: <strong className="text-white">{activeUserPackage.package.name}</strong>
          </div>
          <div className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-lg">
            Rate: KSh {activeUserPackage.package.ratePerView.toFixed(2)} / view
          </div>
        </div>
      </div>

      {/* Main Campaign Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Image & Info */}
        <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm space-y-4 p-5">
          <div className="h-64 bg-slate-100 rounded-2xl overflow-hidden relative">
            <img
              src={campaign.product.image}
              alt={campaign.product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-lg">{campaign.product.name}</h3>
            <span className="inline-block bg-slate-100 text-slate-700 text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
              Retail Price: KSh {campaign.product.price.toLocaleString()}
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">{campaign.product.description}</p>
          </div>
        </div>

        {/* Right Column: Copyable Content & Submission Step */}
        <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <Share2 className="w-5 h-5 text-sky-600" /> Shareable Promotional Text
            </h3>
            <p className="text-xs text-slate-500">
              Click the button below to copy the promo text, then post it along with the product image to your WhatsApp Status.
            </p>
          </div>

          {/* Copyable Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative font-sans text-xs text-slate-800 leading-relaxed space-y-3">
            <p className="whitespace-pre-line">{campaign.promoText}</p>
            <div className="pt-2 border-t border-slate-200/60 flex justify-end">
              <CopyButton textToCopy={campaign.promoText} />
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4 text-xs text-sky-950 space-y-2">
            <h4 className="font-bold text-sky-900">Campaign Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Copy the ad text above & save the product image.</li>
              <li>Post to your WhatsApp Status and leave active.</li>
              <li>Take a screenshot showing total view count.</li>
              <li>Submit screenshot proof below for Admin review & payout.</li>
            </ol>
          </div>

          {/* Submission CTA Status */}
          <div className="pt-4 border-t border-slate-100">
            {existingSubmission ? (
              <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Proof Submitted
                  </span>
                  <p className="text-slate-500">
                    Status: <strong className="uppercase text-slate-700">{existingSubmission.status}</strong>
                  </p>
                </div>
                <Link
                  href="/wallet"
                  className="bg-white border text-slate-800 font-bold px-3 py-1.5 rounded-xl hover:bg-slate-50"
                >
                  View Wallet
                </Link>
              </div>
            ) : (
              <Link
                href={`/campaign/submit?campaignId=${campaign.id}`}
                className="block w-full py-3 text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-2xl text-sm transition shadow shadow-emerald-500/20"
              >
                Submit WhatsApp Screenshot Proof →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
