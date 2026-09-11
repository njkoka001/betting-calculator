import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getFullCurrentUser } from '@/lib/auth'
import { 
  ShoppingBag, 
  Award, 
  Share2, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Lock,
  ShieldCheck,
  Globe2,
  Users2,
  Building2,
  BadgeCheck,
  TrendingUp,
  Star,
  Target,
  Rocket
} from 'lucide-react'

export default async function HomePage() {
  const currentUser = await getFullCurrentUser()
  const activePackage = currentUser?.userPackages?.[0]?.package

  const packages = await prisma.package.findMany({
    where: { active: true },
  })

  // Products are ONLY visible if user has an active package
  const products = activePackage ? await prisma.product.findMany({ where: { active: true }, take: 6 }) : []

  return (
    <div className="space-y-20 pb-20 bg-slate-950 text-white min-h-screen">
      {/* GLASSMORPHISM HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-sky-500/20 via-indigo-500/10 to-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sky-300 text-xs font-semibold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Trusted Global Electronics & Ad Rewards</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Shop Premium Electronics. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-300">
              Earn Verified Cash Daily.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            Backed by years of excellence in electronics distribution and serving thousands of customers globally. Select a package, share daily product campaigns to WhatsApp, and earn verified M-Pesa payouts!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/packages"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Explore Packages & Start <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* COMPANY TRUST & EXPERIENCE STATS BAR */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl space-y-1 shadow-xl">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 font-black text-2xl sm:text-3xl">
                <Building2 className="w-6 h-6 text-sky-400" /> 5+ Years
              </div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Industry Experience</p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl space-y-1 shadow-xl">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-black text-2xl sm:text-3xl">
                <Globe2 className="w-6 h-6 text-emerald-400" /> 50,000+
              </div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Global Customers</p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl space-y-1 shadow-xl">
              <div className="flex items-center justify-center gap-1.5 text-sky-400 font-black text-2xl sm:text-3xl">
                <BadgeCheck className="w-6 h-6 text-sky-400" /> 100%
              </div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Verified Payouts</p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-5 rounded-2xl space-y-1 shadow-xl">
              <div className="flex items-center justify-center gap-1.5 text-indigo-400 font-black text-2xl sm:text-3xl">
                <Star className="w-6 h-6 text-amber-400 fill-amber-400" /> 4.9 / 5.0
              </div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Satisfaction Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE / ABOUT US SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 px-3 py-1 rounded-full text-sky-400 text-xs font-bold uppercase">
                <Target className="w-3.5 h-3.5" /> Who We Are
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Boosting Electronics Sales & Empowering Our Advertisers
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                <strong>Trendmark</strong> is an innovative electronics retail and community-driven mobile advertising ecosystem. Our core mission is twofold: 
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Maximize Electronics Sales:</strong> By supplying genuine, high-demand gadgets direct to consumers at competitive prices.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>Promote & Reward Our Advertisers:</strong> By turning every member into a rewarded promoter who earns cash for sharing our daily product campaigns to WhatsApp Status.</span>
                </li>
              </ul>
            </div>

            <div className="w-full md:w-80 bg-slate-900/80 border border-white/10 p-6 rounded-2xl space-y-4 shadow-xl">
              <h3 className="font-bold text-white text-base border-b border-white/10 pb-2">Why Partner With Us</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct brand electronics sourcing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Organic WhatsApp Status reach</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Verified M-Pesa reward payouts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Transparent OCR view auditing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION PACKAGES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 space-y-10 shadow-2xl">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl font-black text-white">Reward Subscription Packages</h2>
            <p className="text-slate-400 text-sm">
              Select your package tier below to start receiving today's daily advertising campaign.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-slate-900/60 border border-white/10 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-between hover:border-sky-500/50 transition-all hover:-translate-y-1 shadow-xl relative group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition">{pkg.name}</h3>
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">KSh {pkg.price}</span>
                    <span className="text-xs text-slate-400">/ activation</span>
                  </div>

                  <div className="bg-white/5 border border-white/10 backdrop-blur-md p-3.5 rounded-xl text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                    <span>Rate: KSh {pkg.ratePerView.toFixed(2)} / approved view</span>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={`/checkout/${pkg.id}`}
                    className="block w-full text-center py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs transition shadow-lg"
                  >
                    Select {pkg.name.split(' ')[0]} Package →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ELECTRONICS PRODUCT CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Electronics Product Catalog</h2>
          <p className="text-slate-400 text-xs mt-1">Premium products sourced globally by Trendmark Electronics</p>
        </div>

        {activePackage ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div key={prod.id} className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl overflow-hidden shadow-xl hover:border-emerald-500/50 transition">
                <div className="h-48 bg-slate-900 overflow-hidden relative">
                  <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-white text-base">{prod.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{prod.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-lg font-black text-white">KSh {prod.price.toLocaleString()}</span>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">Active Access</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-10 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow">
              <Lock className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">Products Locked</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Daily electronics products and shareable advertising campaigns are accessible after package activation.
              </p>
            </div>
            <Link
              href="/packages"
              className="inline-block px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl transition shadow"
            >
              Select Package to Unlock Products →
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
