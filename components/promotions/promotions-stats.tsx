import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, TrendingUp, Percent } from "lucide-react"

async function getPromotionsStats() {
  try {
    const res = await fetch("http://localhost:8000/api/promotions/stats", { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return {
        total_promotions: 0,
        promotions_actives: 0,
        reduction_moyenne: 0,
      }
    }

    const total_promotions = Number(data.total_promotions) || 0
    const promotions_actives = Number(data.promotions_actives) || 0
    const reduction_moyenne = Number(data.reduction_moyenne) || 0

    return { total_promotions, promotions_actives, reduction_moyenne }
  } catch (error) {
    return {
      total_promotions: 0,
      promotions_actives: 0,
      reduction_moyenne: 0,
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
          <div className="text-2xl font-bold">{stats.total_promotions}</div>
          <p className="text-xs text-muted-foreground">Toutes les promotions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Promotions actives</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.promotions_actives}</div>
          <p className="text-xs text-muted-foreground">En cours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Réduction moyenne</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.reduction_moyenne.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">Moyenne des réductions</p>
        </CardContent>
      </Card>
    </div>
  )
}
