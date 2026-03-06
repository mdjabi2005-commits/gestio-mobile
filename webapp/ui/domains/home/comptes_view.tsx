// webapp/ui/domains/home/comptes_view.tsx
// NOTE: Placeholder — la page Comptes sera recodée dans une prochaine session.
"use client"

import { Landmark, PiggyBank, TrendingUp, TrendingDown, LineChart, Briefcase, Bitcoin } from "lucide-react"
import { Card, SectionTitle } from "@/ui/components/gestio_card"
import { fmt } from "@/ui/types"

const accounts = [
    { name: "Compte Courant", bank: "BNP Paribas", balance: 3842.5, trend: +2.4, icon: Landmark, healthy: true },
    { name: "Livret A", bank: "Boursorama", balance: 18750.0, trend: +0.8, icon: PiggyBank, healthy: true },
    { name: "LDD", bank: "Boursorama", balance: 6200.0, trend: +1.2, icon: PiggyBank, healthy: true },
]

const investments = [
    { name: "PEA", type: "Actions", value: 24350.0, invested: 20000.0, gain: +21.75, icon: LineChart },
    { name: "CTO", type: "ETF Monde", value: 12890.0, invested: 11000.0, gain: +17.18, icon: Briefcase },
    { name: "Crypto", type: "BTC / ETH", value: 5620.0, invested: 4000.0, gain: +40.5, icon: Bitcoin },
]

export function ComptesView() {
    const totalLiquidites = accounts.reduce((sum, a) => sum + a.balance, 0)
    const totalInvestValue = investments.reduce((sum, i) => sum + i.value, 0)
    const totalInvestInvested = investments.reduce((sum, i) => sum + i.invested, 0)
    const totalGainPct = (((totalInvestValue - totalInvestInvested) / totalInvestInvested) * 100).toFixed(1)
    const totalGainAbs = totalInvestValue - totalInvestInvested

    return (
        <div className="flex flex-col gap-5 px-4 pt-24 pb-28">
            <div>
                <SectionTitle label="Liquidités" />
                <Card>
                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-white tabular-nums">{fmt(totalLiquidites)}</p>
                            <p className="text-xs text-[#10b981] mt-0.5 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> Total disponible</p>
                        </div>
                        <span className="text-xs text-slate-400">{accounts.length} comptes</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {accounts.map((acc) => {
                            const Icon = acc.icon
                            const TrendIcon = acc.trend >= 0 ? TrendingUp : TrendingDown
                            const trendColor = acc.healthy ? "text-[#10b981]" : "text-[#ef4444]"
                            return (
                                <div key={acc.name} className="flex items-center gap-3 px-4 py-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-slate-400" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white">{acc.name}</p>
                                        <p className="text-xs text-slate-400">{acc.bank}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-white">{fmt(acc.balance)}</p>
                                        <p className={`text-xs flex items-center justify-end gap-0.5 ${trendColor}`}><TrendIcon className="h-3 w-3" />{acc.trend > 0 ? "+" : ""}{acc.trend}%</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>

            <div>
                <SectionTitle label="Investissements" />
                <Card>
                    <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                        <div>
                            <p className="text-2xl font-bold text-white tabular-nums">{fmt(totalInvestValue, 0)}</p>
                            <p className="text-xs text-[#10b981] mt-0.5">+{fmt(totalGainAbs, 0)} de plus-value</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#10b981]/10 px-2.5 py-0.5 text-xs font-medium text-[#10b981]"><TrendingUp className="h-3 w-3" />+{totalGainPct}%</span>
                    </div>
                    <div className="divide-y divide-white/5">
                        {investments.map((inv) => {
                            const Icon = inv.icon
                            return (
                                <div key={inv.name} className="flex items-center gap-3 px-4 py-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#0f172a] flex items-center justify-center shrink-0"><Icon className="h-4 w-4 text-slate-400" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white">{inv.name}</p>
                                        <p className="text-xs text-slate-400">{inv.type}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-white">{fmt(inv.value, 0)}</p>
                                        <p className="text-xs text-[#10b981]">+{inv.gain}%</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    )
}
