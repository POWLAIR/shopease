from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import (
    health, categories, produits, clients, adresses, paniers,
    commandes, paiements, livraisons, promotions, avis, logs, stats
)
from app.db.postgres import ensure_pg_pool
from app.db.mongo import ensure_mongo_client

app = FastAPI(title="ShopEase API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router)
app.include_router(stats.router)
app.include_router(categories.router)
app.include_router(produits.router)
app.include_router(clients.router)
app.include_router(adresses.router)
app.include_router(paniers.router)
app.include_router(commandes.router)
app.include_router(paiements.router)
app.include_router(livraisons.router)
app.include_router(promotions.router)
app.include_router(avis.router)
app.include_router(logs.router)

@app.on_event("startup")
async def startup():
    await ensure_pg_pool()
    await ensure_mongo_client()

@app.get("/")
async def root():
    return {"name": "ShopEase API (FastAPI)", "status": "ok"}

