// webapp/ui/domains/home/settings_view.tsx
"use client"

import { Download, Upload, ChevronRight } from "lucide-react"
import { Card, SectionTitle } from "@/ui/components/gestio_card"

interface SettingsViewProps {
    onExportCsv?: () => void
    onImportCsv?: () => void
    pyodideStatus?: "loading" | "ready" | "error"
}

export function SettingsView({ onExportCsv, onImportCsv, pyodideStatus = "ready" }: SettingsViewProps) {
    const statusColor = pyodideStatus === "ready"
        ? "bg-[#10b981]/10 text-[#10b981]"
        : pyodideStatus === "loading"
            ? "bg-amber-500/10 text-amber-400"
            : "bg-[#ef4444]/10 text-[#ef4444]"
    const statusLabel = pyodideStatus === "ready" ? "Prêt" : pyodideStatus === "loading" ? "Chargement…" : "Erreur"

    return (
        <div className="flex flex-col gap-6 px-4 pt-24 pb-28">
            <section>
                <SectionTitle label="Gestion des données" />
                <Card className="overflow-hidden">
                    <button type="button" onClick={onExportCsv} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors border-b border-white/5">
                        <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center shrink-0"><Download className="h-5 w-5 text-[#10b981]" /></div>
                        <div className="flex-1 text-left"><p className="text-sm font-semibold text-white">Exporter CSV</p><p className="text-xs text-slate-400">Télécharger toutes vos transactions</p></div>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                    <button type="button" onClick={onImportCsv} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center shrink-0"><Upload className="h-5 w-5 text-[#3b82f6]" /></div>
                        <div className="flex-1 text-left"><p className="text-sm font-semibold text-white">Importer Sauvegarde CSV</p><p className="text-xs text-slate-400">Restaurer vos données</p></div>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                    </button>
                </Card>
            </section>

            <section>
                <SectionTitle label="À propos" />
                <Card className="p-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#10b981] flex items-center justify-center shrink-0"><span className="text-xl font-bold text-white">G</span></div>
                        <div><p className="text-sm font-semibold text-white">Gestio v4.0.0</p><p className="text-xs text-slate-400">Application mobile de gestion financière</p></div>
                    </div>
                </Card>
            </section>

            <section>
                <SectionTitle label="Moteur de calcul" />
                <Card className="p-4">
                    <div className="flex items-center justify-between">
                        <div><p className="text-sm font-semibold text-white">Pyodide (Web Worker)</p><p className="text-xs text-slate-400">Python dans le navigateur</p></div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>{statusLabel}</div>
                    </div>
                </Card>
            </section>
        </div>
    )
}
