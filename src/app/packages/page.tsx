import { prisma } from '@/lib/prisma'
import { getFullCurrentUser } from '@/lib/auth'
import Link from 'next/link'
import { Award, Zap, CheckCircle2, ArrowRight } from 'lucide-react'

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({
    where: { active: true },
  })

  const currentUser = await getFullCurrentUser()
  const activePackageId = currentUser?.userPackages?.[0]?.packageId

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-10">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Membership Plans
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Choose Your Reward Package</h1>
        <p className="text-slate-600 text-sm">
          Select a package to start receiving today's featured WhatsApp advertising campaign. The higher your package, the more you earn per view.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const isCurrentActive = activePackageId === pkg.id

          return (
            <div
              key={pkg.id}
              className={`bg-white border rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition relative ${
                isCurrentActive ? 'border-2 border-emerald-500 bg-emerald-50/10' : 'border-slate-200'
              }`}
            >
              {isCurrentActive && (
                <span className="absolute -top-3 right-6 bg-emerald-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow">
                  Current Active
                </span>
              )}

              <div className="space-y-4">
                <h2 className="text-2xl font-black text-slate-900">{pkg.name}</h2>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">KSh {pkg.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/ activation</span>
                </div>

                <div className="bg-sky-50 border border-sky-100 p-3 rounded-2xl text-xs text-sky-800 font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Rate: KSh {pkg.ratePerView.toFixed(2)} / approved view</span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Daily electronics product campaign access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Automated screenshot view detection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Verified M-Pesa payroll payouts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 border-t border-slate-100 mt-6">
                {isCurrentActive ? (
                  <button
                    disabled
                    className="w-full py-3 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl cursor-default text-center"
                  >
                    Active Package
                  </button>
                ) : (
                  <Link
                    href={`/checkout/${pkg.id}`}
                    className="block w-full py-3 text-center bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl transition shadow"
                  >
                    Select & Pay KSh {pkg.price}
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
