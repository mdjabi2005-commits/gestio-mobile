# Architecture Données (Database)

> Couche de persistance utilisant le pattern **Repository**.

> 📍 Position dans le flux : voir [LOGIC_FLOW.md](../LOGIC_FLOW.md)

```mermaid
graph LR
    subgraph "Ce module"
        Repo[TransactionRepository]
    end
    
    subgraph "shared/database/"
        IDB[IDBConnection]
    end
    
    Repo -->|execute| IDB
    IDB -->|SQL| DB[(SQLite)]
    
    style Repo fill:#e1f5fe,stroke:#0277bd
    style IDB fill:#e8f5e9,stroke:#2e7d32
```

## 🗄️ Schéma de Données (ER Diagram)

```mermaid
erDiagram
    TRANSACTION {
        int id PK
        string type "Dépense/Revenu"
        string categorie
        string sous_categorie
        float montant
        date date
        string description
        string source "OCR, Manuel, etc"
        string external_id "FITID bancaire unique"
    }

    RECURRENCE {
        int id PK
        string frequence "Mensuel, Hebdo..."
        date date_debut
        date date_fin
        float montant
        string categorie
    }

    RECURRENCE ||--o{ TRANSACTION : "génère"
```

## 🛠️ Pattern Repository

L'accès direct SQL est interdit dans les couches supérieures. On passe par les repositories.

### `TransactionRepository`

- **Mapping** : Convertit les lignes SQL en objets Python (`Transaction`)
- **Validation** : Vérifie l'intégrité des données via Pydantic

> ⚠️ **Pas de Pandas dans Pyodide** — utiliser `cursor.fetchall()` retourne des listes de dictionnaires

```python
# Au lieu de pandas
rows = cursor.fetchall()  # -> list[dict]
return [dict(row) for row in rows]
```

### `RecurrenceRepository`

- Gère le cycle de vie des abonnements
- Projette les futures occurrences

## 🛡️ Sécurité & Intégrité

- **Unicité** : Le champ `external_id` (indexé UNIQUE) empêche les doublons
- **Types** : Montants en `REAL`, dates en `TEXT` (ISO 8601)
- **Foreign Keys** : Activées via `PRAGMA foreign_keys = ON`
