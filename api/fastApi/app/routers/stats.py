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

@router.get("/dashboard")
async def get_dashboard_kpis(pool=Depends(get_pg)):
    """KPIs principaux pour le tableau de bord"""
    async with pool.acquire() as conn:
        # Nombre de commandes ce mois-ci
        commandes_mois = await conn.fetchval("""
            SELECT COUNT(*)
            FROM commande
            WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        """)
        
        # Chiffre d'affaires du mois
        ca_mois = await conn.fetchval("""
            SELECT COALESCE(SUM(total_ttc), 0)
            FROM commande
            WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
            AND statut IN ('PAYEE', 'PREPAREE', 'EXPEDIEE', 'LIVREE')
        """)
        
        # Nombre de nouveaux clients ce mois
        nouveaux_clients = await conn.fetchval("""
            SELECT COUNT(*)
            FROM client
            WHERE DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        """)
        
        # Taux de conversion (commandes / paniers)
        stats_conversion = await conn.fetchrow("""
            SELECT 
                (SELECT COUNT(*) FROM commande WHERE statut IN ('PAYEE', 'PREPAREE', 'EXPEDIEE', 'LIVREE')) as nb_commandes,
                (SELECT COUNT(*) FROM panier) as nb_paniers
        """)
        
        taux_conversion = 0
        if stats_conversion['nb_paniers'] > 0:
            taux_conversion = (stats_conversion['nb_commandes'] / stats_conversion['nb_paniers']) * 100
    
    return {
        "commandes_mois": commandes_mois,
        "ca_mois": float(ca_mois),
        "nouveaux_clients_mois": nouveaux_clients,
        "taux_conversion": round(taux_conversion, 2),
        "timestamp": datetime.now().isoformat()
    }

