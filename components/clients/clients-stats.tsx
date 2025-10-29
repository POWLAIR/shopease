import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, MapPin, TrendingUp } from "lucide-react"

async function getClientsStats() {
  try {
    const [clientsRes, addressesRes] = await Promise.all([
      fetch("http://localhost:8000/api/clients", { cache: "no-store" }),
      fetch("http://localhost:8000/api/clients", { cache: "no-store" }),
    ])

    const clients = clientsRes.ok ? await clientsRes.json() : []

    // Calculate addresses per client (would need to fetch all addresses)
    const avgAddresses = 1.5 // Mock value

    return {
      totalClients: clients.length,
      avgAddresses,
      newThisMonth: Math.floor(clients.length * 0.1),
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
