# Guide de Test des CRUDs - ShopEase

## ✅ Base de données peuplées avec succès

### 📊 Données disponibles

**PostgreSQL (Relationnel):**

- 5 clients, 6 adresses
- 9 catégories hiérarchiques
- 9 produits, 22 variantes
- 5 commandes complètes
- 4 promotions actives

**MongoDB (NoSQL):**

- 6 avis produits (structure enrichie avec dénormalisation)
- 15 logs d'activité (types variés: AUTH, CART, ORDER, etc.)

---

## 🧪 Tests des Endpoints API

### 1. **Produits** (PostgreSQL)

```bash
# Liste tous les produits
curl http://localhost:8000/api/produits

# Recherche par texte
curl "http://localhost:8000/api/produits?q=macbook"

# Filtrer par catégorie
curl "http://localhost:8000/api/produits?categorie_slug=informatique"

# Voir un produit spécifique
curl http://localhost:8000/api/produits/f1111111-1111-1111-1111-111111111111

# Voir les variantes d'un produit
curl http://localhost:8000/api/produits/f1111111-1111-1111-1111-111111111111/variantes
```

### 2. **Clients** (PostgreSQL)

```bash
# Liste des clients
curl http://localhost:8000/api/clients

# Un client spécifique
curl http://localhost:8000/api/clients/a1111111-1111-1111-1111-111111111111

# Créer un nouveau client
curl -X POST http://localhost:8000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean.dupont@example.com",
    "tel": "+33678901234",
    "pwd_hash": "$2b$12$test"
  }'

# Mettre à jour un client
curl -X PUT http://localhost:8000/api/clients/a1111111-1111-1111-1111-111111111111 \
  -H "Content-Type: application/json" \
  -d '{"tel": "+33699999999"}'

# Supprimer un client (attention: cascade sur adresses, commandes, etc.)
curl -X DELETE http://localhost:8000/api/clients/{id}
```

### 3. **Catégories** (PostgreSQL - Hiérarchique)

```bash
# Toutes les catégories
curl http://localhost:8000/api/categories

# Catégorie spécifique
curl http://localhost:8000/api/categories/c1111111-1111-1111-1111-111111111111

# Sous-catégories d'une catégorie
curl http://localhost:8000/api/categories/c1111111-1111-1111-1111-111111111111/enfants
```

### 4. **Paniers** (PostgreSQL)

```bash
# Voir un panier
curl http://localhost:8000/api/paniers/d1111111-1111-1111-1111-111111111111

# Ajouter au panier
curl -X POST http://localhost:8000/api/paniers/d1111111-1111-1111-1111-111111111111/items \
  -H "Content-Type: application/json" \
  -d '{
    "id_variante": "e3333333-3333-3333-3333-333333333333",
    "quantite": 1
  }'

# Modifier quantité
curl -X PUT http://localhost:8000/api/paniers/d1111111-1111-1111-1111-111111111111/items/e3333333-3333-3333-3333-333333333333 \
  -H "Content-Type: application/json" \
  -d '{"quantite": 3}'

# Supprimer du panier
curl -X DELETE http://localhost:8000/api/paniers/d1111111-1111-1111-1111-111111111111/items/e3333333-3333-3333-3333-333333333333
```

### 5. **Commandes** (PostgreSQL)

```bash
# Toutes les commandes
curl http://localhost:8000/api/commandes

# Commandes d'un client
curl http://localhost:8000/api/commandes?id_client=a1111111-1111-1111-1111-111111111111

# Une commande spécifique
curl http://localhost:8000/api/commandes/c1111111-1111-1111-1111-111111111111

# Créer une commande depuis un panier
curl -X POST http://localhost:8000/api/paniers/d1111111-1111-1111-1111-111111111111/valider \
  -H "Content-Type: application/json" \
  -d '{
    "id_adr_fact": "b1111111-1111-1111-1111-111111111111",
    "id_adr_livr": "b1111111-1111-1111-1111-111111111111"
  }'
```

### 6. **Avis** (MongoDB - Structure NoSQL enrichie)

