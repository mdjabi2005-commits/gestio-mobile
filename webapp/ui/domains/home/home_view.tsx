// webapp/ui/domains/home/home_view.tsx
"use client"

import { useState } from "react"
import { LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, SectionTitle } from "@/ui/components/gestio_card"
import type { Transaction } from "@/ui/types"

const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
]

function MonthSelector({ currentMonth, onMonthChange }: { currentMonth: number; onMonthChange: (m: number) => void }) {
    return (
        <div className="flex items-center justify-between bg-[#1e293b] rounded-2xl p-1 border border-white/5">
            <button
                type="button"
                onClick={() => onMonthChange(currentMonth === 0 ? 11 : currentMonth - 1)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 text-center">
                <span className="text-sm font-semibold text-white">{months[currentMonth]} 2024</span>
            </div>
            <button
                type="button"
                onClick={() => onMonthChange(currentMonth === 11 ? 0 : currentMonth + 1)}
                className="p-2 text-slate-400 hover:text-white transition-colors rounded-xl"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    )
}

interface HomeViewProps {
    transactions: Transaction[]
    currentMonth: number
    onMonthChange: (m: number) => void
}

export function HomeView({ transactions, currentMonth, onMonthChange }: HomeViewProps) {
    const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = Math.abs(transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))
    const recentTx = transactions.slice(0, 4)

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })

    return (
        <div className="flex flex-col gap-5 px-4 pt-24 pb-28">
            <MonthSelector currentMonth={currentMonth} onMonthChange={onMonthChange} />

            <div
                id="sunburst-container"
                className="aspect-square w-full bg-[#1e293b] rounded-3xl flex items-center justify-center border border-white/5"
            >
                <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-3">
                        <LayoutGrid className="h-8 w-8 text-[#3b82f6]" />
                    </div>
                    <p className="text-slate-400 text-sm">Graphique D3.js</p>
                    <p className="text-slate-500 text-xs mt-1">Sunburst Chart</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <Card className="p-4">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Revenus</p>
                    <p className="text-lg font-bold text-[#10b981] tabular-nums">
                        +{totalIncome.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </p>
                    <div className="mt-2 h-1 bg-[#10b981]/20 rounded-full overflow-hidden">
                        <div className="h-full bg-[#10b981] rounded-full w-full" />
                    </div>
                </Card>
                <Card className="p-4">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Dépenses</p>
                    <p className="text-lg font-bold text-[#ef4444] tabular-nums">
                        -{totalExpense.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </p>
                    <div className="mt-2 h-1 bg-[#ef4444]/20 rounded-full overflow-hidden">
                        <div className="h-full bg-[#ef4444] rounded-full" style={{ width: `${Math.min((totalExpense / totalIncome) * 100, 100)}%` }} />
                    </div>
                </Card>
            </div>

            <div>
                <SectionTitle label="Dernières transactions" />
                <Card>
                    <div className="divide-y divide-white/5">
                        {recentTx.map((tx) => {
                            const Icon = tx.icon
                            return (
                                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type === "income" ? "bg-[#10b981]/10" : "bg-[#ef4444]/10"}`}>
                                        <Icon className={`h-4 w-4 ${tx.type === "income" ? "text-[#10b981]" : "text-[#ef4444]"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-white truncate">{tx.name}</p>
                                        <p className="text-xs text-slate-400">{tx.category} · {formatDate(tx.date)}</p>
                                    </div>
                                    <p className={`text-sm font-bold tabular-nums shrink-0 ${tx.type === "income" ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                                        {tx.amount >= 0 ? "+" : ""}{tx.amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>
        </div>
    )
}
