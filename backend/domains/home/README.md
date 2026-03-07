# Module Home - Landing Page

> Page d'accueil de l'application mobile React.

## 🎯 Vue d'Ensemble

Le module **Home** est la page d'atterrissage ("Landing Page") de l'application mobile.
Elle affiche le tableau de bord avec KPIs et oriente vers les fonctionnalités.

## 📄 Structure

```
domains/home/
└── pages/
    └── home.py          # Point d'entrée (utilisé par Pyodide)
```

> 💡 L'UI est dans **webapp/ui/domains/home/**

---

## 📦 Notes

- **Frontend** : React + Tailwind CSS
- **Données** : Via Pyodide (Python service)
