import { TrendingUp, ShoppingBag, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildApiUrl } from "@/lib/api"

async function getDashboardStats() {
  try {
    const res = await fetch(buildApiUrl("/api/stats/global"), { cache: "no-store" })
    const data = res.ok ? await res.json() : null


    if (!data) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        averageCart: 0,
        totalClients: 0,
        totalProducts: 0,
      }
    }

    return {
      totalRevenue: Number(data.total_ventes) || 0,
      totalOrders: Number(data.total_commandes) || 0,
      averageCart: Number(data.panier_moyen) || 0,
      totalClients: Number(data.nombre_clients) || 0,
      totalProducts: Number(data.nombre_produits) || 0,
    }
  } catch (error) {
    return {
      totalRevenue: 0,
      totalOrders: 0,
      averageCart: 0,
      totalClients: 0,
      totalProducts: 0,
    }
  }
}

export async function DashboardStats() {
  const stats = await getDashboardStats()

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Chiffre d'affaires</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Total des ventes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Commandes</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">Commandes totales</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Panier moyen</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageCart.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Montant moyen</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClients}</div>
          <p className="text-xs text-muted-foreground">Clients enregistrés</p>
        </CardContent>
      </Card>
    </div>
  )
}
