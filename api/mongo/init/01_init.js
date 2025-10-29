// Initialisation MongoDB pour ShopEase (non relationnel)
(function () {
  const dbName = process.env.MONGO_DB || "shopease";
  const myDb = db.getSiblingDB(dbName);

  // Collections: avis (reviews) et logs (activité)
  myDb.createCollection("avis");
  myDb.createCollection("logs");

  // Indexes
  myDb.avis.createIndex({ id_produit: 1 });
  myDb.avis.createIndex({ "auteur.id_client": 1 });
  myDb.logs.createIndex({ id_client: 1, timestamp: -1 });

  // Schéma flexible recommandé ; pas d'insertion ici.
})();

