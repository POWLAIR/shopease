# 📚 Documentation API - ShopEase

> API REST complète avec endpoints CRUD et agrégations avancées (MongoDB + PostgreSQL)

**Base URL :** `http://localhost:8000`  
**Documentation interactive :** <http://localhost:8000/docs>

---

## 📋 Table des Matières

### 🔧 Endpoints de Base

- [Health Check](#-health-check)

### 📦 CRUD Produits & Catalogue

- [Produits](#-produits)
- [Variantes](#-variantes)
- [Catégories](#-catégories)
- [Stock](#-stock)

### 👥 CRUD Clients & Adresses

- [Clients](#-clients)
- [Adresses](#-adresses)

### 🛒 CRUD Panier & Commandes

- [Paniers](#-paniers)
- [Commandes](#-commandes)
- [Paiements](#-paiements)
- [Livraisons](#-livraisons)

### 🎁 Promotions & Avis

- [Promotions](#-promotions)
- [Avis (MongoDB)](#-avis-mongodb)
- [Logs (MongoDB)](#-logs-mongodb)

### 📊 Statistiques & Agrégations

- [Stats Globales](#-stats-globales)
- [Stats par Entité](#-stats-par-entité)
  - [Avis](#stats-avis)
  - [Logs](#stats-logs)
  - [Promotions](#stats-promotions)
  - [Paiements](#stats-paiements)
  - [Commandes](#stats-commandes)
  - [Paniers](#stats-paniers)
  - [Clients](#stats-clients)

---

## 🔧 Health Check

### Vérifier l'état de l'API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/health` | État de l'API et connexions BDD |

**Réponse :**

```json
{
  "status": "ok",
  "postgres": true,
  "mongo": true
}
```

---

## 📦 Produits

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/produits` | Lister tous les produits |
| **GET** | `/api/produits?q={recherche}` | Rechercher par texte |
| **GET** | `/api/produits?categorie_slug={slug}` | Filtrer par catégorie |
| **POST** | `/api/produits` | Créer un produit |
| **PUT** | `/api/produits/{id}` | Modifier un produit |
| **DELETE** | `/api/produits/{id}` | Supprimer un produit |

### Créer un Produit

**POST** `/api/produits`

```json
{
  "id_categorie": "uuid",
  "nom": "MacBook Pro 14\"",
  "slug": "macbook-pro-14",
  "description": "Ordinateur portable haute performance",
  "tva": 20.0,
  "actif": true
}
```

**Réponse : `201 Created`**

### Modifier un Produit

**PUT** `/api/produits/{id}`

Tous les champs sont optionnels. Seuls les champs fournis seront modifiés.

---

## 🔧 Variantes

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/produits/{id}/variantes` | Variantes d'un produit |
| **POST** | `/api/produits/{id}/variantes` | Créer une variante |
| **PUT** | `/api/produits/variantes/{variante_id}` | Modifier une variante |
| **PATCH** | `/api/produits/variantes/{variante_id}/stock` | Modifier le stock |

### Créer une Variante

**POST** `/api/produits/{id}/variantes`

```json
{
  "sku": "MBP14-512-SG",
  "ean": "1234567890123",
  "prix_ht": 1999.99,
  "poids_g": 1600,
  "attributs_json": {
    "couleur": "Gris sidéral",
    "ram": "16GB",
    "stockage": "512GB"
  }
}
```

**Réponse : `201 Created`**

---

## 📂 Catégories

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/categories` | Lister toutes les catégories |
| **POST** | `/api/categories` | Créer une catégorie |
| **PUT** | `/api/categories/{id}` | Modifier une catégorie |
| **DELETE** | `/api/categories/{id}` | Supprimer une catégorie |

### Créer une Catégorie

**POST** `/api/categories`

```json
{
  "libelle": "Ordinateurs Portables",
  "slug": "ordinateurs-portables",
  "parent_id": "uuid-parent" // optionnel pour sous-catégorie
}
```

---

## 📦 Stock

### Modifier le Stock

**PATCH** `/api/produits/variantes/{variante_id}/stock`

```json
{
  "quantite": 100,      // Stock total
  "reservee": 5,        // Stock réservé (paniers)
  "seuil_alerte": 10    // Alerte stock faible
}
```

---

## 👥 Clients

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/clients` | Lister tous les clients |
| **GET** | `/api/clients/stats` | 📊 Statistiques clients |
| **POST** | `/api/clients` | Créer un client |
| **PUT** | `/api/clients/{id}` | Modifier un client |
| **DELETE** | `/api/clients/{id}` | Supprimer un client |

### Créer un Client

**POST** `/api/clients`

```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "tel": "+33612345678",
  "pwd_hash": "hashed_password"
}
```

---

## 🏠 Adresses

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/adresses/client/{client_id}` | Adresses d'un client |
| **POST** | `/api/adresses` | Créer une adresse |
| **PUT** | `/api/adresses/{id}` | Modifier une adresse |
| **DELETE** | `/api/adresses/{id}` | Supprimer une adresse |

### Créer une Adresse

**POST** `/api/adresses`

```json
{
  "id_client": "uuid",
  "libelle": "Maison",
  "ligne1": "15 Rue de la Paix",
  "ligne2": "Appartement 3B",
  "code_postal": "75001",
  "ville": "Paris",
  "pays": "France",
  "is_default_billing": true,
  "is_default_shipping": true
}
```

---

## 🛒 Paniers

### GET `/api/paniers`

Récupérer tout les paniers

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/paniers/{id}` | Détails d'un panier |
| **GET** | `/api/paniers/{id}/lignes` | Lignes d'un panier |
| **GET** | `/api/paniers/stats` | 📊 Stats paniers (abandon) |
| **POST** | `/api/paniers` | Créer un panier |
| **POST** | `/api/paniers/{id}/lignes` | Ajouter article au panier |
| **PUT** | `/api/paniers/{id}` | Modifier un panier |
| **PUT** | `/api/paniers/{id}/lignes/{variante_id}` | Modifier quantité |
| **DELETE** | `/api/paniers/{id}` | Supprimer un panier |
| **DELETE** | `/api/paniers/{id}/lignes/{variante_id}` | Retirer article |

### Ajouter un Article au Panier

**POST** `/api/paniers/{id}/lignes`

```json
{
  "id_variante": "uuid",
  "quantite": 2
}
```

---

## 📋 Commandes

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/commandes` | Lister toutes les commandes |
| **GET** | `/api/commandes/{id}` | Détails d'une commande |
| **GET** | `/api/commandes/stats` | 📊 Stats commandes |
| **POST** | `/api/commandes` | Créer une commande |
| **PUT** | `/api/commandes/{id}` | Modifier une commande |
| **DELETE** | `/api/commandes/{id}` | Supprimer une commande |

### Créer une Commande

**POST** `/api/commandes`

```json
{
  "ref": "CMD-2025-000123",
  "id_client": "uuid",
  "id_adr_fact": "uuid",
  "id_adr_livr": "uuid",
  "total_ht": 1666.66,
  "total_tva": 333.34,
  "total_ttc": 2000.00,
  "lignes": [
    {
      "id_variante": "uuid",
      "libelle": "MacBook Pro 14\" - Gris sidéral",
      "quantite": 1,
      "prix_unitaire_ht": 1666.66,
      "tva": 20.0
    }
  ]
}
```

---

## 💳 Paiements

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/paiements/{id}` | Détails d'un paiement |
| **GET** | `/api/paiements/commande/{id}` | Paiements d'une commande |
| **GET** | `/api/paiements/stats` | 📊 Stats paiements |
| **POST** | `/api/paiements` | Créer un paiement |
| **PUT** | `/api/paiements/{id}` | Modifier un paiement |
| **DELETE** | `/api/paiements/{id}` | Supprimer un paiement |

### Créer un Paiement

**POST** `/api/paiements`

```json
{
  "id_commande": "uuid",
  "mode": "carte",
  "montant": 2000.00,
  "statut": "CREATED",
  "transaction_id": "stripe_ch_123456"
}
```

**Statuts possibles :** `CREATED` | `AUTHORIZED` | `CAPTURED` | `FAILED` | `REFUNDED`

---

## 🚚 Livraisons

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/livraisons/{id}` | Détails d'une livraison |
| **GET** | `/api/livraisons/commande/{id}` | Livraison d'une commande |
| **POST** | `/api/livraisons` | Créer une livraison |
| **PUT** | `/api/livraisons/{id}` | Modifier une livraison |
| **DELETE** | `/api/livraisons/{id}` | Supprimer une livraison |

### Créer une Livraison

**POST** `/api/livraisons`

```json
{
  "id_commande": "uuid",
  "transporteur": "Colissimo",
  "num_suivi": "6A12345678910",
  "statut": "EN_PREPARATION",
  "cout_ht": 5.00
}
```

**Statuts possibles :** `EN_PREPARATION` | `EXPEDIEE` | `EN_TRANSIT` | `LIVREE` | `RETARD`

---

## 🎁 Promotions

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/promotions` | Promotions actives |
| **GET** | `/api/promotions/stats` | 📊 Stats promotions |
| **POST** | `/api/promotions` | Créer une promotion |
| **POST** | `/api/promotions/attach` | Attacher à un produit |

### Créer une Promotion

**POST** `/api/promotions`

```json
{
  "libelle": "Black Friday",
  "type": "PERCENT",
  "valeur": 20.0,
  "date_debut": "2025-11-20T00:00:00Z",
  "date_fin": "2025-11-30T23:59:59Z",
  "actif": true
}
```

**Types :** `PERCENT` (pourcentage) | `AMOUNT` (montant fixe)

---

## ⭐ Avis (MongoDB)

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/avis` | Tous les avis |
| **GET** | `/api/avis/{id_produit}` | Avis d'un produit |
| **GET** | `/api/avis/stats` | 📊 Stats avis (agrégations) |
| **POST** | `/api/avis` | Créer un avis |

### Créer un Avis

**POST** `/api/avis`

```json
{
  "id_produit": "product-123",
  "auteur": "Sophie Martin",
  "commentaire": "Excellent produit, très satisfaite !",
  "note": 5
}
```

---

## 📝 Logs (MongoDB)

### Endpoints Disponibles

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| **GET** | `/api/logs` | Tous les logs (1000 derniers) |
| **GET** | `/api/logs/client/{id}` | Logs d'un client |
| **GET** | `/api/logs/stats` | 📊 Stats logs (agrégations) |
| **POST** | `/api/logs` | Créer un log |

### Créer un Log

**POST** `/api/logs`

```json
{
  "id_client": 123,
  "action": "view_product",
  "id_produit": 456
}
```

---

# 📊 Statistiques & Agrégations

> Endpoints avancés avec agrégations MongoDB et PostgreSQL

---

## 🌐 Stats Globales

### Vue d'Ensemble de la Plateforme

| Méthode | Endpoint | Description | Base de Données |
|---------|----------|-------------|-----------------|
| **GET** | `/api/stats/global` | Stats complètes | PostgreSQL + MongoDB |
| **GET** | `/api/stats/dashboard` | KPIs principaux | PostgreSQL |

### GET `/api/stats/global`

**Vue d'ensemble hybride (PostgreSQL + MongoDB)**

**Réponse :**

```json
{
  "ventes": {
    "total_ventes": 5915.88,
    "total_commandes": 5,
    "commandes_validees": 4,
    "panier_moyen": 1183.18,
    "taux_conversion": 80.0
  },
  "clients": {
    "total_clients": 5
  },
  "catalogue": {
    "total_produits": 9,
    "total_variantes": 22,
    "total_stock": 1292
  },
  "avis": {
    "total_avis": 6,
    "note_moyenne": 4.67
  },
  "activite": {
    "total_logs": 15
  },
  "revenus_par_mois": [
    {
      "mois": "2025-10",
      "nb_commandes": 35,
      "total_ventes": 3456.78
    }
  ],
  "top_produits": [
    {
      "nom": "MacBook Pro 14\"",
      "quantite_vendue": 15,
      "ca_genere": 29999.85
    }
  ]
}
```

### GET `/api/stats/dashboard`

**KPIs pour le tableau de bord**

**Réponse :**

```json
{
  "aujourdhui": {
    "commandes": 5,
    "ventes": 425.50,
    "croissance_vs_hier": 12.5
  },
  "ce_mois": {
    "commandes": 75,
    "ventes": 6789.00
  },
  "clients_actifs_30j": 23
}
```

---

## 📊 Stats par Entité

### Stats Avis

**GET** `/api/avis/stats`

**Agrégations MongoDB utilisées :**

- `$avg` : Note moyenne
- `$match` : Filtrage par période
- `$group` : Répartition par note
- `$facet` : Exécution parallèle

**Réponse :**

```json
{
  "note_moyenne": 4.67,
  "total_avis": 6,
  "avis_ce_mois": 0,
  "repartition_notes": {
    "5_etoiles": 4,
    "4_etoiles": 2,
    "3_etoiles": 0,
    "2_etoiles": 0,
    "1_etoiles": 0
  }
}
```

---

### Stats Logs

**GET** `/api/logs/stats`

**Agrégations MongoDB utilisées :**

- `$count` : Comptage total
- `$group` : Regroupement par action/type
- `$sort` : Tri par fréquence
- `$limit` : Limitation des résultats

**Réponse :**

```json
{
  "total_logs": 15,
  "actions_frequentes": [
    {
      "action": "LOGIN",
      "count": 5,
      "pourcentage": 33.33
    },
    {
      "action": "ADD_TO_CART",
      "count": 4,
      "pourcentage": 26.67
    }
  ],
  "types_frequents": [
    {
      "type": "AUTH",
      "count": 5,
      "pourcentage": 33.33
    }
  ]
}
```

---

### Stats Promotions

**GET** `/api/promotions/stats`

**Techniques SQL PostgreSQL :**

- `COUNT(*) FILTER (WHERE ...)`
- `AVG(CASE WHEN ... THEN ... END)`
- Filtrage temporel avec `NOW()`

**Réponse :**

```json
{
  "promotions_actives": [
    {
      "id": "uuid",
      "libelle": "Soldes d'été",
      "type": "PERCENT",
      "valeur": 15.0,
      "date_debut": "2024-06-01T00:00:00Z",
      "date_fin": "2024-08-31T23:59:59Z"
    }
  ],
  "nombre_actives": 2,
  "total_promotions": 4,
  "reduction_moyenne_pourcentage": 12.5,
  "reduction_moyenne_montant": 0
}
```

---

### Stats Paiements

**GET** `/api/paiements/stats`

**Techniques SQL PostgreSQL :**

- `SUM()`, `AVG()` : Agrégations
- `COUNT(*) FILTER (WHERE ...)` : Comptages par statut
- `GROUP BY` + calcul de pourcentages

**Réponse :**

```json
{
  "montant_total": 5915.88,
  "montant_moyen": 1183.18,
  "total_paiements": 5,
  "nombre_reussis": 4,
  "nombre_echoues": 0,
  "nombre_rembourses": 0,
  "taux_reussite": 80.0,
  "repartition_par_mode": [
    {
      "mode": "carte",
      "count": 4,
      "pourcentage": 80.0
    },
    {
      "mode": "paypal",
      "count": 1,
      "pourcentage": 20.0
    }
  ],
  "repartition_par_statut": [
    {
      "statut": "CAPTURED",
      "count": 4,
      "pourcentage": 80.0
    }
  ]
}
```

---

### Stats Commandes

**GET** `/api/commandes/stats`

**Techniques SQL PostgreSQL :**

- Agrégations multiples : `COUNT()`, `SUM()`, `AVG()`
- `DATE()` + `INTERVAL` : Manipulation de dates
- `GROUP BY DATE()` : Regroupement par jour

**Réponse :**

```json
{
  "total_commandes": 5,
  "nombre_validees": 4,
  "nombre_en_attente": 1,
  "nombre_annulees": 0,
  "montant_total": 5915.88,
  "montant_moyen": 1183.18,
  "taux_validation": 80.0,
  "repartition_par_statut": [
    {
      "statut": "LIVREE",
      "count": 1,
      "pourcentage": 20.0
    },
    {
      "statut": "EXPEDIEE",
      "count": 1,
      "pourcentage": 20.0
    }
  ],
  "volume_par_jour": [
    {
      "date": "2024-06-01",
      "nombre_commandes": 1,
      "total_ventes": 227.97
    }
  ]
}
```

---

### Stats Paniers

**GET** `/api/paniers/stats`

**Critère d'abandon :** Panier non modifié depuis plus de 7 jours

**Techniques SQL PostgreSQL :**

- `LEFT JOIN` avec sous-requête
- `EXTRACT(DAY FROM ...)` : Calcul de différence en jours
- `INTERVAL '7 days'` : Critère d'abandon

**Réponse :**

```json
{
  "total_paniers": 3,
  "paniers_abandonnes": 3,
  "paniers_actifs": 0,
  "taux_abandon": 100.0,
  "montant_moyen": 868.3,
  "details_paniers_abandonnes": [
    {
      "id": "uuid",
      "created_at": "2024-06-03T16:00:00Z",
      "updated_at": "2024-06-03T16:30:00Z",
      "jours_depuis_maj": 148,
      "montant_estime": 125.50
    }
  ]
}
```

---

### Stats Clients

**GET** `/api/clients/stats`

**Techniques SQL PostgreSQL :**

- `DATE_TRUNC('month', NOW())` : Début du mois courant
- Sous-requêtes pour calcul de moyennes
- `ORDER BY` multiple pour classement

**Réponse :**

```json
{
  "total_clients": 5,
  "nouveaux_ce_mois": 0,
  "nombre_moyen_adresses": 1.2,
  "top_clients": [
    {
      "id": "uuid",
      "prenom": "Sophie",
      "nom": "Martin",
      "email": "sophie.martin@example.com",
      "nb_commandes": 1,
      "total_depense": 2627.97
    }
  ],
  "nouveaux_clients": []
}
```

---

## 🧪 Tests Rapides

### Tester Tous les Endpoints de Stats

```bash
# Stats globales
curl http://localhost:8000/api/stats/global
curl http://localhost:8000/api/stats/dashboard

# Stats par entité
curl http://localhost:8000/api/avis/stats
curl http://localhost:8000/api/logs/stats
curl http://localhost:8000/api/promotions/stats
curl http://localhost:8000/api/paiements/stats
curl http://localhost:8000/api/commandes/stats
curl http://localhost:8000/api/paniers/stats
curl http://localhost:8000/api/clients/stats
```

---

## 📊 État du CRUD

| Entité | Create | Read | Update | Delete | Stats | Statut |
|--------|:------:|:----:|:------:|:------:|:-----:|--------|
| **Produits** | ✅ | ✅ | ✅ | ✅ | ➖ | CRUD Complet |
| **Variantes** | ✅ | ✅ | ✅ | ➖ | ➖ | CRUD Partiel |
| **Stock** | ✅ | ✅ | ✅ | ➖ | ➖ | CRUD Partiel |
| **Catégories** | ✅ | ✅ | ✅ | ✅ | ➖ | CRUD Complet |
| **Clients** | ✅ | ✅ | ✅ | ✅ | ✅ | **CRUD + Stats** |
| **Adresses** | ✅ | ✅ | ✅ | ✅ | ➖ | CRUD Complet |
| **Paniers** | ✅ | ✅ | ✅ | ✅ | ✅ | **CRUD + Stats** |
| **Commandes** | ✅ | ✅ | ✅ | ✅ | ✅ | **CRUD + Stats** |
| **Paiements** | ✅ | ✅ | ✅ | ✅ | ✅ | **CRUD + Stats** |
| **Livraisons** | ✅ | ✅ | ✅ | ✅ | ➖ | CRUD Complet |
| **Promotions** | ✅ | ✅ | ➖ | ➖ | ✅ | **CRUD + Stats** |
| **Avis** (MongoDB) | ✅ | ✅ | ➖ | ➖ | ✅ | **Read + Stats** |
| **Logs** (MongoDB) | ✅ | ✅ | ➖ | ➖ | ✅ | **Read + Stats** |

---

## 🎓 Avantages Pédagogiques

### Agrégations MongoDB

- ✅ Pipeline d'agrégation avec `$facet`
- ✅ Calculs statistiques avec `$avg`, `$sum`
- ✅ Filtrage temporel avec `$match`
- ✅ Regroupement avec `$group`
- ✅ Tri et limitation

### Agrégations PostgreSQL

- ✅ Fonctions d'agrégation avancées
- ✅ Comptage conditionnel : `COUNT(*) FILTER (WHERE ...)`
- ✅ Calculs de pourcentages
- ✅ Intervalles temporels
- ✅ Sous-requêtes corrélées
- ✅ Fonctions temporelles : `DATE_TRUNC`, `EXTRACT`

### Architecture Hybride

- ✅ Requêtes combinant PostgreSQL et MongoDB
- ✅ Démonstration des forces de chaque base :
  - **PostgreSQL** : Transactions, agrégations complexes, jointures
  - **MongoDB** : Flexibilité, documents riches, agrégations pipeline

---

## 📝 Notes Techniques

### Format des Réponses d'Erreur

```json
{
  "detail": "Message d'erreur descriptif"
}
```

### Codes de Statut HTTP

| Code | Signification |
|------|---------------|
| **200** | OK - Requête réussie |
| **201** | Created - Ressource créée |
| **204** | No Content - Opération réussie sans contenu |
| **404** | Not Found - Ressource introuvable |
| **422** | Unprocessable Entity - Erreur de validation |

### Authentification

⚠️ L'API n'implémente actuellement pas de système d'authentification.  
À implémenter pour la production (JWT, OAuth2, etc.)

---

## 🚀 Points Forts de l'Implémentation

1. **Agrégations avancées** : Utilisation de `$facet` pour exécuter plusieurs agrégations en parallèle
2. **Calculs de pourcentages** : Répartition par statut, mode, etc.
3. **Filtrage temporel** : Données du mois, 30 derniers jours, etc.
4. **Métriques business** : Taux de conversion, taux d'abandon, taux de réussite
5. **Performances** : Toutes les agrégations sont faites côté base de données
6. **Documentation complète** : Exemples, résultats attendus, techniques utilisées

---

## 📚 Documentation Complémentaire

- **[TESTS_CRUD.md](TESTS_CRUD.md)** : Exemples de tests pour tous les endpoints
- **[INITIALISATION.md](INITIALISATION.md)** : Guide Docker et troubleshooting
- **[RENDU.md](RENDU.md)** : Explications pédagogiques et architecture

---

**✨ API ShopEase - Documentation Complète**
