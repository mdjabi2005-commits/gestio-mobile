# Desktop Connection
# Implémentation SQLite pour desktop (utilise sqlite3 standard)

import logging
import sqlite3
from typing import Any, Optional

from config import DB_PATH

logger = logging.getLogger(__name__)

DATABASE_TIMEOUT = 30.0


class DesktopConnection:
    """Connexion SQLite pour desktop."""

    def __init__(self, db_path: Optional[str] = None):
        self.db_path = db_path or DB_PATH
        self.conn: Optional[sqlite3.Connection] = None
        self._connect()

    def _connect(self) -> None:
        """Établit la connexion."""
        self.conn = sqlite3.connect(self.db_path, timeout=DATABASE_TIMEOUT)
        self.conn.execute("PRAGMA foreign_keys = ON")
        self.conn.execute("PRAGMA journal_mode = WAL")
        self.conn.execute("PRAGMA busy_timeout = 30000")
        self.conn.row_factory = sqlite3.Row

    def execute(self, query: str, params: tuple = ()) -> sqlite3.Cursor:
        """Exécute une requête SQL."""
        return self.conn.execute(query, params)  # type: ignore

    def commit(self) -> None:
        """Valide les modifications."""
        self.conn.commit()

    def rollback(self) -> None:
        """Annule les modifications."""
        self.conn.rollback()

    def close(self) -> None:
        """Ferme la connexion."""
        if self.conn:
            self.conn.close()
            self.conn = None

    def fetch_all(self, query: str, params: tuple = ()) -> list[dict]:
        """Exécute un SELECT et retourne les résultats."""
        cursor = self.conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

    def fetch_one(self, query: str, params: tuple = ()) -> Optional[dict]:
        """Exécute un SELECT et retourne une seule ligne."""
        cursor = self.conn.cursor()
        cursor.execute(query, params)
        row = cursor.fetchone()
        return dict(row) if row else None


# Backward compatibility
def get_db_connection(timeout: float = DATABASE_TIMEOUT, db_path: Optional[str] = None) -> sqlite3.Connection:
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
