# Database Connection pour Mobile (Pyodide + Capacitor)

import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


class CapacitorConnection:
    """
    Connexion SQLite pour mobile via Pyodide + Capacitor.
    Utilise le bridge JavaScript pour accéder à SQLite natif.
    """

    def __init__(self):
        self._db = None

    def execute(self, query: str, params: tuple = ()) -> Any:
        """Exécute une requête SQL."""
        # À implémenter avec le bridge Capacitor
        raise NotImplementedError("À implémenter avec le bridge JS")

    def commit(self) -> None:
        """Valide les modifications."""
        pass

    def rollback(self) -> None:
        """Annule les modifications."""
        pass

    def close(self) -> None:
        """Ferme la connexion."""
        self._db = None

    def fetch_all(self, query: str, params: tuple = ()) -> list[dict]:
        """Exécute un SELECT et retourne les résultats."""
        raise NotImplementedError("À implémenter avec le bridge JS")

    def fetch_one(self, query: str, params: tuple = ()) -> Optional[dict]:
        """Exécute un SELECT et retourne une seule ligne."""
        results = self.fetch_all(query, params)
        return results[0] if results else None


def get_connection() -> CapacitorConnection:
    """Factory qui retourne la connexion Capacitor."""
    return CapacitorConnection()


# Backward compatibility
from config import DB_PATH
import sqlite3


def get_db_connection(timeout: float = 30.0, db_path: Optional[str] = None) -> sqlite3.Connection:
    """Fonction de compatibilité pour le code existant."""
    actual_db_path = db_path if db_path is not None else DB_PATH
    conn = sqlite3.connect(actual_db_path, timeout=max(timeout, 30.0))
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    conn.execute("PRAGMA busy_timeout = 30000")
    conn.row_factory = sqlite3.Row
    return conn


def close_connection(conn: Optional[sqlite3.Connection]) -> None:
    """Ferme une connexion."""
    if conn:
        conn.close()


__all__ = [
    'CapacitorConnection',
    'get_connection',
    'get_db_connection',
    'close_connection',
]
