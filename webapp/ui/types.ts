// shared/ui/types.ts
// Types et utilitaires partagés entre les domaines

import React from "react"

export type TabId = "home" | "comptes" | "scan" | "budgets" | "settings"

export interface Transaction {
    id: string
    name: string
    category: string
    icon: React.ElementType
    amount: number
    date: string
    type: "income" | "expense"
}

export function fmt(amount: number, decimals = 2) {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(amount)
}
