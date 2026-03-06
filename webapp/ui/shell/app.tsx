// webapp/ui/shell/app.tsx
// Shell principal — orchestre les vues et le state global
"use client"

import { useState } from "react"
import { Briefcase, Home, ShoppingCart, Car, Utensils, Gift, Zap, Heart, Plane } from "lucide-react"

import { TopBar } from "./top_bar"
import { TabBar } from "./tab_bar"
import { HomeView } from "@/ui/domains/home/home_view"
import { ComptesView } from "@/ui/domains/home/comptes_view"
import { BudgetsView } from "@/ui/domains/home/budgets_view"
import { SettingsView } from "@/ui/domains/home/settings_view"
import { ScanView } from "@/ui/domains/transactions/scan_view"
import type { TabId, Transaction } from "@/ui/types"

// ── Mock data (sera remplacé par des appels Pyodide) ─────────────────
const mockTransactions: Transaction[] = [
    { id: "1", name: "Salaire", category: "Revenus", icon: Briefcase, amount: 3200, date: "2024-01-28", type: "income" },
    { id: "2", name: "Loyer", category: "Logement", icon: Home, amount: -950, date: "2024-01-27", type: "expense" },
    { id: "3", name: "Carrefour", category: "Courses", icon: ShoppingCart, amount: -127.50, date: "2024-01-26", type: "expense" },
    { id: "4", name: "Essence", category: "Transport", icon: Car, amount: -65.30, date: "2024-01-25", type: "expense" },
    { id: "5", name: "Restaurant", category: "Alimentation", icon: Utensils, amount: -42.00, date: "2024-01-24", type: "expense" },
    { id: "6", name: "Prime projet", category: "Revenus", icon: Gift, amount: 500, date: "2024-01-23", type: "income" },
    { id: "7", name: "Electricite", category: "Factures", icon: Zap, amount: -89.00, date: "2024-01-22", type: "expense" },
    { id: "8", name: "Mutuelle", category: "Sante", icon: Heart, amount: -45.00, date: "2024-01-21", type: "expense" },
    { id: "9", name: "Billets avion", category: "Voyages", icon: Plane, amount: -320.00, date: "2024-01-20", type: "expense" },
    { id: "10", name: "Freelance", category: "Revenus", icon: Briefcase, amount: 750, date: "2024-01-19", type: "income" },
]

export function GestioApp() {
    const [activeTab, setActiveTab] = useState<TabId>("home")
    const [currentMonth, setCurrentMonth] = useState(0)

    const balance = mockTransactions.reduce((sum, t) => sum + t.amount, 0)

    return (
        <div className="relative min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
            <TopBar balance={balance} />

            <main className="relative">
                {activeTab === "home" && (
                    <HomeView
                        transactions={mockTransactions}
                        currentMonth={currentMonth}
                        onMonthChange={setCurrentMonth}
                    />
                )}
                {activeTab === "comptes" && <ComptesView />}
                {activeTab === "scan" && <ScanView />}
                {activeTab === "budgets" && <BudgetsView />}
                {activeTab === "settings" && <SettingsView />}
            </main>

            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    )
}
