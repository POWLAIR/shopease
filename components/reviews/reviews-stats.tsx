import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MessageSquare, TrendingUp } from "lucide-react"
import { buildApiUrl } from "@/lib/api"

async function getReviewsStats() {
  try {
    const res = await fetch(buildApiUrl("/api/avis/stats"), { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return {
        note_moyenne: 0,
        total_avis: 0,
        avis_ce_mois: 0,
        repartition_notes: {},
      }
    }

    const note_moyenne = Number(data.note_moyenne) || 0
    const total_avis = Number(data.total_avis) || 0
    const avis_ce_mois = Number(data.avis_ce_mois) || 0
    const repartition_notes = data.repartition_notes && typeof data.repartition_notes === "object" ? data.repartition_notes : {}

    return { note_moyenne, total_avis, avis_ce_mois, repartition_notes }
  } catch (error) {
    return {
      note_moyenne: 0,
      total_avis: 0,
      avis_ce_mois: 0,
      repartition_notes: {},
    }
  }
}

export async function ReviewsStats() {
  const stats = await getReviewsStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total avis</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_avis}</div>
          <p className="text-xs text-muted-foreground">Tous les avis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.note_moyenne.toFixed(2)} / 5</div>
          <p className="text-xs text-muted-foreground">Satisfaction globale</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avis récents</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avis_ce_mois}</div>
          <p className="text-xs text-muted-foreground">Ce mois-ci</p>
        </CardContent>
      </Card>
    </div>
  )
}
