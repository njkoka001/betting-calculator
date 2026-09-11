import { prisma } from '@/lib/prisma'
import CampaignCreationForm from '@/components/CampaignCreationForm'
import { Share2, Calendar, ShoppingBag } from 'lucide-react'

export default async function AdminCampaignsPage() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: { name: 'asc' },
  })

  const campaigns = await prisma.campaign.findMany({
    include: { product: true, _count: { select: { submissions: true } } },
    orderBy: { campaignDate: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Daily Product Campaigns</h1>
        <p className="text-slate-400 text-xs mt-1">Schedule unique daily WhatsApp promotional campaigns without overwriting historical records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create New Daily Campaign */}
        <div className="lg:col-span-5">
          <CampaignCreationForm products={products} />
        </div>

        {/* Right Column: Historical Campaigns List */}
        <div className="lg:col-span-7 bg-slate-800/80 border border-slate-700/80 rounded-3xl p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" /> Campaign History
          </h2>

          <div className="space-y-3">
            {campaigns.map((c) => (
              <div key={c.id} className="bg-slate-900 border border-slate-700 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img src={c.product.image} alt="" className="w-12 h-12 object-cover rounded-xl shrink-0" />
                  <div>
                    <h3 className="font-bold text-white text-xs">{c.product.name}</h3>
                    <p className="text-[10px] text-slate-400">Date: {c.campaignDate}</p>
                    <span className="text-[10px] text-emerald-400 font-semibold">{c._count.submissions} Screenshot Submissions</span>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                  c.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
