// webapp/frontend/hooks/usePyodide.ts
// Hook React pour le status et l'initialisation de Pyodide

import { useEffect, useState } from "react"
import { pyodideBridge, type PyodideStatus } from "../bridge/pyodide_bridge"

export function usePyodide() {
    const [status, setStatus] = useState<PyodideStatus>(pyodideBridge.getStatus())

    useEffect(() => {
        const unsubscribe = pyodideBridge.onStatusChange(setStatus)

        // Auto-init si pas encore chargé
        if (pyodideBridge.getStatus() === "idle") {
            pyodideBridge.init().catch(() => {
                // L'erreur est déjà gérée par le status listener
            })
        }

        return unsubscribe
    }, [])

    return {
        status,
        isReady: status === "ready",
        isLoading: status === "loading",
        runPython: pyodideBridge.runPython.bind(pyodideBridge),
    }
}
