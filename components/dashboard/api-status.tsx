import { CheckCircle2, XCircle, Database } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { buildApiUrl } from "@/lib/api"

async function getHealthStatus() {
  try {
    const res = await fetch(buildApiUrl("/api/health"), {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("API non disponible")
    return await res.json()
  } catch (error) {
    return { status: "error", postgres: false, mongo: false }
  }
}

export async function ApiStatus() {
  const health = await getHealthStatus()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          État du Backend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">API:</span>
            {health.status === "ok" ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Connecté
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Déconnecté
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">PostgreSQL:</span>
            {health.postgres ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Actif
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Inactif
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">MongoDB:</span>
            {health.mongo ? (
              <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Actif
              </Badge>
            ) : (
              <Badge variant="destructive" className="gap-1">
                <XCircle className="h-3 w-3" />
                Inactif
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
