// webapp/frontend/bridge/pyodide_bridge.ts
// Singleton qui gère la communication avec le Web Worker Pyodide

type PyodideStatus = "idle" | "loading" | "ready" | "error"
type StatusListener = (status: PyodideStatus) => void

let idCounter = 0
function nextId(): string {
    return `msg_${++idCounter}_${Date.now()}`
}

class PyodideBridge {
    private worker: Worker | null = null
    private status: PyodideStatus = "idle"
    private pendingRequests = new Map<string, {
        resolve: (data: unknown) => void
        reject: (error: Error) => void
    }>()
    private statusListeners = new Set<StatusListener>()

    /** Initialise le Web Worker et charge Pyodide */
    async init(): Promise<void> {
        if (this.status === "ready" || this.status === "loading") return

        this.setStatus("loading")

        this.worker = new Worker(
            new URL("../workers/pyodide.worker.ts", import.meta.url),
            { type: "module" }
        )

        this.worker.onmessage = (event) => {
            const { id, type, data, error, status } = event.data

            if (type === "status" && status) {
                this.setStatus(status)
                return
            }

            const pending = this.pendingRequests.get(id)
            if (!pending) return
            this.pendingRequests.delete(id)

            if (type === "error") {
                pending.reject(new Error(error || "Unknown error"))
            } else {
                pending.resolve(data)
            }
        }

        this.worker.onerror = (err) => {
            this.setStatus("error")
            console.error("[PyodideBridge] Worker error:", err)
        }

        // Demande au worker de charger Pyodide
        this.worker.postMessage({ id: "init", type: "init" })

        // Attend que le status passe à "ready" ou "error"
        return new Promise((resolve, reject) => {
            const unsubscribe = this.onStatusChange((s) => {
                if (s === "ready") { unsubscribe(); resolve() }
                if (s === "error") { unsubscribe(); reject(new Error("Pyodide failed to load")) }
            })
        })
    }

    /** Exécute du code Python et retourne le résultat */
    async runPython<T = unknown>(code: string): Promise<T> {
        if (!this.worker || this.status !== "ready") {
            throw new Error("Pyodide not ready")
        }

        const id = nextId()
        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, {
                resolve: resolve as (data: unknown) => void,
                reject,
            })
            this.worker!.postMessage({ id, type: "run", code })
        })
    }

    /** Retourne le status actuel */
    getStatus(): PyodideStatus {
        return this.status
    }

    /** S'abonne aux changements de status. Retourne la fonction unsubscribe. */
    onStatusChange(listener: StatusListener): () => void {
        this.statusListeners.add(listener)
        return () => this.statusListeners.delete(listener)
    }

    private setStatus(status: PyodideStatus) {
        this.status = status
        this.statusListeners.forEach((fn) => fn(status))
    }
}

// Singleton exporté
export const pyodideBridge = new PyodideBridge()
export type { PyodideStatus }
