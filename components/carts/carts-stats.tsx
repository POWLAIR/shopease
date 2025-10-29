import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, TrendingDown, DollarSign } from "lucide-react"

async function getCartsStats() {
  try {
    const res = await fetch("http://localhost:8000/api/paniers/stats", { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return { totalCarts: 0, abandonRate: 0, avgAmount: 0 }
    }

    const totalCarts = Number(data.total_paniers) || 0
    const abandonRate = Number(data.taux_abandon) || 0
    const avgAmount = Number(data.montant_moyen) || 0

    return { totalCarts, abandonRate, avgAmount }
  } catch (error) {
    return { totalCarts: 0, abandonRate: 0, avgAmount: 0 }
  }
}

export async function CartsStats() {
  const stats = await getCartsStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Paniers créés</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCarts}</div>
          <p className="text-xs text-muted-foreground">Total des paniers</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Taux d'abandon</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.abandonRate}%</div>
          <p className="text-xs text-muted-foreground">Paniers non convertis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Montant moyen</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgAmount.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Par panier</p>
        </CardContent>
      </Card>
    </div>
  )
}
