// webapp/frontend/bridge/sql_bridge.ts
// Bridge SQLite pour Capacitor - communique avec le main thread

import { Capacitor } from "@capacitor/core"
import { SQLite, SQLiteConnection } from "@capacitor-community/sqlite"

type SqlCallback = (results: unknown[]) => void

class SqlBridge {
    private sqlite: SQLiteConnection | null = null
    private dbName = "gestio.db"
    private isInitialized = false

    async init(): Promise<void> {
        if (this.isInitialized || !Capacitor.isNativePlatform()) {
            return
        }

        try {
            this.sqlite = await SQLite.createConnection(this.dbName)
            await this.sqlite.open()
            this.isInitialized = true
            console.log("[SqlBridge] SQLite initialized")
        } catch (err) {
            console.error("[SqlBridge] Init failed:", err)
        }
    }

    async execute(query: string, params: unknown[] = []): Promise<unknown[]> {
        if (!this.sqlite) {
            await this.init()
        }

        if (!this.sqlite) {
            throw new Error("SQLite not available")
        }

        try {
            const isSelect = query.trim().toUpperCase().startsWith("SELECT")
            
            if (isSelect) {
                const result = await this.sqlite.query(query, params as (string | number | null)[])
                return result.values || []
            } else {
                await this.sqlite.run(query, params as (string | number | null)[])
                return []
            }
        } catch (err) {
            console.error("[SqlBridge] Query error:", err)
            throw err
        }
    }

    async close(): Promise<void> {
        if (this.sqlite) {
            await this.sqlite.close()
            this.isInitialized = false
        }
    }
}

export const sqlBridge = new SqlBridge()
