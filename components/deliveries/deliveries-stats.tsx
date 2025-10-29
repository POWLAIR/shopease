import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, CheckCircle, Clock } from "lucide-react"
import { buildApiUrl } from "@/lib/api"

async function getDeliveriesStats() {
  try {
    const res = await fetch(buildApiUrl("/api/livraisons/stats"), { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return {
        total_livraisons: 0,
        nombre_en_preparation: 0,
        nombre_expediees: 0,
        nombre_livrees: 0,
        repartition_par_statut: [],
        volume_par_jour: [],
      }
    }

    const total_livraisons = Number(data.total_livraisons) || 0
    const nombre_en_preparation = Number(data.nombre_en_preparation) || 0
    const nombre_expediees = Number(data.nombre_expediees) || 0
    const nombre_livrees = Number(data.nombre_livrees) || 0

    const repartition_par_statut = Array.isArray(data.repartition_par_statut)
      ? data.repartition_par_statut.map((r: any) => ({
        statut: r.statut,
        count: Number(r.count) || 0,
        pourcentage: Number(r.pourcentage) || 0,
      }))
      : []

    const volume_par_jour = Array.isArray(data.volume_par_jour)
      ? data.volume_par_jour.map((v: any) => ({
        date: v.date,
        nombre_livraisons: Number(v.nombre_livraisons) || 0,
      }))
      : []

    return { total_livraisons, nombre_en_preparation, nombre_expediees, nombre_livrees, repartition_par_statut, volume_par_jour }
  } catch (error) {
    return {
      total_livraisons: 0,
      nombre_en_preparation: 0,
      nombre_expediees: 0,
      nombre_livrees: 0,
      repartition_par_statut: [],
      volume_par_jour: [],
    }
  }
}

export async function DeliveriesStats() {
  const stats = await getDeliveriesStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total livraisons</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_livraisons}</div>
          <p className="text-xs text-muted-foreground">Toutes les livraisons</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">En préparation</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_en_preparation}</div>
          <p className="text-xs text-muted-foreground">À préparer</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expédiées</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_expediees}</div>
          <p className="text-xs text-muted-foreground">En transit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Livrées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_livrees}</div>
          <p className="text-xs text-muted-foreground">Terminées</p>
        </CardContent>
      </Card>
    </div>
  )
}
