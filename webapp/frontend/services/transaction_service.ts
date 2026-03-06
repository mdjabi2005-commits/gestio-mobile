// webapp/frontend/services/transaction_service.ts
// Couche service côté TypeScript — requêtes SQL directes via sqlite3 de Pyodide

import { pyodideBridge } from "../bridge/pyodide_bridge"

// ─── Types (clés françaises, miroir exact du modèle Python) ──────────────────

export interface TransactionJS {
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
    start_date?: string  // "YYYY-MM-DD"
    end_date?: string
    category?: string
}

// ─── Chemin de la base de données ────────────────────────────────────────────
// Le chemin exact de la DB utilisateur (même que config/paths.py)
function getDbPath(): string {
    // Sur desktop/Capacitor : ~/analyse/finances.db
    // On laisse Python/Pyodide construire le chemin depuis la variable HOME
    return "__auto__"
}

// ─── Requête SQL directe via sqlite3 Python (sans importer le backend) ───────

export async function fetchTransactions(
    filters: TransactionFilters = {}
): Promise<TransactionJS[]> {
    const { start_date, end_date, category } = filters

    const startClause = start_date ? `AND date >= '${start_date}'` : ""
    const endClause = end_date ? `AND date <= '${end_date}'` : ""
    const catClause = category ? `AND categorie = '${category.replace(/'/g, "''")}'` : ""

    const code = `
import sqlite3, json, os
from pathlib import Path

db_path = str(Path.home() / "analyse" / "finances.db")
if not os.path.exists(db_path):
    json.dumps([])
else:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cur = conn.execute("""
        SELECT id, type, categorie, sous_categorie, description,
               montant, date, source, recurrence, date_fin,
               compte_iban, external_id
        FROM transactions
        WHERE 1=1
        ${startClause}
        ${endClause}
        ${catClause}
        ORDER BY date DESC
        LIMIT 200
    """)
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    json.dumps(rows)
`

    const raw = await pyodideBridge.runPython<string>(code)
    return raw ? (JSON.parse(raw) as TransactionJS[]) : []
}


export async function fetchMonthlySummary(month: string): Promise<{
    total_revenus: number
    total_depenses: number
    solde: number
}> {
    const [year, m] = month.split("-").map(Number)
    const start = `${year}-${String(m).padStart(2, "0")}-01`
    const lastDay = new Date(year, m, 0).getDate()
    const end = `${year}-${String(m).padStart(2, "0")}-${lastDay}`

    const code = `
import sqlite3, json, os
from pathlib import Path

db_path = str(Path.home() / "analyse" / "finances.db")
if not os.path.exists(db_path):
    json.dumps({'total_revenus': 0, 'total_depenses': 0, 'solde': 0})
else:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cur = conn.execute("""
        SELECT type, SUM(montant) as total
        FROM transactions
        WHERE date >= '${start}' AND date <= '${end}'
        GROUP BY type
    """)
    rows = {r['type']: r['total'] for r in cur.fetchall()}
    conn.close()
    revenus  = round(rows.get('Revenu', 0), 2)
    depenses = round(rows.get('Dépense', 0), 2)
    json.dumps({
        'total_revenus':  revenus,
        'total_depenses': depenses,
        'solde': round(revenus - depenses, 2),
    })
`

    const raw = await pyodideBridge.runPython<string>(code)
    return raw
        ? JSON.parse(raw)
        : { total_revenus: 0, total_depenses: 0, solde: 0 }
}
