# bootstrap.py — Script Python exécuté dans le Web Worker Pyodide
# Initialise le backend (sys.path, DB path) et expose les fonctions via js
import sys
import json

# Injecter le chemin du backend dans sys.path
# Le Worker doit avoir monté le dossier backend/ via fetch + VFS
sys.path.insert(0, '/backend')

# Surcharge de la config pour Pyodide (pas de filesystem natif)
import os
os.environ.setdefault('PYODIDE_MODE', '1')

# Réexporter json pour les appels faciles
def to_json(obj) -> str:
    """Sérialise les données en JSON (dates ISO, None → null)."""
    from datetime import date
    def _default(o):
        if isinstance(o, date):
            return o.isoformat()
        raise TypeError(f"Not serializable: {o}")
    return json.dumps(obj, default=_default, ensure_ascii=False)
