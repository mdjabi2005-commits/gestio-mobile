# Capacitor Connection
# Implémentation SQLite pour mobile via Pyodide + Capacitor bridge

import logging
from typing import Any, Optional

logger = logging.getLogger(__name__)


class CapacitorConnection:
    """
    Connexion SQLite pour mobile (Pyodide + Capacitor).
    Utilise le bridge JavaScript pour accéder à SQLite natif.
    """

    def __init__(self):
        self._db = None
        self._connect()

    def _connect(self) -> None:
        """Établit la connexion via le bridge JS."""
        try:
            # Import Pyodide pour accéder à l'objet global JS
            import pyodide
            js = pyodide.globals.get("window")
            
            if js and hasattr(js, "Capacitor"):
                # Plugin Capacitor SQLite
                from js import Capacitor, Plugins
                self._db = Plugins.SQLite
                # Ouvrir la base de données
                # Note: à adapter selon la config Capacitor
            else:
                # Fallback: utiliser OPFS (File System API)
                logger.warning("Capacitor non disponible, utilisation de OPFS")
                self._use_opfs_fallback()
        except Exception as e:
            logger.error(f"Erreur connexion Capacitor: {e}")
            self._use_opfs_fallback()

    def _use_opfs_fallback(self) -> None:
        """Fallback vers OPFS si Capacitor non disponible."""
        # Utilise la version WASM de SQLite
        pass

    def execute(self, query: str, params: tuple = ()) -> Any:
        """Exécute une requête SQL."""
        # À implémenter avec le bridge Capacitor
        raise NotImplementedError("À implémenter avec le bridge JS")

    def commit(self) -> None:
        """Valide les modifications."""
        # Commit automatique pour Capacitor
        pass

    def rollback(self) -> None:
        """Annule les modifications."""
        pass

    def close(self) -> None:
        """Ferme la connexion."""
        self._db = None

    def fetch_all(self, query: str, params: tuple = ()) -> list[dict]:
        """Exécute un SELECT et retourne les résultats."""
        # À implémenter avec le bridge Capacitor
        # Exemple:
        # result = await self._db.execute({query, values: list(params)})
        # return [dict(row) for row in result]
        raise NotImplementedError("À implémenter avec le bridge JS")

    def fetch_one(self, query: str, params: tuple = ()) -> Optional[dict]:
        """Exécute un SELECT et retourne une seule ligne."""
        results = self.fetch_all(query, params)
        return results[0] if results else None
