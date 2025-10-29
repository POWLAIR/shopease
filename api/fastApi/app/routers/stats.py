from fastapi import APIRouter, Depends
from app.core.deps import get_pg, get_mongo
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/stats", tags=["stats"])

@router.get("/global")
async def get_global_stats(pool=Depends(get_pg), db=Depends(get_mongo)):
    """Statistiques globales de toute la plateforme"""
    async with pool.acquire() as conn:
        # Total des ventes (commandes payées)
        total_ventes = await conn.fetchval("""
            SELECT COALESCE(SUM(total_ttc), 0)
            FROM commande
            WHERE statut IN ('PAYEE', 'PREPAREE', 'EXPEDIEE', 'LIVREE')
        """)
        
        # Nombre total de commandes
        total_commandes = await conn.fetchval("""
            SELECT COUNT(*) FROM commande
        """)
        
        # Panier moyen (montant moyen des commandes payées)
        panier_moyen = await conn.fetchval("""
            SELECT COALESCE(AVG(total_ttc), 0)
            FROM commande
            WHERE statut IN ('PAYEE', 'PREPAREE', 'EXPEDIEE', 'LIVREE')
        """)
        
        # Nombre de clients
        nb_clients = await conn.fetchval("""
            SELECT COUNT(*) FROM client
        """)
    
    # Stats MongoDB
    nb_avis = await db["avis"].count_documents({})
    nb_logs = await db["logs"].count_documents({})
    
    return {
        "total_ventes": float(total_ventes),
        "total_commandes": total_commandes,
        "panier_moyen": float(panier_moyen),
        "nombre_clients": nb_clients,
        "nombre_avis": nb_avis,
        "nombre_logs": nb_logs,
        "timestamp": datetime.now().isoformat()
    }