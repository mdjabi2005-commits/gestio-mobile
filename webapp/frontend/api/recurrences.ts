// Frontend API - Recurrences
// Appels vers le backend Python via Pyodide

import { pyodideBridge } from "../bridge/pyodide_bridge"

export interface Recurrence {
    id: number
    type: string
    categorie: string
    sous_categorie: string | null
    montant: number
    date_debut: string
    date_fin: string | null
    frequence: string
    description: string | null
    statut: string
}

export async function getRecurrences(): Promise<Recurrence[]> {
    const result = await pyodideBridge.callApi<string>("get_recurrences", [])
    if (typeof result === "string") {
        return JSON.parse(result) as Recurrence[]
    }
    return []
}

export async function addRecurrence(data: Partial<Recurrence>): Promise<number | null> {
    const result = await pyodideBridge.callApi<string>("add_recurrence", [data])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.id ?? null
    }
    return null
}

export async function updateRecurrence(recId: number, data: Partial<Recurrence>): Promise<boolean> {
    const result = await pyodideBridge.callApi<string>("update_recurrence", [recId, data])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.success ?? false
    }
    return false
}

export async function deleteRecurrence(recId: number): Promise<boolean> {
    const result = await pyodideBridge.callApi<string>("delete_recurrence", [recId])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.success ?? false
    }
    return false
}

export async function backfillRecurrences(): Promise<number> {
    const result = await pyodideBridge.callApi<string>("backfill_recurrences", [])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.count ?? 0
    }
    return 0
}

export async function refreshEcheances(): Promise<boolean> {
    const result = await pyodideBridge.callApi<string>("refresh_echeances", [])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.success ?? false
    }
    return false
}