```bash
# Tous les avis
curl http://localhost:8000/api/avis

# Avis d'un produit
curl http://localhost:8000/api/avis?id_produit=f1111111-1111-1111-1111-111111111111

# Créer un avis
curl -X POST http://localhost:8000/api/avis \
  -H "Content-Type: application/json" \
  -d '{
    "id_produit": "f3333333-3333-3333-3333-333333333333",
    "produit_info": {
      "nom": "Souris Logitech MX Master 3",
      "slug": "souris-logitech-mx-master-3",
      "categorie": {"id": "c1111111-1111-1111-1111-111111111113", "nom": "Accessoires"}
    },
    "auteur": {
      "id_client": "a5555555-5555-5555-5555-555555555555",
      "prenom": "Emma",
      "nom": "Leroy",
      "email_hash": "emma.l***@example.com",
      "acheteur_verifie": true
    },
    "note": 5,
    "titre": "Parfaite !",
    "commentaire": "Excellente souris pour le travail quotidien.",
    "avantages": ["Ergonomique", "Précise"],
    "inconvenients": [],
    "verifie": true
  }'
```

### 7. **Logs** (MongoDB - Structure flexible par type)

```bash
# Tous les logs
curl http://localhost:8000/api/logs

# Logs d'un client
curl http://localhost:8000/api/logs?id_client=a1111111-1111-1111-1111-111111111111

# Logs par type
curl "http://localhost:8000/api/logs?type=CART"
curl "http://localhost:8000/api/logs?type=AUTH"
curl "http://localhost:8000/api/logs?type=PAYMENT"

# Logger une action
curl -X POST http://localhost:8000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "type": "NAVIGATION",
    "action": "VIEW_PRODUCT",
    "timestamp": "2024-06-04T10:00:00Z",
    "client": {
      "id": "a1111111-1111-1111-1111-111111111111",
      "nom": "Sophie Martin"
    },
    "produit": {
      "id": "f3333333-3333-3333-3333-333333333333",
      "nom": "Souris Logitech MX Master 3"
    }
  }'
```

### 8. **Promotions** (PostgreSQL)

```bash
# Toutes les promotions
curl http://localhost:8000/api/promotions

# Promotions actives
curl "http://localhost:8000/api/promotions?actif=true"

# Produits en promotion
curl http://localhost:8000/api/promotions/91111111-1111-1111-1111-111111111111/produits
```

---

## 🎯 Points clés de la structure NoSQL

### **Collection AVIS** - Dénormalisation intelligente

```javascript
{
  // Données dénormalisées pour éviter les JOINs
  id_produit: "f1111111...",
  produit_info: {
    nom: "MacBook Pro 14\"",
    categorie: { id: "...", nom: "..." }
  },
  variante_achetee: {
    sku: "MBP14-512-SG",
    attributs: { couleur: "...", stockage: "..." }
  },
  
  // Données enrichies
  avantages: ["...", "..."],
  inconvenients: ["..."],
  reactions: {
    utile: 24,
    non_utile: 2,
    users_liked: ["a2222...", "a3333..."]
  },
  medias: [{ type: "image", url: "...", legende: "..." }],
  
  // Métadonnées techniques
  metadata: { ip: "...", user_agent: "..." }
}
```

### **Collection LOGS** - Structure flexible par type

Chaque type de log a sa propre structure adaptée :

```javascript
// Log AUTH
{
  type: "AUTH",
  action: "LOGIN",
  context: { ip, user_agent, browser, os, device },
  result: { success, method, session_id }
}

// Log CART
{
  type: "CART",
  action: "ADD_TO_CART",
  cart: { items_count_before, items_count_after, total_before, total_after },
  item: { variante_id, nom, quantite, prix_unitaire, attributs }
}

// Log PAYMENT
{
  type: "PAYMENT",
  action: "PAYMENT_SUCCESS",
  payment: { order_id, mode, provider, montant, transaction_id, card_info }
}
```

---

## 🔗 Interfaces Web

- **API**: <http://localhost:8000>
- **pgAdmin** (PostgreSQL): <http://localhost:8081>
  - Email: `admin@example.com`
  - Password: `admin`
- **mongo-express** (MongoDB): <http://localhost:8082>
  - Login: `admin`
  - Password: `pass`

---

## 📝 Notes importantes

1. **UUID corrigés**: Les ID utilisent uniquement des caractères hexadécimaux valides (0-9, a-f)
2. **Cohérence**: Les UUID sont identiques entre PostgreSQL et MongoDB pour les références croisées
3. **Données réalistes**: Produits Apple, Dell, Dyson, vêtements, etc.
4. **Scénarios complets**: Clients avec commandes passées et en cours
5. **Structure NoSQL**: Exploitation des avantages MongoDB (dénormalisation, flexibilité, documents riches)

---

Tous les CRUDs sont maintenant testables avec des données réalistes ! 🎉
