// webapp/ui/shell/tab_bar.tsx
"use client"

import React from "react"
import { LayoutGrid, Camera, Settings } from "lucide-react"
import type { TabId } from "@/ui/types"

export function TabBar({ activeTab, onTabChange }: { activeTab: TabId; onTabChange: (tab: TabId) => void }) {
    const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
        { id: "home", label: "Accueil", icon: LayoutGrid },
        { id: "scan", label: "Scan", icon: Camera },
        { id: "settings", label: "Réglages", icon: Settings },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1e293b]/95 backdrop-blur-md border-t border-white/5 safe-area-bottom">
            <div className="flex items-center justify-around px-1 pt-2 pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-0 flex-1 ${isActive
                                ? "text-[#3b82f6]"
                                : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            <div className={`flex items-center justify-center w-6 h-6 ${isActive ? "scale-110" : ""} transition-transform`}>
                                <Icon className="h-5 w-5" />
                            </div>
                            <span className={`text-[9px] font-medium truncate w-full text-center ${isActive ? "text-[#3b82f6]" : ""}`}>
                                {tab.label}
                            </span>
                            {isActive && (
                                <div className="w-4 h-0.5 rounded-full bg-[#3b82f6] mt-0.5" />
                            )}
                        </button>
                    )
                })}
            </div>
        </nav>
    )
}
