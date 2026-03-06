// webapp/frontend/domains/home/useSunburst.ts
// Hook pour préparer les données hiérarchiques du Sunburst depuis les transactions

import { useMemo } from "react"
import type { TransactionJS } from "@/frontend/services/transaction_service"
import type { SunburstHierarchy } from "@/ui/components/sunburst"

// Couleurs par type de transaction
const TYPE_COLORS: Record<string, string> = {
    "Revenu": "#10b981",
    "Dépense": "#ef4444",
    "Transfert+": "#f59e0b",
    "Transfert-": "#f59e0b",
}

// Couleurs par catégorie (palette)
const CAT_PALETTE = [
    "#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#84cc16",
    "#06b6d4", "#f43f5e", "#a855f7", "#14b8a6", "#fb923c",
]

/**
 * Construit la hiérarchie Sunburst à partir des transactions.
 *
 * Structure :
 *   TR (racine)
 *   ├── Revenu
 *   │   └── Catégorie (ex: Salaire)
 *   └── Dépense
 *       ├── Alimentation
 *       └── Transport
 */
export function useSunburst(transactions: TransactionJS[]): SunburstHierarchy {
    return useMemo(() => {
        if (!transactions.length) return {}

        const hierarchy: SunburstHierarchy = {}
        const types = new Map<string, number>()
        const cats = new Map<string, { amount: number; type: string }>()

        for (const tx of transactions) {
            const t = tx.type
            const c = `${t}__${tx.categorie}`
            types.set(t, (types.get(t) ?? 0) + tx.montant)
            const existing = cats.get(c)
            cats.set(c, {
                amount: (existing?.amount ?? 0) + tx.montant,
                type: t,
            })
        }

        // Nœud racine
        const totalAll = Array.from(types.values()).reduce((s, v) => s + v, 0)
        const typeKeys = Array.from(types.keys())

        hierarchy["TR"] = {
            code: "TR",
            label: "Total",
            amount: totalAll,
            color: "#1e293b",
            children: typeKeys,
        }

        // Nœuds de type (Dépense / Revenu)
        let catIdx = 0
        for (const [type, amount] of types) {
            const catCodes = Array.from(cats.entries())
                .filter(([k]) => k.startsWith(`${type}__`))
                .map(([k]) => k)

            hierarchy[type] = {
                code: type,
                label: type,
                amount,
                color: TYPE_COLORS[type] ?? "#64748b",
                children: catCodes,
            }

            // Nœuds de catégorie
            for (const catKey of catCodes) {
                const catName = catKey.replace(`${type}__`, "")
                const catData = cats.get(catKey)!
                hierarchy[catKey] = {
                    code: catKey,
                    label: catName,
                    amount: catData.amount,
                    color: CAT_PALETTE[catIdx % CAT_PALETTE.length],
                    children: [],
                }
                catIdx++
            }
        }

        return hierarchy
    }, [transactions])
}
