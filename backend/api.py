"""
API Layer pour Pyodide
Point d'entrée unique pour le frontend React (offline 100%)

Cet module expose des fonctions JSON-ready qui peuvent être appelées
depuis le frontend via Pyodide.runPython().
"""

# Re-export depuis le package api
from api import (
    get_transactions,
    add_transaction,
    update_transaction,
    delete_transaction,
    get_monthly_summary,
    get_categories,
    get_attachments,
    delete_attachment,
    get_recurrences,
    add_recurrence,
    update_recurrence,
    delete_recurrence,
    backfill_recurrences,
    refresh_echeances,
)

__all__ = [
    "get_transactions",
    "add_transaction",
    "update_transaction",
    "delete_transaction",
    "get_monthly_summary",
    "get_categories",
    "get_attachments",
    "delete_attachment",
    "get_recurrences",
    "add_recurrence",
    "update_recurrence",
    "delete_recurrence",
    "backfill_recurrences",
    "refresh_echeances",
]
