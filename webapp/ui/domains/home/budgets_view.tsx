// webapp/ui/domains/home/budgets_view.tsx
"use client"

import React from "react"
import {
    Home, ShoppingCart, Utensils, Car, Gamepad2,
    Zap, Smartphone, Wifi, Shield, CreditCard, Plane,
    GraduationCap, AlertTriangle,
} from "lucide-react"
import { Card, SectionTitle } from "@/ui/components/gestio_card"
import { fmt } from "@/ui/types"

interface BudgetCategory { name: string; icon: React.ElementType; spent: number; budget: number; color: string }
interface UpcomingBill { name: string; amount: number; date: string; daysLeft: number; icon: React.ElementType; urgent: boolean }
interface Goal { name: string; target: number; saved: number; icon: React.ElementType; deadline: string; color: string }

const budgetCategories: BudgetCategory[] = [
    { name: "Loyer & Charges", icon: Home, spent: 850, budget: 850, color: "bg-blue-500" },
    { name: "Courses", icon: ShoppingCart, spent: 320, budget: 450, color: "bg-emerald-500" },
    { name: "Restaurants", icon: Utensils, spent: 145, budget: 200, color: "bg-amber-500" },
    { name: "Transports", icon: Car, spent: 75, budget: 120, color: "bg-blue-500" },
    { name: "Loisirs", icon: Gamepad2, spent: 180, budget: 150, color: "bg-red-500" },
]

const upcomingBills: UpcomingBill[] = [
    { name: "Électricité EDF", amount: 89.0, date: "08 Fév", daysLeft: 1, icon: Zap, urgent: true },
    { name: "Forfait Mobile", amount: 19.99, date: "09 Fév", daysLeft: 2, icon: Smartphone, urgent: false },
    { name: "Internet Free", amount: 29.99, date: "10 Fév", daysLeft: 3, icon: Wifi, urgent: false },
    { name: "Assurance Auto", amount: 67.5, date: "12 Fév", daysLeft: 5, icon: Shield, urgent: false },
    { name: "Carte de Crédit", amount: 450.0, date: "14 Fév", daysLeft: 7, icon: CreditCard, urgent: false },
]

const goals: Goal[] = [
    { name: "Apport Maison", target: 50000, saved: 28750, icon: Home, deadline: "Déc 2027", color: "#3b82f6" },
    { name: "Voyage Japon", target: 5000, saved: 3200, icon: Plane, deadline: "Avr 2026", color: "#10b981" },
    { name: "Formation Dev", target: 3000, saved: 2800, icon: GraduationCap, deadline: "Sep 2026", color: "#f59e0b" },
    { name: "Nouvelle Voiture", target: 25000, saved: 8500, icon: Car, deadline: "Jan 2028", color: "#a855f7" },
]

export function BudgetsView() {
    const totalSpent = budgetCategories.reduce((sum, c) => sum + c.spent, 0)
    const totalBudget = budgetCategories.reduce((sum, c) => sum + c.budget, 0)
    const totalUpcoming = upcomingBills.reduce((sum, b) => sum + b.amount, 0)

    return (
        <div className="flex flex-col gap-5 px-4 pt-24 pb-28">
            <div>
                <SectionTitle label="Budget mensuel" />
                <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-2xl font-bold text-white tabular-nums">{fmt(totalSpent, 0)}</p>
                        <span className="text-xs text-slate-400">/ {fmt(totalBudget, 0)}</span>
                    </div>
                    <div className="h-2 w-full bg-[#0f172a] rounded-full overflow-hidden mb-1">
                        <div className="h-full rounded-full bg-[#3b82f6] transition-all" style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mb-4">{Math.round((totalSpent / totalBudget) * 100)}% du budget mensuel consommé</p>
                    <div className="flex flex-col gap-3">
                        {budgetCategories.map((cat) => {
                            const Icon = cat.icon
                            const pct = Math.min((cat.spent / cat.budget) * 100, 100)
                            const isOver = cat.spent > cat.budget
                            return (
                                <div key={cat.name}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="text-sm text-white font-medium">{cat.name}</span>
                                        </div>
                                        <span className={`text-xs font-medium ${isOver ? "text-[#ef4444]" : "text-slate-400"}`}>{fmt(cat.spent, 0)} / {fmt(cat.budget, 0)}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#0f172a] rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all ${isOver ? "bg-[#ef4444]" : cat.color}`} style={{ width: `${pct}%` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>

            <div>
                <SectionTitle label="Prochaines échéances" />
                <div className="flex items-center justify-between mb-2 px-1">
                    <p className="text-lg font-bold text-white tabular-nums">{fmt(totalUpcoming)}</p>
                    <span className="text-xs text-slate-400">7 prochains jours</span>
                </div>
                <Card>
                    <div className="divide-y divide-white/5">
                        {upcomingBills.map((bill) => {
                            const Icon = bill.icon
                            return (
                                <div key={bill.name} className="flex items-center gap-3 px-4 py-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bill.urgent ? "bg-[#ef4444]/10" : "bg-[#0f172a]"}`}>
                                        <Icon className={`h-4 w-4 ${bill.urgent ? "text-[#ef4444]" : "text-slate-400"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <p className="text-sm font-semibold text-white truncate">{bill.name}</p>
                                            {bill.urgent && <AlertTriangle className="h-3 w-3 text-[#ef4444] shrink-0" />}
                                        </div>
                                        <p className="text-xs text-slate-400">{bill.date} · J-{bill.daysLeft}</p>
                                    </div>
                                    <p className="text-sm font-bold text-white tabular-nums shrink-0">{fmt(bill.amount)}</p>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            </div>

            <div>
                <SectionTitle label="Objectifs de vie" />
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
                    {goals.map((goal) => {
                        const Icon = goal.icon
                        const pct = Math.round((goal.saved / goal.target) * 100)
                        const remaining = goal.target - goal.saved
                        return (
                            <div key={goal.name} className="flex-shrink-0 w-48 bg-[#1e293b] border border-white/5 rounded-2xl p-4 snap-start">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: goal.color + "20" }}>
                                        <Icon className="h-5 w-5" style={{ color: goal.color }} />
                                    </div>
                                    <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ backgroundColor: goal.color + "20", color: goal.color }}>{pct}%</span>
                                </div>
                                <p className="text-sm font-semibold text-white mb-0.5">{goal.name}</p>
                                <p className="text-[10px] text-slate-400 mb-3">Objectif : {goal.deadline}</p>
                                <div className="h-1.5 w-full bg-[#0f172a] rounded-full overflow-hidden mb-2">
                                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.color }} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-medium text-white">{fmt(goal.saved, 0)}</p>
                                    <p className="text-[10px] text-slate-400">{fmt(goal.target, 0)}</p>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">Reste {fmt(remaining, 0)}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
