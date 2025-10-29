import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, TrendingUp } from "lucide-react"

async function getClientsStats() {
  try {
    const res = await fetch("http://localhost:8000/api/clients/stats", { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return {
        totalClients: 0,
        avgAddresses: 0,
        newThisMonth: 0,
      }
    }

    const totalClients = Number(data.total_clients) || 0
    const avgAddresses = Number(data.nombre_moyen_adresses) || 0
    const newThisMonth = Number(data.nouveaux_ce_mois) || 0

    return {
      totalClients,
      avgAddresses,
      newThisMonth,
    }
  } catch (error) {
    return {
      totalClients: 0,
      avgAddresses: 0,
      newThisMonth: 0,
    }
  }
}

export async function ClientsStats() {
  const stats = await getClientsStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total clients</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClients}</div>
          <p className="text-xs text-muted-foreground">Clients enregistrés</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Adresses moyennes</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgAddresses.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">Par client</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Nouveaux ce mois</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newThisMonth}</div>
          <p className="text-xs text-muted-foreground">Nouveaux clients</p>
        </CardContent>
      </Card>
    </div>
  )
}
