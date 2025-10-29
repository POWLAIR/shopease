/**
 * Utilitaire pour gérer les URLs de l'API
 * - Côté serveur (Server Components) : utilise API_URL (http://api:8000 dans Docker)
 * - Côté client (navigateur) : utilise NEXT_PUBLIC_API_URL (http://localhost:8000)
 */

/**
 * Retourne l'URL de base de l'API selon le contexte d'exécution
 * @returns {string} L'URL de base de l'API
 */
export function getApiUrl(): string {
    // Côté serveur : utilise API_URL (pour communication inter-conteneurs Docker)
    if (typeof window === "undefined") {
      return process.env.API_URL || "http://localhost:8000"
    }
    
    // Côté client : utilise NEXT_PUBLIC_API_URL (le navigateur fait l'appel)
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  }
  
  /**
   * Construit une URL complète vers un endpoint de l'API
   * @param {string} endpoint - Le chemin de l'endpoint (ex: "/api/categories")
   * @returns {string} L'URL complète
   */
  export function buildApiUrl(endpoint: string): string {
    const baseUrl = getApiUrl()
    // Assure qu'il n'y a pas de double slash
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    return `${baseUrl}${cleanEndpoint}`
  }
  
  