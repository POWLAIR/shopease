import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, TrendingUp, Percent } from "lucide-react"

async function getPromotionsStats() {
  try {
    const res = await fetch("http://localhost:8000/api/promotions", { cache: "no-store" })
    const promotions = res.ok ? await res.json() : []

    return {
      totalPromotions: promotions.length,
      activePromotions: promotions.filter((p: any) => p.actif).length,
      avgDiscount: 15.5, // Mock value
    }
  } catch (error) {
    return {
      totalPromotions: 0,
      activePromotions: 0,
      avgDiscount: 0,
    }
  }
}

export async function PromotionsStats() {
  const stats = await getPromotionsStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total promotions</CardTitle>
          <Tag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPromotions}</div>
          <p className="text-xs text-muted-foreground">Toutes les promotions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Promotions actives</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activePromotions}</div>
          <p className="text-xs text-muted-foreground">En cours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Réduction moyenne</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgDiscount}%</div>
          <p className="text-xs text-muted-foreground">Moyenne des réductions</p>
        </CardContent>
      </Card>
    </div>
  )
}
