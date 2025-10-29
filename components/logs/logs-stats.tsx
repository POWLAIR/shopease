import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, TrendingUp } from "lucide-react"
import { buildApiUrl } from "@/lib/api"

async function getLogsStats() {
  try {
    const res = await fetch(buildApiUrl("/api/logs/stats"), { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return {
        total_logs: 0,
        actions_frequentes: [],
        types_frequents: [],
      }
    }

    const total_logs = Number(data.total_logs) || 0
    const actions_frequentes = Array.isArray(data.actions_frequentes) ? data.actions_frequentes.map((a: any) => ({
      action: a.action,
      count: Number(a.count) || 0,
      pourcentage: Number(a.pourcentage) || 0,
    })) : []

    const types_frequents = Array.isArray(data.types_frequents) ? data.types_frequents.map((t: any) => ({
      type: t.type,
      count: Number(t.count) || 0,
      pourcentage: Number(t.pourcentage) || 0,
    })) : []

    return { total_logs, actions_frequentes, types_frequents }
  } catch (error) {
    return {
      total_logs: 0,
      actions_frequentes: [],
      types_frequents: [],
    }
  }
}

export async function LogsStats() {
  const stats = await getLogsStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total actions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_logs}</div>
          <p className="text-xs text-muted-foreground">Actions enregistrées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.actions_frequentes.length}</div>
          <p className="text-xs text-muted-foreground">Actions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Actions fréquentes</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.actions_frequentes[0]?.action ?? "N/A"}</div>
          <p className="text-xs text-muted-foreground">Action la plus fréquente</p>
        </CardContent>
      </Card>
    </div>
  )
}
