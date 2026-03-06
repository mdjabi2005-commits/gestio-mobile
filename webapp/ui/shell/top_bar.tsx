// shared/ui/shell/top_bar.tsx
"use client"

import React from "react"

export function TopBar({ balance }: { balance: number }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/95 backdrop-blur-md border-b border-white/5 safe-area-top">
            <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center">
                        <span className="text-sm font-bold text-white">G</span>
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-white tracking-tight leading-tight">Gestio</h1>
                        <p className="text-[10px] text-slate-400 leading-tight">Gestion financière</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider">Solde global</p>
                    <p className={`text-xl font-bold tabular-nums ${balance >= 0 ? "text-[#3b82f6]" : "text-[#ef4444]"}`}>
                        {balance >= 0 ? "+" : ""}{balance.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                    </p>
                </div>
            </div>
        </header>
    )
}
