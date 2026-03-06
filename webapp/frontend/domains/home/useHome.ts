// webapp/frontend/domains/home/useHome.ts
// Hook frontend pour le dashboard Accueil

import { useState, useCallback } from "react"
import { Briefcase, Home, ShoppingCart, Car, Utensils, Gift, Zap, Heart, Plane } from "lucide-react"
import type { Transaction } from "@/ui/types"

// Mock data — sera remplacé par des appels Pyodide quand le backend sera branché
const MOCK_TRANSACTIONS: Transaction[] = [
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

export function useHome() {
    const [currentMonth, setCurrentMonth] = useState(0)
    const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS)

    const balance = transactions.reduce((sum, t) => sum + t.amount, 0)
    const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = Math.abs(transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))

    const handleMonthChange = useCallback((month: number) => {
        setCurrentMonth(month)
        // TODO: Pyodide — recharger les transactions du mois sélectionné
    }, [])

    return {
        transactions,
        currentMonth,
        balance,
        totalIncome,
        totalExpense,
        onMonthChange: handleMonthChange,
    }
}
