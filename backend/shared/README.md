# 🧱 Shared (Bibliothèque Partagée)

> **Boîte à outils** utilisée par les domaines métier (Transactions, etc.)

> 📍 Pour le flux transactions : voir [LOGIC_FLOW.md](../domains/transactions/LOGIC_FLOW.md)

## 🗺️ Carte du Module

| Dossier | Rôle | Documentation |
|:---------|:-----|:-------------|
| **`database/`** | Connexion SQL avec abstraction Desktop/Mobile | [🗄️ Lire la doc](database/README.md) |
| **`services/`** | Services Transverses | [⚙️ Lire la doc](services/README.md) |

---

## 🏗️ Architecture

### Abstraction IDBConnection

Pour supporter à la fois Desktop et Mobile (Pyodide) :

```mermaid
graph TD
    subgraph "Python (Pyodide)"
        Repo[Repository]
    end
    
    subgraph "shared/database/"
        IDB[IDBConnection\n(interface)]
        Desk[DesktopConnection\n(WAL + sqlite3)]
        Cap[CapacitorConnection\n(bridge JS)]
    end
    
    Repo -->|execute| IDB
    IDB -->|Desktop| Desk
    IDB -->|Mobile| Cap
    
    Desk -->|SQLite| DB1[(SQLite\nlocal)]
    Cap -->|Plugin| DB2[(SQLite\nCapacitor)]
```

### Règles

1. **Desktop** : `sqlite3` stdlib avec WAL
2. **Mobile** : `@capacitor-community/sqlite` (pas de WAL → DELETE ou MEMORY)

---

## 🚀 Guide Rapide

### Je cherche...

- **L'abstraction SQLite (Desktop/Mobile) ?**
  👉 [`database/connection.py`](database/connection.py)

- **Comment est gérée la persistance des fichiers ?**
  👉 [`services/file_service.py`](services/file_service.py) → à抽象 vers `IStorage`
