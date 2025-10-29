-- Extensions conseillées
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================
-- CLIENTS & ADRESSES
-- ========================
CREATE TABLE client (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prenom          VARCHAR(80) NOT NULL,
  nom             VARCHAR(80) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  tel             VARCHAR(25),
  pwd_hash        TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE adresse (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_client             UUID NOT NULL REFERENCES client(id) ON DELETE CASCADE,
  libelle               VARCHAR(80) NOT NULL,                  -- "Maison", "Bureau"...
  ligne1                VARCHAR(255) NOT NULL,
  ligne2                VARCHAR(255),
  code_postal           VARCHAR(20) NOT NULL,
  ville                 VARCHAR(120) NOT NULL,
  pays                  VARCHAR(80)  NOT NULL,
  is_default_billing    BOOLEAN NOT NULL DEFAULT false,
  is_default_shipping   BOOLEAN NOT NULL DEFAULT false
);

-- ========================
-- CATEGORIES (hiérarchie)
-- ========================
CREATE TABLE categorie (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  libelle     VARCHAR(120) NOT NULL,
  slug        VARCHAR(140) NOT NULL UNIQUE,
  parent_id   UUID REFERENCES categorie(id) ON DELETE SET NULL
);

-- ========================
-- PRODUITS & VARIANTES
-- ========================
CREATE TABLE produit (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_categorie  UUID REFERENCES categorie(id) ON DELETE SET NULL,
  nom           VARCHAR(160) NOT NULL,
  slug          VARCHAR(180) NOT NULL UNIQUE,
  description   TEXT,
  tva           NUMERIC(5,2) NOT NULL DEFAULT 20.00,     -- ex: 20.00 (%)
  actif         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE variante (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_produit     UUID NOT NULL REFERENCES produit(id) ON DELETE CASCADE,
  sku            VARCHAR(64) NOT NULL UNIQUE,
  ean            VARCHAR(32) UNIQUE,
  prix_ht        NUMERIC(10,2) NOT NULL CHECK (prix_ht >= 0),
  poids_g        INTEGER CHECK (poids_g >= 0),
  attributs_json JSONB NOT NULL DEFAULT '{}'::jsonb      -- { "couleur":"noir", "taille":"L" }
);

CREATE INDEX idx_variante_attributs ON variante USING GIN (attributs_json);

CREATE TABLE stock (
  id_variante  UUID PRIMARY KEY REFERENCES variante(id) ON DELETE CASCADE,
  quantite     INTEGER NOT NULL DEFAULT 0 CHECK (quantite >= 0),
  reservee     INTEGER NOT NULL DEFAULT 0 CHECK (reservee >= 0),
  seuil_alerte INTEGER NOT NULL DEFAULT 0 CHECK (seuil_alerte >= 0)
);

-- ========================
-- PANIER
-- ========================
CREATE TABLE panier (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_client   UUID REFERENCES client(id) ON DELETE SET NULL,
  token       VARCHAR(64) NOT NULL UNIQUE,            -- pour invités
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ligne_panier (
  id_panier    UUID NOT NULL REFERENCES panier(id) ON DELETE CASCADE,
  id_variante  UUID NOT NULL REFERENCES variante(id) ON DELETE CASCADE,
  quantite     INTEGER NOT NULL CHECK (quantite > 0),
  PRIMARY KEY (id_panier, id_variante)
);

-- ========================
-- COMMANDES
-- ========================
CREATE TYPE statut_commande AS ENUM ('BROUILLON','EN_ATTENTE_PAIEMENT','PAYEE','PREPAREE','EXPEDIEE','LIVREE','ANNULEE');

CREATE TABLE commande (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ref                VARCHAR(30) NOT NULL UNIQUE,              -- ex: LOO-2025-000123
  id_client          UUID NOT NULL REFERENCES client(id),
  id_adr_fact        UUID NOT NULL REFERENCES adresse(id),
  id_adr_livr        UUID NOT NULL REFERENCES adresse(id),
  statut             statut_commande NOT NULL DEFAULT 'EN_ATTENTE_PAIEMENT',
  total_ht           NUMERIC(12,2) NOT NULL CHECK (total_ht >= 0),
  total_tva          NUMERIC(12,2) NOT NULL CHECK (total_tva >= 0),
  total_ttc          NUMERIC(12,2) NOT NULL CHECK (total_ttc >= 0),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at            TIMESTAMPTZ
);

CREATE TABLE ligne_commande (
  id_commande        UUID NOT NULL REFERENCES commande(id) ON DELETE CASCADE,
  id_variante        UUID NOT NULL REFERENCES variante(id),
  libelle            VARCHAR(200) NOT NULL,                    -- libellé figé (au moment de l'achat)
  quantite           INTEGER NOT NULL CHECK (quantite > 0),
  prix_unitaire_ht   NUMERIC(10,2) NOT NULL CHECK (prix_unitaire_ht >= 0),
  tva                NUMERIC(5,2) NOT NULL CHECK (tva >= 0),
  PRIMARY KEY (id_commande, id_variante)
);

-- ========================
-- PAIEMENTS
-- ========================
CREATE TYPE statut_paiement AS ENUM ('CREATED','AUTHORIZED','CAPTURED','FAILED','REFUNDED');

CREATE TABLE paiement (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_commande    UUID NOT NULL REFERENCES commande(id) ON DELETE CASCADE,
  mode           VARCHAR(40) NOT NULL,                          -- 'carte','paypal','stripe'...
  montant        NUMERIC(12,2) NOT NULL CHECK (montant >= 0),
  statut         statut_paiement NOT NULL DEFAULT 'CREATED',
  transaction_id VARCHAR(120),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_paiement_commande ON paiement(id_commande);

-- ========================
-- LIVRAISON
-- ========================
CREATE TYPE statut_livraison AS ENUM ('EN_PREPARATION','EXPEDIEE','EN_TRANSIT','LIVREE','RETARD');

CREATE TABLE livraison (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  id_commande    UUID NOT NULL UNIQUE REFERENCES commande(id) ON DELETE CASCADE,
  transporteur   VARCHAR(80) NOT NULL,                          -- Colissimo, DHL, etc.
  num_suivi      VARCHAR(80),
  statut         statut_livraison NOT NULL DEFAULT 'EN_PREPARATION',
  cout_ht        NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (cout_ht >= 0),
  expedie_at     TIMESTAMPTZ,
  livre_at       TIMESTAMPTZ
);

-- ========================
-- PROMOTIONS
-- ========================
CREATE TYPE type_promo AS ENUM ('PERCENT','AMOUNT');

CREATE TABLE promotion (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  libelle      VARCHAR(120) NOT NULL,
  type         type_promo NOT NULL,
  valeur       NUMERIC(10,2) NOT NULL CHECK (valeur > 0),
  date_debut   TIMESTAMPTZ NOT NULL,
  date_fin     TIMESTAMPTZ NOT NULL,
  actif        BOOLEAN NOT NULL DEFAULT TRUE,
  CHECK (date_fin > date_debut)
);

CREATE TABLE produit_promotion (
  id_produit   UUID NOT NULL REFERENCES produit(id) ON DELETE CASCADE,
  id_promo     UUID NOT NULL REFERENCES promotion(id) ON DELETE CASCADE,
  PRIMARY KEY (id_produit, id_promo)
);

-- ========================
-- INDEX UTILES (perfs)
-- ========================
CREATE INDEX idx_produit_categorie   ON produit(id_categorie);
CREATE INDEX idx_variante_produit    ON variante(id_produit);
CREATE INDEX idx_commande_client     ON commande(id_client, created_at DESC);
CREATE INDEX idx_cmd_dates           ON commande(created_at);
CREATE INDEX idx_ligne_cmd_variante  ON ligne_commande(id_variante);
CREATE INDEX idx_livraison_statut    ON livraison(statut);

