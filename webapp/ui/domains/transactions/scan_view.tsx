// domains/transactions/pages/ui/scan_view.tsx
"use client"

import React, { useState } from "react"
import { Camera, Image as ImageIcon } from "lucide-react"

interface ScanViewProps {
    onScanSuccess?: (imageBase64: string) => void
}

export function ScanView({ onScanSuccess }: ScanViewProps) {
    const [preview, setPreview] = useState<string | null>(null)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result as string
            setPreview(result)
            onScanSuccess?.(result)
        }
        reader.readAsDataURL(file)
    }

    return (
        <div className="flex flex-col items-center gap-5 px-4 pt-24 pb-28 min-h-screen">
            <div className="w-full aspect-[3/4] bg-[#1e293b] rounded-3xl border border-white/5 border-dashed flex items-center justify-center overflow-hidden">
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="text-center p-6">
                        <div className="w-20 h-20 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="h-10 w-10 text-[#3b82f6]" />
                        </div>
                        <p className="text-slate-400 text-sm">Zone de prévisualisation</p>
                        <p className="text-slate-500 text-xs mt-1">Prenez une photo de votre ticket ou facture</p>
                    </div>
                )}
            </div>

            {/* Bouton Prendre une photo — déclenche l'input file natif */}
            <label className="w-full bg-[#3b82f6] hover:bg-[#3b82f6]/90 text-white font-semibold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-colors cursor-pointer">
                <Camera className="h-5 w-5" />
                Prendre une photo
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
            </label>

            {preview && (
                <button
                    type="button"
                    onClick={() => setPreview(null)}
                    className="w-full bg-[#1e293b] text-white font-medium py-3 px-6 rounded-xl border border-white/5 transition-colors"
                >
                    Reprendre
                </button>
            )}
        </div>
    )
}
