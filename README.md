# 💰 Gestio V4 Mobile

> Application de **gestion financière personnelle** — React + Pyodide + Capacitor

> 📍 **Flux de données Transactions** : [LOGIC_FLOW.md](backend/domains/transactions/LOGIC_FLOW.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python 3.12+](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/)

---

## ✨ Fonctionnalités

| Module | Description |
|--------|-------------|
| 🏠 **Accueil** | Tableau de bord avec KPI, graphiques et vue calendrier |
| 📊 **Transactions** | CRUD complet, filtrage avancé |
| 🔄 **Récurrences** | Gestion des transactions récurrentes (loyer, abonnements…) |
| 📎 **Pièces jointes** | Associer des fichiers (tickets, factures) aux transactions |
| 🔍 **OCR** | Extraction automatique depuis tickets/PDF (ML Kit + Azure Vision) |
| 📥 **Import** | Import en masse depuis fichiers externes |

---

## 🏗️ Architecture

```
vmobile/
├── webapp/                              # React + TypeScript + Capacitor
│   ├── ui/                              # Composants visuels (dumb)
│   │   └── components/                  # Button, Card, Toast, etc.
│   ├── frontend/                        # Logique client (hooks, state)
│   │   └── domains/                     # Par domaine
│   └── src/                             # Point d'entrée React
│
├── backend/                             # Python (Pyodide/WebWorker)
│   ├── domains/                         # Domaines métier (DDD)
│   │   └── transactions/
│   │       ├── database/                # Modèles, repositories, schéma SQLite
│   │       ├── services/                # Logique métier
│   │       └── ocr/                    # Extraction OCR/LLM
│   │
│   └── shared/                          # Composants partagés
│       └── database/                    # Connexion SQLite (CapacitorConnection)
│
├── resources/                           # Assets statiques
└── AGENTS.md                           # Guide pour agents IA
```

### Flux de données

```
webapp/ui/components/  (React dumb)
        ↓
webapp/frontend/hooks/  (logique JS)
        ↓
Pyodide Web Worker  (Python)
        ↓
backend/domains/*/services/  (logique métier)
        ↓
backend/domains/*/database/repository  (SQL)
        ↓
SQLite
```

---

## 🚀 Installation & Lancement

### Prérequis

- **Python 3.12+**
- **Node.js + npm**
- **[uv](https://docs.astral.sh/uv/)** (gestionnaire de dépendances Python)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/mdjabi2005-commits/gestio-feature.git
cd gestio-feature

# Installer les dépendances Python
uv sync

# Installer les dépendances React
cd webapp && npm install
```

### Lancement (mode développement)

```bash
# Lancer le serveur React (inclut Pyodide)
cd webapp && npm run dev
```

### Build Mobile

```bash
# iOS
cd webapp && npx cap sync ios && npx cap open ios

# Android
cd webapp && npx cap sync android && npx cap open android
```

---

## 🛠️ Stack technique

| Composant | Technologie |
|-----------|-------------|
| **Frontend** | React + Tailwind CSS + TypeScript |
| **Runtime Python** | Pyodide (WebAssembly) dans Web Worker |
| **Données** | SQLite via `@capacitor-community/sqlite` |
| **Validation** | Pydantic |
| **OCR (online)** | Azure Vision API (OpenAI) |
| **OCR (offline)** | ML Kit via plugin Capacitor |
| **Parsing texte** | groq_parser.py |
| **Packaging** | Capacitor (iOS + Android) |
| **PWA** | Vite PWA plugin (cold start ~5s) |

---

## ⚠️ Cold Start ~5s (PWA)

| Étape | Avant PWA | Après PWA |
|-------|-----------|-----------|
| Download WASM | 5-10s (réseau) | 0s (cache) |
| Parse WASM + Init Python | ~5s | ~5s |
| Import modules | 5-10s | ~0s |
| **TOTAL** | **15-30s** | **~5s** |

Le PWA met en cache Pyodide dans le Cache Storage du navigateur.
Le parsing et init Python restent (~5s) → c'est le CPU qui bosse.

---

## ⚠️ Dépendances INTERDITES (Pyodide)

Ces librairies sont **trop lourdes** pour le navigateur mobile :
- ❌ `pandas`
- ❌ `opencv-python`
- ❌ `rapidocr_onnxruntime`
- ❌ `streamlit`
- ❌ `plotly`

**Alternative** : utiliser des listes de dictionnaires ou `cursor.fetchall()`

---

## 📐 Conventions

### Commits (Conventional Commits)

```
feat: ajouter export PDF des transactions #12
fix: corriger le calcul des récurrences mensuelles #15
chore: mettre à jour les dépendances #20
```

### Types autorisés

| Type | Description |
|------|-------------|
| `feat:` | Nouvelle fonctionnalité |
| `fix:` | Correction de bug |
| `refactor:` | Nettoyage/optimisation |
| `chore:` | Mise à jour de configuration |

### Branches

| Préfixe | Usage |
|---------|-------|
| `main` | Branche principale stable |
| `feat/` | Nouvelles fonctionnalités |
| `fix/` | Corrections de bugs |

---

## 📄 Licence

[MIT](LICENSE) © 2026 DJABI
