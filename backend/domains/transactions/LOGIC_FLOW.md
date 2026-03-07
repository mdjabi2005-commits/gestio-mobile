# LOGIC_FLOW - Transactions

> Documentation complète du flux de données pour le domaine Transactions.

## Vue d'ensemble (TOUTE la pipeline)

```mermaid
flowchart TD
    subgraph "webapp/ui/ (React)"
        UI_Transaction["TransactionView\nTransactionForm\nTransactionList"]
    end
    
    subgraph "webapp/frontend/ (Hooks)"
        Hook_Trans["useTransactions\nuseTransactionForm"]
    end
    
    subgraph "Pyodide Worker"
        Pyodide["Python Runtime"]
    end
    
    subgraph "backend/domains/transactions/services/"
        Svc_Trans["TransactionService\nAttachmentService"]
    end
    
    subgraph "backend/domains/transactions/database/"
        Repo_Trans["TransactionRepository\nAttachmentRepository"]
    end
    
    subgraph "shared/database/"
        DB_Conn["IDBConnection\n(Desktop/Capacitor)"]
    end
    
    SQLite[("SQLite")]
    
    UI_Transaction -->|Interagit| Hook_Trans
    Hook_Trans -->|await pyodide.runPythonAsync| Pyodide
    Pyodide -->|Appelle| Svc_Trans
    Svc_Trans -->|CRUD| Repo_Trans
    Repo_Trans -->|execute| DB_Conn
    DB_Conn -->|SQL| SQLite
```

## Pipelines détaillées

### Pipeline: Ajouter une transaction

```mermaid
sequenceDiagram
    participant User
    participant UI as TransactionForm
    participant Hook as useTransactions
    participant Pyodide
    participant Service as TransactionService
    participant Repo as TransactionRepository
    participant DB as SQLite
    
    User->>UI: Remplit formulaire
    UI->>Hook: submit(data)
    Hook->>Pyodide: await addTransaction(data)
    Pyodide->>Service: service.add(transaction)
    Service->>Repo: repo.add(transaction)
    Repo->>DB: INSERT INTO transactions
    DB-->>Repo: new_id
    Repo-->>Service: new_id
    Service-->>Pyodide: new_id
    Pyodide-->>Hook: new_id
    Hook-->>UI: success
    UI-->>User: Transaction ajoutée !
```

### Pipeline: Scanner un ticket (OCR)

```mermaid
sequenceDiagram
    participant User
    participant UI as ScanView
    participant Hook as useScan
    participant Pyodide
    participant OCR as AzureParser/GroqParser
    participant Service as TransactionService
    participant Repo as TransactionRepository
    
    User->>UI: Prend photo
    UI->>Hook: scan(image)
    Hook->>Pyodide: await processOCR(image)
    Pyodide->>OCR: parse(raw_text)
    OCR-->>Pyodide: {categorie, montant, description}
    Pyodide->>Service: service.add(extracted_data)
    Service->>Repo: repo.add(transaction)
    Repo-->>Service: new_id
    Service-->>Pyodide: new_id
    Pyodide-->>Hook: transaction
    Hook-->>UI: Aperçu transaction
    User->>UI: Confirme
    UI->>Hook: confirm()
```

### Pipeline: Consulter les transactions

```mermaid
sequenceDiagram
    participant User
    participant UI as TransactionList
    participant Hook as useTransactions
    participant Pyodide
    participant Service as TransactionService
    participant Repo as TransactionRepository
    
    User->>UI: Ouvre liste
    UI->>Hook: useTransactions(filters)
    Hook->>Pyodide: await getFiltered(start, end, category)
    Pyodide->>Service: service.get_filtered(...)
    Service->>Repo: repo.get_filtered(...)
    Repo-->>Service: list[dict]
    Service-->>Pyodide: list[dict]
    Pyodide-->>Hook: transactions[]
    Hook-->>UI: Affiche liste
```

## Composants clés

| Couche | Fichier | Rôle |
|--------|---------|------|
| UI | `webapp/ui/domains/transactions/` | Composants React |
| Hook | `webapp/frontend/domains/transactions/useTransactions.ts` | Bridge Python↔React |
| Service | `backend/domains/transactions/services/transaction_service.py` | Logique métier |
| Repo | `backend/domains/transactions/database/repository_transaction.py` | CRUD SQLite |

## Notes

- **Pas de Pandas dans Pyodide** → retourne `list[dict]`
- **Pyodide toujours dans Web Worker** → async only
- **OCR offline** : ML Kit via Capacitor
- **OCR online** : Azure Vision API
