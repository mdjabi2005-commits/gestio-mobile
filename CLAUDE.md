# Gestio V4 - Agent IA

> Contexte minimal pour qu'un agent IA puisse travailler sur le projet

## Stack
- **Backend**: Python 3.12+, SQLite, Domain-Driven Design
- **UI**: Streamlit multi-pages
- **OCR**: RapidOCR + LLM (Groq/Ollama)
- **Gestionnaire**: uv

## Structure clé
```
v4/
├── main.py                 # Point d'entrée Streamlit
├── launcher/               # Lanceur (dev + PyInstaller)    
├── config/                 # Configuration (paths, logging)
├── domains/                # Logique métier (transactions, home)
│   └── transactions/
│       ├── database/       # Modèles, repositories, schéma SQLite
│       ├── services/       # Logique métier
│       ├── ocr/            # Extraction OCR/LLM
│       ├── pages/          # Pages Streamlit
│       └── view/           # Composants UI (charts, table)
└── shared/                 # Composants réutilisables
    ├── database/           # Connexion SQLite
    ├── ui/                 # Helpers, styles, toasts
    └── services/           # Services transversaux
```

## Règles critiques
- **DB**: Toujours passer par un Repository (jamais de SQL dans les views)
- **API LLM/OCR**: Mock obligatoire dans les tests (pas de consommation crédits)
- **UI**: Utiliser les composants partagés (`shared/ui/`)
- **State**: Streamlit → `st.session_state`

## Commandes
```bash
uv sync                    # Installer les dépendances
uv run streamlit run main.py   # Lancer l'app
uv run python launcher.py       # Lancer avec navigateur auto
pytest                     # Lancer les tests
uv run pyinstaller gestio.spec  # Build EXE
```

## Pour commencer

> ⚡ **Avant tout** : demander à l'utilisateur sur quelle **issue** (`#numéro`) et quelle **branche** il travaille.
> Vérifier avec `git branch --show-current`. Voir `.agent/getting-started.md` pour le rituel complet.

1. Lire `.agent/workflows/*.md` pour les conventions
2. Lire `.agent/terms.md` pour le vocabulaire métier
3. Lire les **README des dossiers** concernés avant de modifier du code
4. Vérifier `.env` (GROQ_API_KEY si OCR activé)

## Avant de modifier du code

**Obligatoire** : Lire le fichier `README.md` du dossier concerné avant toute modification.

Exemple :
- Pour modifier `domains/transactions/` → lire `domains/transactions/README.md`
- Pour modifier `domains/transactions/pages/add/` → lire ce dossier aussi

Chaque dossier contient un README qui explique :
- La structure interne
- Les fichiers clés
- Le flux de données
