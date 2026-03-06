# Roadmap — Issue #7 : Pyodide API Layer

> **Objectif** : Remplacer le SQL inline du frontend par des appels API propres via Pyodide (offline 100% mobile)

---

## Contexte technique

- **Architecture cible** : React + Pyodide (Web Worker) + Capacitor + SQLite
- **Principe** : 100% offline — le "serveur" Python tourne dans le navigateur
- **Cold start** : ~20s (1ère fois) → ~5s (ensuite grâce PWA cache)

---

## État d'avancement

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Nettoyage Backend (supprimer Pandas) | ❌ À faire |
| 2 | Création API Layer (api.py) | ✅ Terminé |
| 3 | Configuration Pyodide Worker | ✅ Terminé |
| 4 | Frontend - Migration vers API | ✅ Terminé |
| 5 | Configuration PWA | ✅ Terminé |
| 6 | SQLite Capacitor (Mobile) | ✅ Ébauche |

---

## Phase 1 : Nettoyage Backend (À faire)

### Objectif
Supprimer Pandas du backend pour alléger le runtime Pyodide.

### Fichiers à modifier

| Fichier | Action |
|---------|--------|
| `domains/transactions/database/repository.py` | Retourner `list[dict]` au lieu de `pd.DataFrame` |
| `domains/transactions/services/transaction_service.py` | Retourner `list[dict]` au lieu de `pd.DataFrame` |
| `shared/utils/dataframe_utils.py` | Supprimer ou conserver sans Pandas |

### Détail

- Remplacer `pd.read_sql_query()` par `cursor.fetchall()` + `dict(row)`
- Supprimer les imports Pandas
- Mettre à jour les types de retour

---

## Phase 2 : Création API Layer ✅ (Terminé)

### Résumé

```
backend/api/
├── __init__.py       # Re-exports tout
├── transactions.py   # ~80 lignes
├── attachments.py    # ~35 lignes
└── recurrences.py   # ~90 lignes
```

### Fonctions exposées

**Transactions**
- `get_transactions(filters)` → JSON string
- `add_transaction(data)` → `{"id": int}`
- `update_transaction(id, data)` → `{"success": bool}`
- `delete_transaction(id)` → `{"success": bool}`
- `get_monthly_summary(year, month)` → `{"total_revenus", "total_depenses", "solde"}`
- `get_categories()` → `["Alimentation", ...]`

**Attachments**
- `get_attachments(transaction_id)` → `[{"id", "file_name", ...}]`
- `delete_attachment(id)` → `{"success": bool}`

**Recurrences**
- `get_recurrences()` → `[{"id", "type", ...}]`
- `add_recurrence(data)` → `{"id": int}`
- `update_recurrence(id, data)` → `{"success": bool}`
- `delete_recurrence(id)` → `{"success": bool}`
- `backfill_recurrences()` → `{"count": int}`
- `refresh_echeances()` → `{"success": bool}`

---

## Phase 3 : Configuration Pyodide Worker ✅ (Terminé)

### Fichiers modifiés

| Fichier | Description |
|---------|-------------|
| `webapp/frontend/workers/pyodide.worker.ts` | Charge `api.py` au démarrage |
| `webapp/frontend/bridge/pyodide_bridge.ts` | Ajoute méthode `callApi()` |

### Fonctionnement

```
Frontend → pyodideBridge.callApi("get_transactions", [filters])
    ↓
Worker Pyodide → api.get_transactions(filters)
    ↓
SQLite → JSON
    ↓
Frontend
```

---

## Phase 4 : Frontend - Migration vers API ✅ (Terminé)

### Résumé

```
webapp/frontend/api/
├── index.ts         # Re-exports
├── transactions.ts  # ~85 lignes
├── attachments.ts   # ~30 lignes
└── recurrences.ts   # ~70 lignes
```

### Avant → Après

| Avant (SQL inline) | Après (API) |
|---------------------|-------------|
| `runPython("SELECT * FROM...")` | `api.getTransactions(filters)` |

---

## Phase 5 : Configuration PWA ✅ (Terminé)

### Fichiers créés

| Fichier | Description |
|---------|-------------|
| `webapp/public/manifest.json` | Configuration PWA |
| `webapp/public/sw.js` | Service Worker pour cache Pyodide |
| `webapp/public/splash.html` | Écran de chargement |
| `webapp/index.html` | Meta tags PWA |
| `webapp/src/main.tsx` | Registration Service Worker |

### À faire

Ajouter les icônes dans `webapp/public/icons/` :
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

---

## Phase 6 : SQLite Capacitor (Ébauche)

### Fichiers

| Fichier | Description |
|---------|-------------|
| `shared/database/database/__init__.py` | Interface + factory |
| `shared/database/database/capacitor_connection.py` | Bridge JS pour SQLite |

### À implémenter

La `CapacitorConnection` est une ébauche. Quand `@capacitor-community/sqlite` sera installé :

1. Implémenter les méthodes `execute()`, `fetch_all()`, `fetch_one()`
2. Configurer le bridge JS dans le worker Pyodide
3. Tester sur mobile

---

## Prochaines étapes

1. **Phase 1** : Supprimer Pandas du backend
2. Ajouter les icônes PWA
3. Implémenter `CapacitorConnection`
4. Tester l'app sur mobile

---

## Stack finale

```
Mobile (App)
├── React (UI)
├── Pyodide (Python runtime)
│   └── api/ (votre code Python)
├── Capacitor (Container)
└── SQLite (Données locales)
```

---

*Dernière mise à jour : 2026-03-06*
