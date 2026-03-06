// shared/ui/components/gestio_card.tsx
// Composants UI Gestio custom (Card dark + SectionTitle)
import React from "react"

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`bg-[#1e293b] rounded-2xl border border-white/5 ${className}`}>
            {children}
        </div>
    )
}

export function SectionTitle({ label }: { label: string }) {
    return (
        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-3 px-1">
            {label}
        </p>
    )
}
