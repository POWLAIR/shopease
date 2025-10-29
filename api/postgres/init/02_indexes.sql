-- ========================
-- INDEX SUPPLÉMENTAIRES
-- ========================
-- Ces index améliorent les performances des requêtes fréquentes

-- Index pour les recherches par email (authentification, récupération de compte)
CREATE INDEX IF NOT EXISTS idx_client_email_lower ON client(LOWER(email));

-- Index pour les recherches de produits actifs
CREATE INDEX IF NOT EXISTS idx_produit_actif ON produit(actif) WHERE actif = true;

-- Index pour les recherches de produits par slug (URLs SEO)
CREATE INDEX IF NOT EXISTS idx_produit_slug_actif ON produit(slug) WHERE actif = true;

-- Index pour optimiser les jointures variante-stock
CREATE INDEX IF NOT EXISTS idx_stock_quantite ON stock(quantite) WHERE quantite > 0;

-- Index pour les paniers récents (nettoyage des paniers abandonnés)
CREATE INDEX IF NOT EXISTS idx_panier_updated ON panier(updated_at DESC);

-- Index pour les commandes par statut et date
CREATE INDEX IF NOT EXISTS idx_commande_statut_date ON commande(statut, created_at DESC);

-- Index pour les commandes non payées (relances)
CREATE INDEX IF NOT EXISTS idx_commande_non_payee ON commande(statut, created_at) 
  WHERE statut = 'EN_ATTENTE_PAIEMENT';

-- Index pour les paiements par statut
CREATE INDEX IF NOT EXISTS idx_paiement_statut ON paiement(statut, created_at DESC);

-- Index pour les livraisons en cours
CREATE INDEX IF NOT EXISTS idx_livraison_en_cours ON livraison(statut, expedie_at) 
  WHERE statut IN ('EXPEDIEE', 'EN_TRANSIT');

-- Index pour les promotions actives
CREATE INDEX IF NOT EXISTS idx_promotion_active ON promotion(actif, date_debut, date_fin) 
  WHERE actif = true;

-- Index pour les promotions en cours (date range)
CREATE INDEX IF NOT EXISTS idx_promotion_dates ON promotion(date_debut, date_fin) 
  WHERE actif = true;

-- Index pour les adresses par défaut d'un client
CREATE INDEX IF NOT EXISTS idx_adresse_default_billing ON adresse(id_client, is_default_billing) 
  WHERE is_default_billing = true;

CREATE INDEX IF NOT EXISTS idx_adresse_default_shipping ON adresse(id_client, is_default_shipping) 
  WHERE is_default_shipping = true;

-- Index pour les catégories parentes (navigation hiérarchique)
CREATE INDEX IF NOT EXISTS idx_categorie_parent ON categorie(parent_id) WHERE parent_id IS NOT NULL;

-- Index composite pour les variantes avec stock disponible
CREATE INDEX IF NOT EXISTS idx_variante_stock_dispo ON variante(id_produit, id) 
  WHERE id IN (SELECT id_variante FROM stock WHERE quantite > reservee);

-- Index pour les recherches full-text sur les produits (si besoin)
-- CREATE INDEX IF NOT EXISTS idx_produit_search ON produit USING gin(to_tsvector('french', nom || ' ' || COALESCE(description, '')));

-- Index pour les lignes de commande (rapports et statistiques)
CREATE INDEX IF NOT EXISTS idx_ligne_cmd_quantite ON ligne_commande(id_commande, quantite);

-- Index pour les paniers par token (invités)
CREATE INDEX IF NOT EXISTS idx_panier_token ON panier(token) WHERE id_client IS NULL;

-- Statistiques sur les index (optionnel, à exécuter après insertion des données)
-- ANALYZE client;
-- ANALYZE adresse;
-- ANALYZE categorie;
-- ANALYZE produit;
-- ANALYZE variante;
-- ANALYZE stock;
-- ANALYZE panier;
-- ANALYZE ligne_panier;
-- ANALYZE commande;
-- ANALYZE ligne_commande;
-- ANALYZE paiement;
-- ANALYZE livraison;
-- ANALYZE promotion;
-- ANALYZE produit_promotion;
