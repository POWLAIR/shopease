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

## 📊 Tests des Endpoints de Statistiques

### 1. **Stats Globales**

```bash
# Vue d'ensemble de toute la plateforme
curl http://localhost:3000/api/stats/global

# KPIs du tableau de bord
curl http://localhost:3000/api/stats/dashboard
```

**Résultat attendu (stats/global):**

```json
{
  "ventes": {
    "total_ventes": 7387.89,
    "total_commandes": 5,
    "commandes_validees": 4,
    "panier_moyen": 1477.58,
    "taux_conversion": 80.0
  },
  "clients": {
    "total_clients": 5
  },
  "catalogue": {
    "total_produits": 9,
    "total_variantes": 22,
    "total_stock": 232
  },
  "avis": {
    "total_avis": 6,
    "note_moyenne": 4.33
  }
}
```

---

### 2. **Stats Avis** (MongoDB Agrégations)

```bash
# Tous les avis
curl http://localhost:3000/api/avis

# Statistiques avec agrégations
curl http://localhost:3000/api/avis/stats
```

**Résultat attendu (avis/stats):**

```json
{
  "note_moyenne": 4.33,
  "total_avis": 6,
  "avis_ce_mois": 0,
  "repartition_notes": {
    "5_etoiles": 3,
    "4_etoiles": 2,
    "3_etoiles": 1,
    "2_etoiles": 0,
    "1_etoiles": 0
  }
}
```

**Agrégations MongoDB utilisées:**

- `$avg` : Calcul de la note moyenne
- `$match` : Filtrage par date (avis du mois)
- `$group` : Regroupement par note
- `$facet` : Exécution de plusieurs agrégations en parallèle

---

### 3. **Stats Logs** (MongoDB Agrégations)

```bash
# Tous les logs
curl http://localhost:3000/api/logs

# Statistiques d'activité
curl http://localhost:3000/api/logs/stats
```

**Résultat attendu (logs/stats):**

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
    },
    {
      "type": "CART",
      "count": 4,
      "pourcentage": 26.67
    }
  ]
}
```

**Agrégations MongoDB utilisées:**

- `$count` : Comptage total
- `$group` : Regroupement par action/type
- `$sort` : Tri par fréquence
- `$limit` : Limitation des résultats

---

### 4. **Stats Promotions** (PostgreSQL)

```bash
# Statistiques sur les promotions
curl http://localhost:3000/api/promotions/stats
```

**Résultat attendu:**

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

**Techniques SQL utilisées:**

- `COUNT(*) FILTER (WHERE ...)` : Comptage conditionnel
- `AVG(CASE WHEN ... THEN ... END)` : Moyenne conditionnelle
- Filtrage temporel avec `NOW()`

---

### 5. **Stats Paiements** (PostgreSQL)

```bash
# Statistiques détaillées sur les paiements
curl http://localhost:3000/api/paiements/stats
```

**Résultat attendu:**

```json
{
  "montant_total": 7387.89,
  "montant_moyen": 1477.58,
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
    },
    {
      "statut": "CREATED",
      "count": 1,
      "pourcentage": 20.0
    }
  ]
}
```

**Techniques SQL utilisées:**

- `SUM()`, `AVG()` : Agrégations
- `COUNT(*) FILTER (WHERE ...)` : Comptages par statut
- `GROUP BY` + calcul de pourcentage

---

### 6. **Stats Commandes** (PostgreSQL)

```bash
# Statistiques complètes sur les commandes
curl http://localhost:3000/api/commandes/stats
```

**Résultat attendu:**

```json
{
  "total_commandes": 5,
  "nombre_validees": 4,
  "nombre_en_attente": 1,
  "nombre_annulees": 0,
  "montant_total": 7387.89,
  "montant_moyen": 1477.58,
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
    },
    {
      "statut": "EN_ATTENTE_PAIEMENT",
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

**Techniques SQL utilisées:**

- Agrégations multiples avec `COUNT()`, `SUM()`, `AVG()`
- `DATE()` : Extraction de la date
- `INTERVAL` : Filtrage temporel (30 derniers jours)
- `GROUP BY DATE()` : Regroupement par jour

---

### 7. **Stats Paniers** (PostgreSQL)

```bash
# Analyse des paniers (taux d'abandon, montant moyen)
curl http://localhost:3000/api/paniers/stats
```

**Résultat attendu:**

```json
{
  "total_paniers": 3,
  "paniers_abandonnes": 0,
  "paniers_actifs": 3,
  "taux_abandon": 0.0,
  "montant_moyen": 245.83,
  "details_paniers_abandonnes": []
}
```

**Critère d'abandon:** Panier non modifié depuis plus de 7 jours

**Techniques SQL utilisées:**

- `LEFT JOIN` avec sous-requête pour calcul des montants
- `EXTRACT(DAY FROM ...)` : Calcul de différence en jours
- `INTERVAL '7 days'` : Critère d'abandon

---

### 8. **Stats Clients** (PostgreSQL)

```bash
# Statistiques sur les clients
curl http://localhost:3000/api/clients/stats
```

**Résultat attendu:**

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

**Techniques SQL utilisées:**

- `DATE_TRUNC('month', NOW())` : Début du mois courant
- Sous-requête pour calcul du nombre moyen d'adresses
- `ORDER BY` multiple pour classement

---

## 🎯 Test Complet en Une Commande

```bash
# Tester tous les endpoints de statistiques d'un coup
echo "=== STATS GLOBALES ===" && \
curl -s http://localhost:3000/api/stats/global | jq '.ventes' && \
echo "\n=== STATS AVIS ===" && \
curl -s http://localhost:3000/api/avis/stats | jq '.note_moyenne, .total_avis' && \
echo "\n=== STATS LOGS ===" && \
curl -s http://localhost:3000/api/logs/stats | jq '.total_logs' && \
echo "\n=== STATS COMMANDES ===" && \
curl -s http://localhost:3000/api/commandes/stats | jq '.total_commandes, .montant_total' && \
echo "\n=== STATS PAIEMENTS ===" && \
curl -s http://localhost:3000/api/paiements/stats | jq '.taux_reussite' && \
echo "\n=== STATS PANIERS ===" && \
curl -s http://localhost:3000/api/paniers/stats | jq '.taux_abandon' && \
echo "\n=== STATS CLIENTS ===" && \
curl -s http://localhost:3000/api/clients/stats | jq '.total_clients'
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
