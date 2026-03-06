// webapp/frontend/domains/transactions/useScan.ts
// Hook frontend pour le scan OCR

import { useState, useCallback } from "react"

interface ScanResult {
    description: string
    amount: number
    category: string
    date: string
}

type ScanStatus = "idle" | "scanning" | "success" | "error"

export function useScan() {
    const [status, setStatus] = useState<ScanStatus>("idle")
    const [result, setResult] = useState<ScanResult | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleScan = useCallback(async (imageData: string) => {
        setStatus("scanning")
        setError(null)

        try {
            // TODO: Envoyer l'image au service OCR Python via Pyodide
            // Pour l'instant, simule un résultat après un délai
            await new Promise((resolve) => setTimeout(resolve, 2000))

            const mockResult: ScanResult = {
                description: "Ticket de caisse — Carrefour",
                amount: -47.85,
                category: "Courses",
                date: new Date().toISOString().split("T")[0],
            }

            setResult(mockResult)
            setStatus("success")
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur OCR inconnue")
            setStatus("error")
        }
    }, [])

    const reset = useCallback(() => {
        setStatus("idle")
        setResult(null)
        setError(null)
    }, [])

    return {
        status,
        result,
        error,
        handleScan,
        reset,
    }
}
