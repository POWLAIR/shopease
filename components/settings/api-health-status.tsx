"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Database, RefreshCw } from "lucide-react"

async function getHealthStatus() {
  try {
    const res = await fetch("http://localhost:8000/api/health", {
      cache: "no-store",
    })
    if (!res.ok) throw new Error("API non disponible")
    return await res.json()
  } catch (error) {
    return { status: "error", postgres: false, mongo: false }
  }
}

export function ApiHealthStatus() {
  const [health, setHealth] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const refreshStatus = async () => {
    setLoading(true)
    const status = await getHealthStatus()
    setHealth(status)
    setLoading(false)
  }

  useState(() => {
    refreshStatus()
  })

  if (!health) {
    return (
      <Card>
        <CardContent className="py-8 text-center">Chargement...</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            État du Backend
          </CardTitle>
          <Button onClick={refreshStatus} disabled={loading} size="sm" variant="outline">
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
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

      <Card>
        <CardHeader>
          <CardTitle>Informations système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Version du dashboard</span>
            <span className="text-sm font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">API URL</span>
            <span className="text-sm font-mono">http://localhost:8000</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Environnement</span>
            <span className="text-sm font-medium">Développement</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
