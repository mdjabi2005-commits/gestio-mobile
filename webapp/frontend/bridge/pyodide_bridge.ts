// webapp/frontend/bridge/pyodide_bridge.ts
// Singleton qui gère la communication avec le Web Worker Pyodide

import { sqlBridge } from "./sql_bridge"

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

    async init(): Promise<void> {
        if (this.status === "ready" || this.status === "loading") return

        this.setStatus("loading")

        this.worker = new Worker(
            new URL("../workers/pyodide.worker.ts", import.meta.url),
            { type: "module" }
        )

        this.worker.onmessage = async (event) => {
            const { id, type, data, error, status, results } = event.data

            if (type === "status" && status) {
                this.setStatus(status)
                return
            }

            if (type === "sql") {
                const pending = this.pendingRequests.get(id)
                if (pending) {
                    this.pendingRequests.delete(id)
                    try {
                        const query = data as string
                        const queryResults = await sqlBridge.execute(query)
                        this.worker!.postMessage({ id, type: "sql_result", results: queryResults })
                    } catch (err) {
                        this.worker!.postMessage({ id, type: "error", error: String(err) })
                    }
                }
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

        this.worker.postMessage({ id: "init", type: "init" })

        return new Promise((resolve, reject) => {
            const unsubscribe = this.onStatusChange((s) => {
                if (s === "ready") { unsubscribe(); resolve() }
                if (s === "error") { unsubscribe(); reject(new Error("Pyodide failed to load")) }
            })
        })
    }

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

    async callApi<T = unknown>(functionName: string, args: unknown[] = []): Promise<T> {
        if (!this.worker || this.status !== "ready") {
            throw new Error("Pyodide not ready")
        }

        const id = nextId()
        return new Promise((resolve, reject) => {
            this.pendingRequests.set(id, {
                resolve: resolve as (data: unknown) => void,
                reject,
            })
            this.worker!.postMessage({ id, type: "call", function: functionName, args })
        })
    }

    getStatus(): PyodideStatus {
        return this.status
    }

    onStatusChange(listener: StatusListener): () => void {
        this.statusListeners.add(listener)
        return () => this.statusListeners.delete(listener)
    }

    private setStatus(status: PyodideStatus) {
        this.status = status
        this.statusListeners.forEach((fn) => fn(status))
    }
}

export const pyodideBridge = new PyodideBridge()
export type { PyodideStatus }
