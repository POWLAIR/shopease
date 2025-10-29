# Documentation des Endpoints API - ShopEase

## 📋 Table des matières

- [Health Check](#health-check)
- [Produits](#produits)
- [Catégories](#catégories)
- [Clients](#clients)
- [Adresses](#adresses)
- [Paniers](#paniers)
- [Commandes](#commandes)
- [Paiements](#paiements)
- [Livraisons](#livraisons)
- [Promotions](#promotions)
- [Avis](#avis)
- [Logs](#logs)

---

## Health Check

### GET `/api/health`

Vérifie l'état de santé de l'API et des connexions aux bases de données.

**Réponse:**

```json
{
  "status": "ok",
  "postgres": true,
  "mongo": true
}
```

---

## Produits

### GET `/api/produits`

Liste tous les produits avec filtres optionnels.

**Query Parameters:**

- `q` (optional): Recherche textuelle sur nom et description
- `categorie_slug` (optional): Filtrer par slug de catégorie

**Réponse:** Liste de produits avec leurs catégories

### POST `/api/produits`

Créer un nouveau produit.

**Body:**

```json
{
  "id_categorie": "uuid",
  "nom": "string",
  "slug": "string",
  "description": "string",
  "tva": 20.0,
  "actif": true
}
```

**Status:** `201 Created`

### PUT `/api/produits/{id}`

Mettre à jour un produit existant.

**Path Parameters:**

- `id`: UUID du produit

**Body:** Même structure que POST (tous champs optionnels)

**Réponse:** Produit mis à jour

### DELETE `/api/produits/{id}`

Supprimer un produit.

**Path Parameters:**

- `id`: UUID du produit

**Status:** `204 No Content`

---

## Variantes de Produits

### GET `/api/produits/{id}/variantes`

Liste toutes les variantes d'un produit avec leur stock.

**Path Parameters:**

- `id`: UUID du produit

**Réponse:** Liste de variantes avec informations de stock

### POST `/api/produits/{id}/variantes`

Créer une variante pour un produit.

**Path Parameters:**

- `id`: UUID du produit

**Body:**

```json
{
  "sku": "string",
  "ean": "string",
  "prix_ht": 99.99,
  "poids_g": 500,
}
```

**Status:** `201 Created`

### PUT `/api/produits/variantes/{variante_id}`

Mettre à jour une variante.

**Path Parameters:**

- `variante_id`: UUID de la variante

**Body:** Même structure que POST (tous champs optionnels)

### PATCH `/api/produits/variantes/{variante_id}/stock`

Mettre à jour le stock d'une variante.

**Path Parameters:**

- `variante_id`: UUID de la variante

**Body:**

```json
{
  "quantite": 100,
  "reservee": 5,
  "seuil_alerte": 10
}
```

---

## Catégories

### GET `/api/categories`

Liste toutes les catégories.

**Réponse:** Liste de catégories triées par libellé

### POST `/api/categories`

Créer une nouvelle catégorie.

**Body:**

```json
{
  "libelle": "string",
  "slug": "string",
  "parent_id": "uuid" // optionnel
}
```

**Status:** `201 Created`

### PUT `/api/categories/{id}`

Mettre à jour une catégorie.

**Path Parameters:**

- `id`: UUID de la catégorie

**Body:** Même structure que POST (tous champs optionnels)

### DELETE `/api/categories/{id}`

Supprimer une catégorie.

**Path Parameters:**

- `id`: UUID de la catégorie

**Status:** `204 No Content`

---

## Clients

### GET `/api/clients`

Liste tous les clients (sans mot de passe).

**Réponse:** Liste de clients triés par date de création

### POST `/api/clients`

Créer un nouveau client.

**Body:**

```json
{
  "prenom": "string",
  "nom": "string",
  "email": "email@example.com",
  "tel": "0612345678",
  "pwd_hash": "hashed_password"
}
```

**Status:** `201 Created`

### PUT `/api/clients/{id}`

Mettre à jour un client.

**Path Parameters:**

- `id`: UUID du client

**Body:** Même structure que POST (tous champs optionnels)

### DELETE `/api/clients/{id}`

Supprimer un client.

**Path Parameters:**

- `id`: UUID du client

**Status:** `204 No Content`

---

## Adresses

### GET `/api/adresses/client/{id_client}`

Liste toutes les adresses d'un client.

**Path Parameters:**

- `id_client`: UUID du client

**Réponse:** Liste d'adresses triées par libellé

### POST `/api/adresses`

Créer une nouvelle adresse.

**Body:**

```json
{
  "id_client": "uuid",
  "libelle": "Domicile",
  "ligne1": "123 Rue Example",
  "ligne2": "Appartement 4B",
  "code_postal": "75001",
  "ville": "Paris",
  "pays": "France",
  "is_default_billing": false,
  "is_default_shipping": false
}
```

**Status:** `201 Created`

### PUT `/api/adresses/{id}`

Mettre à jour une adresse.

**Path Parameters:**

- `id`: UUID de l'adresse

**Body:** Même structure que POST (tous champs optionnels)

### DELETE `/api/adresses/{id}`

Supprimer une adresse.

**Path Parameters:**

- `id`: UUID de l'adresse

**Status:** `204 No Content`

---

## Paniers

### GET `/api/paniers`

Récupérer tout les paniers

### GET `/api/paniers/{id}`

Récupérer un panier par son ID.

**Path Parameters:**

- `id`: UUID du panier

**Réponse:** Détails du panier

### POST `/api/paniers`

Créer un nouveau panier.

**Body:**

```json
{
  "token": "string",
  "id_client": "uuid" // optionnel
}
```

**Status:** `201 Created`

### PUT `/api/paniers/{id}`

Mettre à jour un panier.

**Path Parameters:**

- `id`: UUID du panier

**Body:** Même structure que POST (tous champs optionnels)

### DELETE `/api/paniers/{id}`

Supprimer un panier.

**Path Parameters:**

- `id`: UUID du panier

**Status:** `204 No Content`

---

## Lignes de Panier

### GET `/api/paniers/{id}/lignes`

Liste toutes les lignes d'un panier avec les informations produit.

**Path Parameters:**

- `id`: UUID du panier

**Réponse:** Liste de lignes avec SKU, prix et stock disponible

### POST `/api/paniers/{id}/lignes`

Ajouter ou mettre à jour une ligne dans le panier.

**Path Parameters:**

- `id`: UUID du panier

**Body:**

```json
{
  "id_variante": "uuid",
  "quantite": 2
}
```

**Note:** Si la variante existe déjà, la quantité est incrémentée.

**Status:** `201 Created`

### PUT `/api/paniers/{id}/lignes/{variante_id}`

Mettre à jour la quantité d'une ligne de panier.

**Path Parameters:**

- `id`: UUID du panier
- `variante_id`: UUID de la variante

**Body:**

```json
{
  "quantite": 3
}
```

### DELETE `/api/paniers/{id}/lignes/{variante_id}`

Supprimer une ligne du panier.

**Path Parameters:**

- `id`: UUID du panier
- `variante_id`: UUID de la variante

**Status:** `204 No Content`

---

## Commandes

### GET `/api/commandes`

Liste toutes les commandes avec informations client.

**Réponse:** Liste de commandes triées par date de création (DESC)

### GET `/api/commandes/{id}`

Récupérer une commande spécifique.

**Path Parameters:**

- `id`: UUID de la commande

**Réponse:** Détails de la commande avec nom du client

### POST `/api/commandes`

Créer une nouvelle commande.

**Body:**

```json
{
  "ref": "CMD-2025-001",
  "id_client": "uuid",
  "id_adr_fact": "uuid",
  "id_adr_livr": "uuid",
  "total_ht": 100.00,
  "total_tva": 20.00,
  "total_ttc": 120.00,
  "lignes": [
    {
      "id_variante": "uuid",
      "libelle": "Produit X - Taille M",
      "quantite": 2,
      "prix_unitaire_ht": 50.00,
      "tva": 20.00
    }
  ]
}
```

**Note:** Décrémente automatiquement le stock pour chaque variante commandée.

**Status:** `201 Created`

### PUT `/api/commandes/{id}`

Mettre à jour une commande (statut, adresses).

**Path Parameters:**

- `id`: UUID de la commande

**Body:**

```json
{
  "statut": "VALIDEE",
  "id_adr_fact": "uuid",
  "id_adr_livr": "uuid"
}
```

**Note:** Tous les champs sont optionnels.

### DELETE `/api/commandes/{id}`

Supprimer une commande.

**Path Parameters:**

- `id`: UUID de la commande

**Status:** `204 No Content`

---

## Paiements

### GET `/api/paiements/{id}`

Récupérer un paiement par son ID.

**Path Parameters:**

- `id`: UUID du paiement

**Réponse:** Détails du paiement

### GET `/api/paiements/commande/{id_commande}`

Liste tous les paiements associés à une commande.

**Path Parameters:**

- `id_commande`: UUID de la commande

**Réponse:** Liste de paiements triés par date de création (DESC)

### POST `/api/paiements`

Créer un nouveau paiement.

**Body:**

```json
{
  "id_commande": "uuid",
  "mode": "CB",
  "montant": 120.00,
  "statut": "CREATED",
  "transaction_id": "TXN_12345"
}
```

**Status:** `201 Created`

### PUT `/api/paiements/{id}`

Mettre à jour un paiement (généralement le statut).

**Path Parameters:**

- `id`: UUID du paiement

**Body:**

```json
{
  "statut": "SUCCESS",
  "transaction_id": "TXN_12345_CONFIRMED"
}
```

**Note:** Tous les champs sont optionnels.

### DELETE `/api/paiements/{id}`

Supprimer un paiement.

**Path Parameters:**

- `id`: UUID du paiement

**Status:** `204 No Content`

---

## Livraisons

### GET `/api/livraisons/{id}`

Récupérer une livraison par son ID.

**Path Parameters:**

- `id`: UUID de la livraison

**Réponse:** Détails de la livraison

### GET `/api/livraisons/commande/{id_commande}`

Récupérer la livraison associée à une commande.

**Path Parameters:**

- `id_commande`: UUID de la commande

**Réponse:** Livraison ou null si non trouvée

### POST `/api/livraisons`

Créer une nouvelle livraison.

**Body:**

```json
{
  "id_commande": "uuid",
  "transporteur": "Colissimo",
  "num_suivi": "1234567890",
  "statut": "EN_PREPARATION",
  "cout_ht": 5.50
}
```

**Status:** `201 Created`

### PUT `/api/livraisons/{id}`

Mettre à jour une livraison (statut, numéro de suivi).

**Path Parameters:**

- `id`: UUID de la livraison

**Body:**

```json
{
  "transporteur": "Colissimo",
  "num_suivi": "1234567890",
  "statut": "EXPEDIE",
  "cout_ht": 5.50
}
```

**Note:** Tous les champs sont optionnels.

### DELETE `/api/livraisons/{id}`

Supprimer une livraison.

**Path Parameters:**

- `id`: UUID de la livraison

**Status:** `204 No Content`

---

## Promotions

### GET `/api/promotions`

Liste toutes les promotions actives.

**Réponse:** Liste de promotions actives triées par date de début (DESC)

### POST `/api/promotions`

Créer une nouvelle promotion.

**Body:**

```json
{
  "libelle": "Soldes d'été",
  "type": "PERCENTAGE",
  "valeur": 20.0,
  "date_debut": "2025-07-01",
  "date_fin": "2025-07-31",
  "actif": true
}
```

**Status:** `201 Created`

### POST `/api/promotions/attach`

Attacher une promotion à un produit.

**Body:**

```json
{
  "id_produit": "uuid",
  "id_promo": "uuid"
}
```

**Status:** `204 No Content`

---

## Avis (MongoDB)

### GET `/api/avis/{id_produit}`

Liste tous les avis pour un produit.

**Path Parameters:**

- `id_produit`: ID du produit

**Réponse:** Liste d'avis triés par date (DESC)

**Exemple de réponse:**

```json
[
  {
    "_id": "ObjectId",
    "id_produit": 123,
    "auteur": {
      "nom": "Jean Dupont",
      "email": "jean@example.com"
    },
    "note": 5,
    "commentaire": "Excellent produit !",
    "date": "2025-10-29T12:00:00Z"
  }
]
```

### POST `/api/avis`

Créer un nouvel avis.

**Body:**

```json
{
  "id_produit": 123,
  "auteur": {
    "nom": "Jean Dupont",
    "email": "jean@example.com"
  },
  "note": 5,
  "commentaire": "Excellent produit !"
}
```

**Status:** `201 Created`

---

## Logs (MongoDB)

### GET `/api/logs/{id_client}`

Récupère les logs d'activité d'un client.

**Path Parameters:**

- `id_client`: ID du client

**Réponse:** Liste des 200 derniers logs triés par timestamp (DESC)

**Exemple de réponse:**

```json
[
  {
    "_id": "ObjectId",
    "id_client": 123,
    "action": "view_product",
    "id_produit": 456,
    "timestamp": "2025-10-29T12:00:00Z"
  }
]
```

### POST `/api/logs`

Créer un nouveau log d'activité.

**Body:**

```json
{
  "id_client": 123,
  "action": "view_product",
  "id_produit": 456
}
```

**Status:** `201 Created`

---

## État du CRUD par Entité

| Entité | Create | Read | Update | Delete | Statut |
|--------|--------|------|--------|--------|--------|
| **Produits** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Variantes** | ✅ | ✅ | ✅ | ❌ | CRUD partiel |
| **Stock** | ✅ | ✅ | ✅ (PATCH) | ❌ | CRUD partiel |
| **Catégories** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Clients** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Adresses** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Paniers** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Lignes Panier** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Commandes** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Paiements** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Livraisons** | ✅ | ✅ | ✅ | ✅ | **CRUD Complet** |
| **Promotions** | ✅ | ✅ | ❌ | ❌ | CRUD partiel |
| **Avis** | ✅ | ✅ | ❌ | ❌ | CRUD partiel (MongoDB) |
| **Logs** | ✅ | ✅ | ❌ | ❌ | CRUD partiel (MongoDB) |

---

## Notes Techniques

### Format des Réponses d'Erreur

```json
{
  "detail": "Message d'erreur descriptif"
}
```

### Codes de Statut Courants

- `200 OK`: Requête réussie
- `201 Created`: Ressource créée avec succès
- `204 No Content`: Opération réussie sans contenu de retour
- `404 Not Found`: Ressource introuvable
- `422 Unprocessable Entity`: Erreur de validation

### Authentification

⚠️ L'API n'implémente actuellement pas de système d'authentification. À implémenter pour la production.

### Base URL

Développement : `http://localhost:8000`

---
