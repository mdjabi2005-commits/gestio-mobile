// Frontend API - Attachments
// Appels vers le backend Python via Pyodide

import { pyodideBridge } from "../bridge/pyodide_bridge"

export interface Attachment {
    id: number
    transaction_id: number
    file_name: string
    file_path: string
    file_type: string
    upload_date: string | null
}

export async function getAttachments(transactionId: number): Promise<Attachment[]> {
    const result = await pyodideBridge.callApi<string>("get_attachments", [transactionId])
    if (typeof result === "string") {
        return JSON.parse(result) as Attachment[]
    }
    return []
}

export async function deleteAttachment(attachmentId: number): Promise<boolean> {
    const result = await pyodideBridge.callApi<string>("delete_attachment", [attachmentId])
    if (typeof result === "string") {
        const parsed = JSON.parse(result)
        return parsed.success ?? false
    }
    return false
}
