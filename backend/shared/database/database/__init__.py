# Database Connection pour Mobile (Pyodide + Capacitor)

> ⚠️ **vmobile** = Version mobile uniquement
> - Utiliser `CapacitorConnection` uniquement
> - Plus de `get_db_connection` avec sqlite3 stdlib

import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


class CapacitorConnection:
    """
    Connexion SQLite pour mobile via Pyodide + Capacitor.
    Utilise le bridge JavaScript pour accéder à SQLite natif (@capacitor-community/sqlite).
    """

    def __init__(self):
        self._db = None

    def execute(self, query: str, params: tuple = ()) -> Any:
        """Exécute une requête SQL et retourne un cursor."""
        results = self._execute_sync(query, params)
        return _Cursor(results)

    def _execute_sync(self, query: str, params: tuple = ()) -> list[dict]:
        """Exécute une requête SQL de manière synchrone via le bridge JS."""
        import uuid
        import js

        results = []
        query_id = str(uuid.uuid4())

        def on_result(event):
            results.extend(event.data.get("results", []))

        try:
            from pyodide.ffi import create_proxy
            proxy = create_proxy(on_result)
            js.window.addEventListener(f"sql_result_{query_id}", proxy)

            js.window.postMessage({
                "id": query_id,
                "type": "sql",
                "query": query,
                "params": list(params)
            }, "*")

            import time
            timeout = 5.0
            start = time.time()
            while len(results) == 0 and (time.time() - start) < timeout:
                pass

            js.window.removeEventListener(f"sql_result_{query_id}", proxy)
            return results

        except Exception as e:
            logger.error(f"Erreur execute: {e}")
            return []

    def commit(self) -> None:
        """Valide les modifications (no-op pour Capacitor)."""
        pass

    def rollback(self) -> None:
        """Annule les modifications (no-op pour Capacitor)."""
        pass

    def close(self) -> None:
        """Ferme la connexion."""
        self._db = None

    def fetch_all(self, query: str, params: tuple = ()) -> list[dict]:
        """Exécute un SELECT et retourne les résultats."""
        return self._execute_sync(query, params)

    def fetch_one(self, query: str, params: tuple = ()) -> Optional[dict]:
        """Exécute un SELECT et retourne une seule ligne."""
        results = self.fetch_all(query, params)
        return results[0] if results else None


class _Cursor:
    """Cursor pour compatibilité avec le code existant."""

    def __init__(self, results: list[dict]):
        self.results = results
        self._index = 0

    def fetchall(self) -> list[dict]:
        return self.results

    def fetchone(self) -> Optional[dict]:
        if self._index < len(self.results):
            result = self.results[self._index]
            self._index += 1
            return result
        return None


def get_connection() -> CapacitorConnection:
    """Factory qui retourne la connexion Capacitor."""
    return CapacitorConnection()


__all__ = [
    'CapacitorConnection',
    'get_connection',
]
