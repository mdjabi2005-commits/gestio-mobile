# Backend API - Attachments
# Point d'entrée pour les pièces jointes via Pyodide

import json
import logging

from config.logging_config import get_logger

logger = get_logger(__name__)


def get_attachments(transaction_id: int) -> str:
    """Récupère les pièces jointes d'une transaction."""
    try:
        from domains.transactions.services.attachment_service import attachment_service
        attachments = attachment_service.get_attachments(transaction_id)
        result = []
        for a in attachments:
            result.append({
                "id": a.id,
                "transaction_id": a.transaction_id,
                "file_name": a.file_name,
                "file_path": a.file_path,
                "file_type": a.file_type,
                "upload_date": a.upload_date.isoformat() if a.upload_date else None,
            })
        return json.dumps(result, ensure_ascii=False)

    except Exception as e:
        logger.error(f"Erreur get_attachments: {e}")
        return json.dumps([])


def delete_attachment(attachment_id: int) -> str:
    """Supprime une pièce jointe."""
    try:
        from domains.transactions.services.attachment_service import attachment_service
        success = attachment_service.delete_attachment(attachment_id)
        return json.dumps({"success": success})

    except Exception as e:
        logger.error(f"Erreur delete_attachment: {e}")
        return json.dumps({"success": False, "error": str(e)})
