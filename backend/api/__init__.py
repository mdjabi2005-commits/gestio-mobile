# Backend API Package
# Re-export toutes les fonctions pour Pyodide

from .transactions import (
    get_transactions,
    add_transaction,
    update_transaction,
    delete_transaction,
    get_monthly_summary,
    get_categories,
)

from .attachments import (
    get_attachments,
    delete_attachment,
)

from .recurrences import (
    get_recurrences,
    add_recurrence,
    update_recurrence,
    delete_recurrence,
    backfill_recurrences,
    refresh_echeances,
)

__all__ = [
    # Transactions
    "get_transactions",
    "add_transaction",
    "update_transaction",
    "delete_transaction",
    "get_monthly_summary",
    "get_categories",
    # Attachments
    "get_attachments",
    "delete_attachment",
    # Recurrences
    "get_recurrences",
    "add_recurrence",
    "update_recurrence",
    "delete_recurrence",
    "backfill_recurrences",
    "refresh_echeances",
]
