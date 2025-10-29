# 🛒 ShopEase - E-commerce Hybride

> Application e-commerce moderne utilisant PostgreSQL (relationnel) et MongoDB (NoSQL)

[![Docker](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](https://www.docker.com/)
[![Python](https://img.shields.io/badge/Python-3.12-green?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-teal?logo=fastapi)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-green?logo=mongodb)](https://www.mongodb.com/)

---

## 📋 Table des matières

- [🎯 Présentation](#-présentation)
- [🏗️ Architecture](#️-architecture)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [🔗 Accès aux services](#-accès-aux-services)
- [📚 Documentation](#-documentation)
- [🛠️ Composition Docker](#️-composition-docker)
- [🗄️ Bases de données](#️-bases-de-données)
- [⚙️ Configuration](#️-configuration)
- [🧪 Tests](#-tests)

---

## 🎯 Présentation

ShopEase est une plateforme e-commerce hybride démontrant l'utilisation combinée de :

- **PostgreSQL** pour les données transactionnelles (produits, commandes, clients)
- **MongoDB** pour les données flexibles (avis, logs d'activité)

### Fonctionnalités principales

✅ **Gestion complète du catalogue**

- Catégories hiérarchiques
- Produits avec variantes (couleur, taille, stockage)
- Gestion des stocks en temps réel

✅ **Parcours client complet**

- Inscription et profil
- Panier et gestion des adresses
- Commandes et paiements
- Suivi de livraison

✅ **Fonctionnalités avancées**

- Système de promotions
- Avis clients avec réactions
- Logs d'activité détaillés
- Recherche et filtrage

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   CLIENT                        │
│              (Browser / Mobile)                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│           FastAPI REST API (Python)             │
│              Port 3000 (uvicorn)                │
└────────────┬─────────────────┬──────────────────┘
             │                 │
      ┌──────▼──────┐   ┌──────▼──────┐
      │ PostgreSQL  │   │   MongoDB   │
      │   (Port     │   │   (Port     │
      │    5432)    │   │    27017)   │
      └─────────────┘   └─────────────┘
      Relationnel       Non-relationnel
```

### Technologies utilisées

| Composant | Technologie | Version | Rôle |
|-----------|-------------|---------|------|
| **API** | FastAPI | 0.115 | API REST avec validation Pydantic |
| **Serveur** | Uvicorn | 0.32 | Serveur ASGI haute performance |
| **BDD Relationnelle** | PostgreSQL | 16 | Données transactionnelles |
| **BDD NoSQL** | MongoDB | 7 | Données flexibles (avis, logs) |
| **Interface PG** | pgAdmin | 4.8 | Administration PostgreSQL |
| **Interface Mongo** | mongo-express | 1.0 | Administration MongoDB |

---

## 🚀 Démarrage rapide

### Prérequis

- [Docker](https://docs.docker.com/get-docker/) (version 20+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2+)
- (Optionnel) curl ou Postman pour tester l'API

### Installation avec données de test

#### 1. Configurer l'environnement

```bash
# Copier le fichier d'environnement
cp .env.example .env
```

#### 2. Lancer avec les données (première fois)

```bash
# Supprimer les volumes si existants
docker-compose down -v

# Construire et démarrer
docker-compose up --build -d
```

**✨ Les bases de données sont automatiquement peuplées !**

Les scripts dans `postgres/init/` et `mongo/init/` s'exécutent automatiquement lors de la première initialisation.

#### 3. Vérifier que tout fonctionne

```bash
# Vérifier l'état des services
docker-compose ps
```

**Résultat attendu :**

```
NAME                    STATUS              PORTS
shopease_api            Up (healthy)        0.0.0.0:8000->3000/tcp
shopease_postgres       Up (healthy)        0.0.0.0:5432->5432/tcp
shopease_mongo          Up (healthy)        0.0.0.0:27017->27017/tcp
shopease-pgadmin-1      Up                  0.0.0.0:8081->80/tcp
shopease-mongo-express-1 Up                 0.0.0.0:8082->8081/tcp
```

#### 3. Tester l'API

```bash
# Vérifier la santé de l'API
curl http://localhost:8000/api/health

# Résultat attendu:
# {"status":"ok","postgres":true,"mongo":true}

# Voir les produits
curl http://localhost:8000/api/produits
```

✅ **C'est prêt !** Les bases de données sont automatiquement peuplées avec des données de test.

---

## 🔗 Accès aux services

| Service | URL | Identifiants | Description |
|---------|-----|--------------|-------------|
| **API REST** | <http://localhost:8000> | - | API principale FastAPI |
| **Documentation API** | <http://localhost:8000/docs> | - | Swagger UI interactif |
| **pgAdmin** | <http://localhost:8081> | `admin@example.com` / `admin` | Interface PostgreSQL |
| **mongo-express** | <http://localhost:8082> | `admin` / `pass` | Interface MongoDB |

### Connexion aux bases de données

#### PostgreSQL

```bash
# Via Docker
docker exec -it shopease_postgres psql -U admin -d shopease

# Depuis l'hôte
psql -h localhost -p 5432 -U admin -d shopease
# Password: admin
```

#### MongoDB

```bash
# Via Docker
docker exec -it shopease_mongo mongosh shopease

# Depuis l'hôte  
mongosh "mongodb://localhost:27017/shopease"
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| 📖 [**INITIALISATION.md**](docs/INITIALISATION.md) | Guide complet Docker : démarrage, réinitialisation, troubleshooting |
| 🧪 [**TESTS_CRUD.md**](docs/TESTS_CRUD.md) | Exemples de tests pour tous les endpoints (curl, données) |
| 🔌 [**ENDPOINTS.md**](docs/ENDPOINTS.md) | Documentation complète de l'API REST (tous les endpoints) |
| 📝 [**RENDU.md**](docs/RENDU.md) | Document pédagogique : architecture, Merise, choix techniques |

### Navigation rapide

```
README.md (vous êtes ici) ─┐
                            │
                            ├──> docs/INITIALISATION.md  (Comment démarrer ?)
                            │
                            ├──> docs/TESTS_CRUD.md      (Comment tester ?)
                            │
                            ├──> docs/ENDPOINTS.md       (Liste complète des endpoints)
                            │
                            └──> docs/RENDU.md           (Explications pédagogiques)
```

---

## 🛠️ Composition Docker

### Services déployés

Le fichier `docker-compose.yml` orchestre 5 conteneurs :

#### 1. **API (shopease_api)**

- **Image** : Custom (build from `./api`)
- **Port** : 3000
- **Rôle** : API REST FastAPI
- **Dépendances** : PostgreSQL, MongoDB (avec healthcheck)

#### 2. **PostgreSQL (shopease_postgres)**

- **Image** : postgres:16
- **Port** : 5432
- **Volumes** :
  - `./postgres/init:/docker-entrypoint-initdb.d` (scripts d'initialisation)
  - `./postgres/data:/var/lib/postgresql/data` (données persistées)
- **Healthcheck** : Vérifie la disponibilité toutes les 5s

#### 3. **MongoDB (shopease_mongo)**

- **Image** : mongo:7
- **Port** : 27017
- **Command** : `--bind_ip_all` (accepte connexions réseau)
- **Volumes** :
  - `./mongo/init:/docker-entrypoint-initdb.d` (scripts d'initialisation)
  - `./mongo/data:/data/db` (données persistées)
- **Healthcheck** : Vérifie avec `mongosh`

#### 4. **pgAdmin (shopease-pgadmin-1)**

- **Image** : dpage/pgadmin4:8
- **Port** : 8081
- **Rôle** : Interface web PostgreSQL

#### 5. **mongo-express (shopease-mongo-express-1)**

- **Image** : mongo-express:latest
- **Port** : 8082
- **Rôle** : Interface web MongoDB

### Réseau

Tous les services communiquent via le réseau Docker `shopease_backend` (bridge).

### Commandes utiles

```bash
# Voir les logs
docker-compose logs -f [service]

# Redémarrer un service
docker-compose restart [service]

# Arrêter tout
docker-compose down

# Arrêter et supprimer les volumes (RÉINITIALISATION)
docker-compose down -v

# Reconstruire l'API après modifications
docker-compose build api
docker-compose up -d api
```

---

## 🗄️ Bases de données

### PostgreSQL - Données relationnelles

**Tables principales** (voir [schema.sql](postgres/init/01_schema.sql)) :

| Table | Description | Nb enregistrements |
|-------|-------------|-------------------|
| `client` | Utilisateurs | 5 |
| `adresse` | Adresses de livraison/facturation | 6 |
| `categorie` | Catégories hiérarchiques | 9 |
| `produit` | Produits | 9 |
| `variante` | Variantes (couleur, taille...) | 22 |
| `stock` | Gestion des stocks | 22 |
| `panier` | Paniers actifs | 3 |
| `commande` | Commandes | 5 |
| `paiement` | Paiements | 5 |
| `livraison` | Livraisons | 4 |
| `promotion` | Promotions | 4 |

**Caractéristiques techniques** :

- UUID pour tous les identifiants
- JSONB pour attributs de variantes
- ENUMs pour les statuts
- Index optimisés (GIN, composites)
- Contraintes d'intégrité référentielle

### MongoDB - Données NoSQL

**Collections** (voir [99_seed.js](mongo/init/99_seed.js)) :

| Collection | Description | Nb documents | Structure |
|------------|-------------|--------------|-----------|
| `avis` | Avis produits | 6 | Enrichie (dénormalisée) |
| `logs` | Logs d'activité | 15 | Flexible par type |

**Avantages de la structure NoSQL** :

- ✅ Dénormalisation (infos produit dans les avis)
- ✅ Documents riches (avantages, médias, réactions)
- ✅ Structure flexible par type de log
- ✅ Pas de JOINs nécessaires
- ✅ Évolution du schéma facile

---

## ⚙️ Configuration

### Variables d'environnement (.env)

```bash
# API
API_PORT=3000
NODE_ENV=development

# PostgreSQL
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=shopease
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin

# MongoDB
MONGO_URI=mongodb://mongo:27017
MONGO_DB=shopease

# Outils d'admin
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin
```

### Personnalisation

Pour modifier les ports ou identifiants :

1. Éditer `.env`
2. Relancer : `docker-compose down && docker-compose up -d`

---

## 🧪 Tests

### Tests manuels de l'API

Voir [docs/TESTS_CRUD.md](docs/TESTS_CRUD.md) pour des exemples détaillés.

**Tests rapides** :

```bash
# Santé de l'API
curl http://localhost:8000/api/health

# Liste des produits
curl http://localhost:8000/api/produits

# Recherche
curl "http://localhost:8000/api/produits?q=macbook"

# Avis (MongoDB)
curl http://localhost:8000/api/avis

# Logs (MongoDB)
curl http://localhost:8000/api/logs
```

### Vérification des données

```bash
# PostgreSQL
docker exec shopease_postgres psql -U admin -d shopease -c "
  SELECT COUNT(*) as total FROM client;
"

# MongoDB
docker exec shopease_mongo mongosh shopease --quiet --eval "
  print('Avis: ' + db.avis.countDocuments());
  print('Logs: ' + db.logs.countDocuments());
"
```

---

## 🏆 Projet pédagogique

Ce projet a été réalisé dans le cadre du cours **"Bases de Données Relationnelles et Non Relationnelles"** pour démontrer :

✅ Maîtrise de la méthode **Merise** (MCD/MLD/MPD)  
✅ Conception d'un schéma **PostgreSQL** complexe  
✅ Utilisation de **MongoDB** pour données flexibles  
✅ Architecture **hybride** relationnel + NoSQL  
✅ API REST avec **FastAPI**  
✅ **Dockerisation** complète  

Pour plus de détails techniques, voir [docs/RENDU.md](docs/RENDU.md).

---

## 📞 Support

- **Documentation** : Consultez les fichiers dans `docs/`
- **Problèmes Docker** : Voir [INITIALISATION.md](docs/INITIALISATION.md#-résolution-de-problèmes)
- **Tests API** : Voir [TESTS_CRUD.md](docs/TESTS_CRUD.md)

---

## 📄 Licence

Projet pédagogique - EFREI Paris

---

**Bon développement ! 🚀**
