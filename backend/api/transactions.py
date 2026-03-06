# Backend API - Transactions
# Point d'entrée pour les transactions via Pyodide

import json
import logging
from datetime import date
from typing import Optional

from config.logging_config import get_logger
from domains.transactions.database.repository import TransactionRepository

logger = get_logger(__name__)

repository = TransactionRepository()


def _serialize_transaction(tx: dict) -> dict:
    """Sérialise une transaction pour JSON."""
    result = {}
    for key, value in tx.items():
        if isinstance(value, date):
            result[key] = value.isoformat()
        elif value is None:
            result[key] = None
        else:
            result[key] = value
    return result


def get_transactions(filters: Optional[dict] = None) -> str:
    """Récupère les transactions avec filtres optionnels."""
    filters = filters or {}
    try:
        start = filters.get("start_date")
        end = filters.get("end_date")
        category = filters.get("category")

        start_date = date.fromisoformat(start) if start else None
        end_date = date.fromisoformat(end) if end else None

        results = repository.get_filtered(
            start_date=start_date,
            end_date=end_date,
            category=category,
        )
        serialized = [_serialize_transaction(tx) for tx in results]
        return json.dumps(serialized, ensure_ascii=False)

    except Exception as e:
        logger.error(f"Erreur get_transactions: {e}")
        return json.dumps([])


def add_transaction(data: dict) -> str:
    """Ajoute une nouvelle transaction."""
    try:
        new_id = repository.add(data)
        if new_id:
            return json.dumps({"id": new_id})
        return json.dumps({"error": "Ajout échoué"})

    except Exception as e:
        logger.error(f"Erreur add_transaction: {e}")
        return json.dumps({"error": str(e)})


def update_transaction(tx_id: int, data: dict) -> str:
    """Met à jour une transaction existante."""
    try:
        data["id"] = tx_id
        success = repository.update(data)
        return json.dumps({"success": success})

    except Exception as e:
        logger.error(f"Erreur update_transaction: {e}")
        return json.dumps({"success": False, "error": str(e)})


def delete_transaction(tx_id: int) -> str:
    """Supprime une transaction."""
    try:
        success = repository.delete(tx_id)
        return json.dumps({"success": success})

    except Exception as e:
        logger.error(f"Erreur delete_transaction: {e}")
        return json.dumps({"success": False, "error": str(e)})


def get_monthly_summary(year: int, month: int) -> str:
    """Récupère le résumé mensuel."""
    try:
        start_date = date(year, month, 1)
        last_day = (date(year, month + 1, 1) - __import__("datetime").timedelta(days=1)).day
        end_date = date(year, month, last_day)

        transactions = repository.get_filtered(
            start_date=start_date,
            end_date=end_date,
        )

        total_revenus = 0.0
        total_depenses = 0.0

        for tx in transactions:
            montant = tx.get("montant", 0)
            tx_type = tx.get("type", "")
            if tx_type == "Revenu":
                total_revenus += montant
            elif tx_type == "Dépense":
                total_depenses += montant

        return json.dumps({
            "total_revenus": round(total_revenus, 2),
            "total_depenses": round(total_depenses, 2),
            "solde": round(total_revenus - total_depenses, 2),
        })

    except Exception as e:
        logger.error(f"Erreur get_monthly_summary: {e}")
        return json.dumps({
            "total_revenus": 0,
            "total_depenses": 0,
            "solde": 0,
        })


def get_categories() -> str:
    """Récupère la liste des catégories uniques."""
    try:
        transactions = repository.get_all()
        categories = set()
        for tx in transactions:
            if tx.get("categorie"):
                categories.add(tx["categorie"])
        return json.dumps(sorted(list(categories)), ensure_ascii=False)

    except Exception as e:
        logger.error(f"Erreur get_categories: {e}")
        return json.dumps([])
