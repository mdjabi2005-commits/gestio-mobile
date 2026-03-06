// Frontend API - Transactions
// Appels vers le backend Python via Pyodide

import { pyodideBridge } from "../bridge/pyodide_bridge"

export interface Transaction {
    id: number
    type: "Dépense" | "Revenu" 
    categorie: string
    sous_categorie: string | null
    description: string | null
    montant: number
    date: string
    source: string
    recurrence: string | null
    date_fin: string | null
    compte_iban: string | null
    external_id: string | null
}

export interface TransactionFilters {
    start_date?: string
    end_date?: string
    category?: string
}

export interface MonthlySummary {
    total_revenus: number
    total_depenses: number
    solde: number
}

export async function getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const result = await pyodideBridge.callApi<string>("get_transactions", [filters])
    if (typeof result === "string") {
        return JSON.parse(result) as Transaction[]
    }
    return []
}

export async function addTransaction(data: Partial<Transaction>): Promise<number | null> {
    const result = await pyodideBridge.callApi<string>("add_transaction", [data])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.id ?? null
    }
    return null
}

export async function updateTransaction(txId: number, data: Partial<Transaction>): Promise<boolean> {
    const result = await pyodideBridge.callApi<string>("update_transaction", [txId, data])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.success ?? false
    }
    return false
}

export async function deleteTransaction(txId: number): Promise<boolean> {
    const result = await pyodideBridge.callApi<string>("delete_transaction", [txId])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.success ?? false
    }
    return false
}

export async function getMonthlySummary(year: number, month: number): Promise<MonthlySummary> {
    const result = await pyodideBridge.callApi<string>("get_monthly_summary", [year, month])
    if (typeof result === "string") {
        return JSON.parse(result)
    }
    return { total_revenus: 0, total_depenses: 0, solde: 0 }
}

export async function getCategories(): Promise<string[]> {
    const result = await pyodideBridge.callApi<string>("get_categories", [])
    if (typeof result === "string") {
        return JSON.parse(result)
    }
    return []
}
