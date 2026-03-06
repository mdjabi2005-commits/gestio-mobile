# Backend API - Recurrences
# Point d'entrée pour les récurrences via Pyodide

import json
import logging
from datetime import date

from config.logging_config import get_logger

logger = get_logger(__name__)


def get_recurrences() -> str:
    """Récupère toutes les récurrences actives."""
    try:
        from domains.transactions.database.repository_recurrence import RecurrenceRepository
        repo = RecurrenceRepository()
        recurrences = repo.get_all_recurrences()
        result = []
        for rec in recurrences:
            serialized = {}
            for key, value in rec.model_dump().items():
                if isinstance(value, date):
                    serialized[key] = value.isoformat()
                else:
                    serialized[key] = value
            result.append(serialized)
        return json.dumps(result, ensure_ascii=False)

    except Exception as e:
        logger.error(f"Erreur get_recurrences: {e}")
        return json.dumps([])


def add_recurrence(data: dict) -> str:
    """Ajoute une nouvelle récurrence."""
    try:
        from domains.transactions.database.repository_recurrence import RecurrenceRepository
        from domains.transactions.database.model_recurrence import Recurrence
        repo = RecurrenceRepository()
        recurrence = Recurrence(**data)
        new_id = repo.add_recurrence(recurrence)
        if new_id:
            return json.dumps({"id": new_id})
        return json.dumps({"error": "Ajout échoué"})

    except Exception as e:
        logger.error(f"Erreur add_recurrence: {e}")
        return json.dumps({"error": str(e)})


def update_recurrence(rec_id: int, data: dict) -> str:
    """Met à jour une récurrence."""
    try:
        from domains.transactions.database.repository_recurrence import RecurrenceRepository
        repo = RecurrenceRepository()
        data["id"] = rec_id
        success = repo.update_recurrence(data)
        return json.dumps({"success": success})

    except Exception as e:
        logger.error(f"Erreur update_recurrence: {e}")
        return json.dumps({"success": False, "error": str(e)})


def delete_recurrence(rec_id: int) -> str:
    """Supprime une récurrence."""
    try:
        from domains.transactions.database.repository_recurrence import RecurrenceRepository
        repo = RecurrenceRepository()
        success = repo.delete_recurrence(rec_id)
        return json.dumps({"success": success})

    except Exception as e:
        logger.error(f"Erreur delete_recurrence: {e}")
        return json.dumps({"success": False, "error": str(e)})


def backfill_recurrences() -> str:
    """Génère les transactions récurrentes manquantes jusqu'à aujourd'hui."""
    try:
        from domains.transactions.recurrence.recurrence_service import backfill_all_recurrences
        count = backfill_all_recurrences()
        return json.dumps({"count": count})

    except Exception as e:
        logger.error(f"Erreur backfill_recurrences: {e}")
        return json.dumps({"count": 0, "error": str(e)})


def refresh_echeances() -> str:
    """Rafraîchit les échéances."""
    try:
        from domains.transactions.recurrence.recurrence_service import refresh_echeances
        refresh_echeances()
        return json.dumps({"success": True})

    except Exception as e:
        logger.error(f"Erreur refresh_echeances: {e}")
        return json.dumps({"success": False, "error": str(e)})
