// webapp/ui/components/sunburst.tsx
// Composant Sunburst D3.js — SVG pur, remplace react-plotly.js
"use client"

import { useRef, useEffect, useCallback, useState } from "react"
import * as d3 from "d3"

// ─── Types publics ────────────────────────────────────────────────────────────

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

// ─── Type D3 interne ─────────────────────────────────────────────────────────

interface D3Node {
    code: string
    label: string
    amount: number
    color: string
    children?: D3Node[]
}

// ─── Conversion hiérarchie plate → arbre D3 ──────────────────────────────────

function toD3Tree(hierarchy: SunburstHierarchy): D3Node | null {
    const rootKey = Object.keys(hierarchy)[0]
    if (!rootKey) return null

    function build(code: string): D3Node {
        const node = hierarchy[code]
        const children = (node.children ?? [])
            .filter((c) => hierarchy[c])
            .map(build)
        return {
            code,
            label: node.label,
            amount: Math.abs(node.amount) || 1,
            color: node.color,
            children: children.length > 0 ? children : undefined,
        }
    }

    return build(rootKey)
}

// ─── Composant Principal ──────────────────────────────────────────────────────

export function Sunburst({ hierarchy, height = 320, onSelectionChange }: SunburstProps) {
    const svgRef = useRef<SVGSVGElement>(null)
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const selectedRef = useRef<Set<string>>(selected)
    selectedRef.current = selected

    const draw = useCallback(() => {
        const svgEl = svgRef.current
        if (!svgEl) return

        const tree = toD3Tree(hierarchy)
        if (!tree) return

        const width = svgEl.clientWidth || 340
        const radius = Math.min(width, height) / 2

        // Supprime le contenu précédent
        d3.select(svgEl).selectAll("*").remove()

        const svg = d3.select(svgEl)
            .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`)
            .attr("width", "100%")
            .attr("height", height)

        // Hiérarchie D3
        const root = d3.hierarchy<D3Node>(tree)
            .sum((d) => (d.children ? 0 : d.amount))
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

        // Partition sunburst
        d3.partition<D3Node>().size([2 * Math.PI, radius])(root)

        // Générateur d'arcs
        const arc = d3.arc<d3.HierarchyRectangularNode<D3Node>>()
            .startAngle((d) => (d as any).x0)
            .endAngle((d) => (d as any).x1)
            .padAngle(0.015)
            .padRadius(radius / 3)
            .innerRadius((d) => (d as any).y0 + 4)
            .outerRadius((d) => (d as any).y1 - 4)

        const g = svg.append("g")

        // Dessine les arcs
        g.selectAll<SVGPathElement, d3.HierarchyRectangularNode<D3Node>>("path")
            .data(root.descendants().filter((d) => d.depth > 0))
            .join("path")
            .attr("d", arc as any)
            .attr("fill", (d) => {
                const isSelected = selectedRef.current.has(d.data.code)
                return isSelected ? "#9333ea" : d.data.color
            })
            .attr("fill-opacity", (d) => (d.depth === 1 ? 0.9 : 0.75))
            .attr("stroke", "#0f172a")
            .attr("stroke-width", 1.5)
            .style("cursor", "pointer")
            .on("click", (_event, d) => {
                // Clic sur racine = reset
                if (d.depth === 1 && d.parent?.depth === 0) {
                    // handled below per node type — racine = nœud sans parent
                }

                setSelected((prev) => {
                    const next = new Set(prev)

                    if (d.data.code === root.data.code) {
                        next.clear()
                        onSelectionChange?.({ codes: [], action: "reset" })
                        return next
                    }

                    if (next.has(d.data.code)) {
                        next.delete(d.data.code)
                    } else {
                        next.add(d.data.code)
                    }
                    onSelectionChange?.({ codes: Array.from(next), action: "select" })
                    return next
                })
            })
            // Hover
            .on("mouseover", function () {
                d3.select(this).attr("fill-opacity", 1)
            })
            .on("mouseout", function (_event, d) {
                d3.select(this).attr("fill-opacity", d.depth === 1 ? 0.9 : 0.75)
            })

        // Labels (seulement si l'arc est assez grand)
        g.selectAll<SVGTextElement, d3.HierarchyRectangularNode<D3Node>>("text")
            .data(
                root.descendants().filter((d) => {
                    const node = d as any
                    return d.depth > 0 && (node.x1 - node.x0) > 0.25
                })
            )
            .join("text")
            .attr("transform", (d) => {
                const node = d as any
                const angle = ((node.x0 + node.x1) / 2) * (180 / Math.PI) - 90
                const r = (node.y0 + node.y1) / 2
                return `rotate(${angle}) translate(${r},0) rotate(${angle > 90 ? 180 : 0})`
            })
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .attr("font-size", (d) => (d.depth === 1 ? "11px" : "9px"))
            .attr("font-family", "Inter, Arial, sans-serif")
            .attr("pointer-events", "none")
            .text((d) => {
                const node = d as any
                const arcLen = ((node.x1 - node.x0) * (node.y1 + node.y0)) / 2
                return arcLen > 30 ? d.data.label : ""
            })

        // Cercle central cliquable (reset)
        svg.append("circle")
            .attr("r", (root.descendants()[0] as any).y0 || radius * 0.2)
            .attr("fill", "#1e293b")
            .attr("stroke", "#334155")
            .attr("stroke-width", 1)
            .style("cursor", "pointer")
            .on("click", () => {
                setSelected(new Set())
                onSelectionChange?.({ codes: [], action: "reset" })
            })

        // Texte central
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.1em")
            .attr("fill", "#94a3b8")
            .attr("font-size", "10px")
            .attr("font-family", "Inter, Arial, sans-serif")
            .text("Total")

        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1.2em")
            .attr("fill", "white")
            .attr("font-size", "12px")
            .attr("font-weight", "bold")
            .attr("font-family", "Inter, Arial, sans-serif")
            .text(() => {
                const total = root.value ?? 0
                return total.toLocaleString("fr-FR", { maximumFractionDigits: 0 }) + " €"
            })

    }, [hierarchy, height, onSelectionChange])

    // Redessine si la hiérarchie ou la sélection change
    useEffect(() => {
        draw()
    }, [draw, selected])

    // Redessine si le conteneur est redimensionné
    useEffect(() => {
        if (!svgRef.current) return
        const ro = new ResizeObserver(() => draw())
        ro.observe(svgRef.current)
        return () => ro.disconnect()
    }, [draw])

    if (Object.keys(hierarchy).length === 0) {
        return (
            <div className="flex items-center justify-center text-slate-500 text-sm" style={{ height }}>
                Aucune donnée à afficher
            </div>
        )
    }

    return (
        <div className="w-full" style={{ height }}>
            <svg ref={svgRef} className="w-full" style={{ height }} />
        </div>
    )
}
