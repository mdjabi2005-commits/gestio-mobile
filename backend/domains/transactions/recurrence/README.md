# 🔄 Moteur de Récurrence

> **Cœur temporel** de l'application. Gère tout ce qui se répète (Abonnements, Loyers, Salaires...).

## 🎯 Objectif

Transformer une règle statique ("Loyer 500€ tous les 5 du mois") en transactions concrètes.

> 💡 **Inchangé** pour la version mobile — même logique, même table SQLite

## 🎯 Objectif

Transformer une règle statique ("Loyer 500€ tous les 5 du mois") en transactions concrètes dans le passé et le futur.

## 🛠️ Composants

### `recurrence_service.py`

Le cerveau du système. Il contient deux logiques principales :

#### 1. Le "Backfill" (Rattrapage du Passé)

À chaque démarrage, l'application se demande : *"Est-ce que j'ai raté des occurrences depuis la dernière fois ?"*

- **Entrée** : Date de dernière génération -> Aujourd'hui.
- **Action** : Crée des transactions réelles dans la table `transactions`.
- **Marqueur** : Ces transactions ont `source = 'récurrente_auto'`.

#### 2. La "Projection" (Prévision du Futur)

Pour afficher le "Reste à vivre" futur ou les échéances à venir.

- **Entrée** : Aujourd'hui -> +12 mois (par exemple).
- **Action** : Crée des enregistrements virtuels dans la table `echeances`.
- **Usage** : Permet au module **Home** d'afficher les alertes de trésorerie.

## 📊 Schéma de Données

Une récurrence est définie par :

- **Fréquence** : `mensuelle`, `hebdomadaire`, `annuelle`.
- **Montant** : Fixe (ex: Loyer) ou Estimé (ex: Électricité).
- **Période** : `date_debut` (obligatoire) et `date_fin` (optionnelle).

```mermaid
graph LR
    Recurrence[Règle Récurrence] 
    Time[Temps qui passe]
    
    Recurrence + Time -->|Passé| Trans[Table Transactions]
    Recurrence + Time -->|Futur| Ech[Table Echéances]
    
    style Trans fill:#e1f5fe
    style Ech fill:#fff3e0
```
