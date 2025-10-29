# Projet Final - Bases de Données Relationnelles et Non Relationnelles

## Membres du groupe

Nom/prénom :  
Nom/prénom :

---

## 1. Présentation du Projet

Décrivez votre application en 3-5 phrases : problématique, objectif et fonctionnalités principales.

## 2. Architecture PostgreSQL (Méthode Merise)

**MCD (Modèle Conceptuel de Données)**  
_(insérez capture d'écran)_

**MLD (Modèle Logique de Données)**  
_(insérez capture d'écran)_

**MPD (Modèle Physique de Données)**

Le schéma complet est dans `postgres/init/01_schema.sql`.

**Principales tables** :

- `client` (UUID, prenom, nom, email, tel, pwd_hash)
- `adresse` (UUID, id_client, libelle, ligne1/2, code_postal, ville, pays, flags default billing/shipping)
- `categorie` (UUID, libelle, slug, parent_id pour hiérarchie)
- `produit` (UUID, id_categorie, nom, slug, description, tva, actif)
- `variante` (UUID, id_produit, sku, ean, prix_ht, poids_g)
- `stock` (id_variante, quantite, reservee, seuil_alerte)
- `panier` (UUID, id_client, token)
- `ligne_panier` (id_panier, id_variante, quantite)
- `commande` (UUID, ref, id_client, id_adr_fact, id_adr_livr, **statut** ENUM, total_ht/tva/ttc, dates)
- `ligne_commande` (id_commande, id_variante, libelle figé, quantite, prix_unitaire_ht, tva)
- `paiement` (UUID, id_commande, mode, montant, **statut** ENUM, transaction_id)
- `livraison` (UUID, id_commande, transporteur, num_suivi, **statut** ENUM, cout_ht, dates)
- `promotion` (UUID, libelle, **type** ENUM, valeur, date_debut/fin, actif)
- `produit_promotion` (table d'association)

**Spécificités techniques** :

- **UUID** (`uuid-ossp`) pour tous les identifiants
- **JSONB** pour les attributs de variantes (couleur, taille, etc.)
- **ENUMs** pour les statuts (commande, paiement, livraison) et types (promotion)
- **Contraintes** CHECK sur montants, quantités, dates
- **Index composites** pour optimiser les jointures fréquentes

## 3. Architecture MongoDB

```json
// Exemple de structure de vos documents (avis, logs)
```

## 4. Justification des Choix Techniques

- **Répartition des données** : Quelles données en PostgreSQL ? Quelles données en MongoDB ? Pourquoi ?
- **Modélisation MongoDB** : Documents imbriqués ou références ? Justification
- **Relations inter-bases** : Comment l'API relie les deux mondes (id_produit, id_client) ?

## 5. Exemples de Requêtes Complexes

**PostgreSQL**

```sql
-- Exemple jointure + agrégat
```

**MongoDB**

```javascript
// Exemple pipeline d'agrégation
```

## 6. Stratégie de Sauvegarde

- **PostgreSQL** : pg_dump / sauvegarde continue ?
- **MongoDB** : mongodump / replica set ?
- **Fréquence** : Complète / incrémentale / différentielle
- **Restauration** : Procédure

## 7. Lancement & Tests

```bash
cp .env.example .env
make up
curl http://localhost:8000/api/health
```

- Endpoints clés :
  - **PostgreSQL** :
    - Catégories, Clients, Adresses
    - Produits (avec variantes et stock)
    - Paniers, Commandes, Paiements, Livraisons, Promotions
  - **MongoDB** : `/api/avis/:id_produit`, `/api/logs/:id_client`
- Scripts d'insertion :
  - `postgres/init/99_seed.sql` _(à compléter)_
  - `mongo/init/99_seed.js` _(à compléter)_
