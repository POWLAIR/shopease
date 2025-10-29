# 🚀 Initialisation Automatique des Bases de Données

## ⚠️ IMPORTANT : Comportement de l'initialisation

### 📋 Comment ça fonctionne

Les images Docker **PostgreSQL** et **MongoDB** exécutent automatiquement les scripts dans `/docker-entrypoint-initdb.d/` **UNIQUEMENT lors de la première initialisation** (quand la base de données n'existe pas encore).

```yaml
# docker-compose.yml
volumes:
  - ./postgres/init:/docker-entrypoint-initdb.d  # Scripts d'init
  - ./postgres/data:/var/lib/postgresql/data     # Données persistées
```

### ✅ Première initialisation (base vide)

Lors du **premier démarrage** ou après suppression des volumes :

```bash
docker-compose up -d
```

Les scripts s'exécutent dans l'ordre :

1. `01_schema.sql` - Création des tables
2. `02_indexes.sql` - Création des index
3. `99_seed.sql` - Insertion des données

**Résultat** : Base de données créée et peuplée automatiquement ✅

### ❌ Redémarrages suivants (base existante)

Si la base de données existe déjà dans `./postgres/data/` ou `./mongo/data/` :

```bash
docker-compose restart
docker-compose down && docker-compose up -d
```

**Les scripts ne se réexécutent PAS** car PostgreSQL/MongoDB détectent que la base existe déjà.

**Message dans les logs** :

```
PostgreSQL Database directory appears to contain a database; Skipping initialization
```

---

## 🔄 Comment réinitialiser complètement

### Option 1 : Supprimer les volumes Docker (RECOMMANDÉ)

```bash
# Arrêter et supprimer tous les volumes
docker-compose down -v

# Redémarrer (réinitialisation complète)
docker-compose up -d
```

**Avantage** : Propre et automatique, pas besoin de sudo
**Note** : `-v` supprime tous les volumes Docker gérés

### Option 2 : Supprimer manuellement les dossiers (SI NÉCESSAIRE)

Si les données sont dans des volumes bindés locaux et que `-v` ne suffit pas :

```bash
# Arrêter les conteneurs
docker-compose down

# Supprimer les données (ATTENTION: DESTRUCTIF!)
sudo rm -rf postgres/data/* mongo/data/*

# Redémarrer
docker-compose up -d
```

**⚠️ ATTENTION** : Cela supprime TOUTES les données !

### Option 3 : Exécution manuelle (sans réinitialisation)

Si vous voulez juste recharger les données sans tout supprimer :

```bash
# PostgreSQL
docker exec shopease_postgres psql -U admin -d shopease -f /docker-entrypoint-initdb.d/99_seed.sql

# MongoDB
docker exec shopease_mongo mongosh shopease /docker-entrypoint-initdb.d/99_seed.js
```

**Note** : Peut causer des erreurs de clés dupliquées si les données existent déjà

---

## 📊 Vérifier l'état d'initialisation

### PostgreSQL

```bash
# Compter les enregistrements
docker exec shopease_postgres psql -U admin -d shopease -c "
  SELECT 
    (SELECT COUNT(*) FROM client) as clients,
    (SELECT COUNT(*) FROM produit) as produits,
    (SELECT COUNT(*) FROM commande) as commandes;
"

# Résultat attendu: clients=5, produits=9, commandes=5
```

### MongoDB

```bash
# Compter les documents
docker exec shopease_mongo mongosh shopease --quiet --eval "
  print('Avis: ' + db.avis.countDocuments());
  print('Logs: ' + db.logs.countDocuments());
"

# Résultat attendu: Avis=6, Logs=15
```

### Logs d'initialisation

```bash
# Voir les logs PostgreSQL
docker-compose logs postgres | grep -E "init|seed|CREATE|INSERT"

# Voir les logs MongoDB
docker-compose logs mongo | grep -E "init|seed|inserted"
```

---

## 🎯 Workflow recommandé

### Pour le développement

```bash
# 1. Première initialisation
docker-compose up -d

# 2. Développement, tests, modifications...

# 3. Réinitialisation complète si besoin
docker-compose down -v
docker-compose up -d
```

### Pour la production / démo

```bash
# 1. Initialiser une fois
docker-compose up -d

# 2. Ne PAS supprimer les volumes !
# Les données persistent entre les redémarrages

# 3. Pour restart sans perte de données
docker-compose restart
# ou
docker-compose down && docker-compose up -d
```

---

## 🐛 Résolution de problèmes

### Problème : "Base de données vide après docker-compose up"

**Cause** : Les volumes existaient déjà, les scripts ne se sont pas exécutés

**Solution** :

```bash
docker-compose down -v
docker-compose up -d
```

### Problème : "ERROR: duplicate key value violates unique constraint"

**Cause** : Tentative de réinsérer des données existantes

**Solution 1** : Supprimer et réinitialiser

```bash
docker-compose down -v
docker-compose up -d
```

**Solution 2** : Truncate les tables manuellement

```bash
docker exec shopease_postgres psql -U admin -d shopease -c "TRUNCATE client CASCADE;"
```

### Problème : "Cannot access 'db' before initialization" (MongoDB)

**Cause** : Erreur de syntaxe dans le script JavaScript

**Solution** : Vérifier `mongo/init/01_init.js` et `99_seed.js` (déjà corrigé)

---

## 📝 Checklist d'initialisation

- [ ] `docker-compose down -v` pour nettoyer
- [ ] `docker-compose up -d` pour initialiser
- [ ] Attendre 15-20 secondes que les healthchecks passent
- [ ] Vérifier PostgreSQL : `docker exec shopease_postgres psql -U admin -d shopease -c "SELECT COUNT(*) FROM client;"`
- [ ] Vérifier MongoDB : `docker exec shopease_mongo mongosh shopease --eval "db.avis.countDocuments()"`
- [ ] Tester l'API : `curl http://localhost:8000/api/produits`

Si tous les checks passent : ✅ **Base de données correctement initialisée !**

---

## 💡 Astuces

### Sauvegarde avant réinitialisation

```bash
# PostgreSQL
docker exec shopease_postgres pg_dump -U admin shopease > backup.sql

# MongoDB
docker exec shopease_mongo mongodump --db shopease --out /tmp/backup
docker cp shopease_mongo:/tmp/backup ./mongo-backup
```

### Restauration

```bash
# PostgreSQL
docker exec -i shopease_postgres psql -U admin shopease < backup.sql

# MongoDB
docker cp ./mongo-backup shopease_mongo:/tmp/backup
docker exec shopease_mongo mongorestore --db shopease /tmp/backup/shopease
```

---

## 🎓 En résumé

| Scénario | Commande | Scripts exécutés ? |
|----------|----------|-------------------|
| Premier démarrage | `docker-compose up -d` | ✅ OUI |
| Restart simple | `docker-compose restart` | ❌ NON |
| Down + Up | `docker-compose down && up -d` | ❌ NON (volumes persistent) |
| Down avec volumes | `docker-compose down -v && up -d` | ✅ OUI |
| Suppression manuelle | `rm -rf data/* && up -d` | ✅ OUI |

**Règle d'or** : Pour réinitialiser complètement, utilisez `docker-compose down -v` ! 🎯
