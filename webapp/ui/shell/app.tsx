// webapp/ui/shell/app.tsx
// Shell principal — orchestre les vues et branche les hooks frontend
"use client"

import { useState } from "react"

import { TopBar } from "./top_bar"
import { TabBar } from "./tab_bar"
import { HomeView } from "@/ui/domains/home/home_view"
import { SettingsView } from "@/ui/domains/home/settings_view"
import { ScanView } from "@/ui/domains/transactions/scan_view"
import { useHome } from "@/frontend/domains/home/useHome"
import { usePyodide } from "@/frontend/hooks/usePyodide"
import type { TabId } from "@/ui/types"

export function GestioApp() {
    const [activeTab, setActiveTab] = useState<TabId>("home")

    // Hooks frontend
    const { transactions, currentMonth, balance, onMonthChange } = useHome()
    const { status: pyodideStatus } = usePyodide()

    return (
        <div className="relative min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
            <TopBar balance={balance} />

            <main className="relative">
                {activeTab === "home" && (
                    <HomeView
                        transactions={transactions}
                        currentMonth={currentMonth}
                        onMonthChange={onMonthChange}
                    />
                )}
                {activeTab === "scan" && <ScanView />}
                {activeTab === "settings" && (
                    <SettingsView pyodideStatus={pyodideStatus} />
                )}
            </main>

            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
    )
}
