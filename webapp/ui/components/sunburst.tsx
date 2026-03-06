// webapp/ui/components/sunburst.tsx
// Composant Sunburst React pur — remplace le custom Streamlit component plotly_tree.js
"use client"

import { useState, useCallback, useMemo, lazy, Suspense } from "react"
import { Loader2 } from "lucide-react"

// Import lazy de Plotly (~3MB) pour ne pas bloquer le chargement initial
const Plot = lazy(() => import("react-plotly.js"))

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SunburstNode {
    code: string
    label: string
    amount: number
    color: string
    children: string[]
}

export type SunburstHierarchy = Record<string, SunburstNode>

export interface SunburstSelection {
    codes: string[]
    action: "select" | "reset"
}

interface SunburstProps {
    hierarchy: SunburstHierarchy
    height?: number
    onSelectionChange?: (selection: SunburstSelection) => void
}

// ─── Construction des données Plotly depuis la hiérarchie ────────────────────

function buildPlotlyData(hierarchy: SunburstHierarchy, selectedCodes: Set<string>) {
    const labels: string[] = []
    const parents: string[] = []
    const values: number[] = []
    const colors: string[] = []
    const codes: string[] = []
    const ids: string[] = []

    function addNode(code: string, parentId = "") {
        const node = hierarchy[code]
        if (!node) return

        labels.push(node.label || code)
        parents.push(parentId)
        values.push(Math.abs(node.amount || 1))
        colors.push(selectedCodes.has(code) ? "#9333ea" : (node.color || "#64748b"))
        codes.push(code)
        ids.push(code)

        node.children?.forEach((child) => addNode(child, code))
    }

    // Nœud racine — par convention "TR" (Total Réel)
    const rootKey = Object.keys(hierarchy)[0] ?? "TR"
    addNode(rootKey)

    return { labels, parents, values, colors, codes, ids }
}

// ─── Composant ───────────────────────────────────────────────────────────────

export function Sunburst({ hierarchy, height = 320, onSelectionChange }: SunburstProps) {
    const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set())

    const { labels, parents, values, colors, codes, ids } = useMemo(
        () => buildPlotlyData(hierarchy, selectedCodes),
        [hierarchy, selectedCodes]
    )

    const handleClick = useCallback((event: Readonly<Plotly.PlotMouseEvent>) => {
        const point = event.points[0]
        if (!point) return

        const clickedCode = codes[point.pointNumber]
        if (!clickedCode) return

        // Clic sur la racine = reset
        const rootKey = ids[0]
        if (clickedCode === rootKey) {
            setSelectedCodes(new Set())
            onSelectionChange?.({ codes: [], action: "reset" })
            return
        }

        // Toggle sélection
        setSelectedCodes((prev) => {
            const next = new Set(prev)
            if (next.has(clickedCode)) next.delete(clickedCode)
            else next.add(clickedCode)
            onSelectionChange?.({ codes: Array.from(next), action: "select" })
            return next
        })
    }, [codes, ids, onSelectionChange])

    if (Object.keys(hierarchy).length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-slate-500 text-sm">
                Aucune donnée à afficher
            </div>
        )
    }

    return (
        <Suspense fallback={<div className="flex items-center justify-center" style={{ height }}><Loader2 className="h-8 w-8 text-[#3b82f6] animate-spin" /></div>}>
            <Plot
                data={[{
                    type: "sunburst",
                    labels,
                    parents,
                    values,
                    ids,
                    marker: { colors, line: { width: 2, color: "#0f172a" } },
                    textfont: { size: 11, color: "white", family: "Inter, Arial, sans-serif" },
                    hovertemplate: "<b>%{label}</b><br>%{value:.0f} €<extra></extra>",
                    branchvalues: "total",
                    insidetextorientation: "radial",
                } as any]}
                layout={{
                    height,
                    margin: { t: 10, l: 0, r: 0, b: 0 },
                    paper_bgcolor: "transparent",
                    plot_bgcolor: "transparent",
                    font: { color: "white", size: 11 },
                    showlegend: false,
                }}
                config={{ displayModeBar: false, responsive: true }}
                onClick={handleClick}
                style={{ width: "100%", height: `${height}px` }}
            />
        </Suspense>
    )
}

