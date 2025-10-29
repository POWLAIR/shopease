import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, CheckCircle, XCircle, Clock } from "lucide-react"

async function getOrdersStats() {
  try {
    const res = await fetch("http://localhost:8000/api/commandes/stats", { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return { total_commandes: 0, nombre_validees: 0, nombre_en_attente: 0, nombre_annulees: 0 }
    }

    const total_commandes = Number(data.total_commandes) || 0
    const nombre_validees = Number(data.nombre_validees) || 0
    const nombre_en_attente = Number(data.nombre_en_attente) || 0
    const nombre_annulees = Number(data.nombre_annulees) || 0

    return { total_commandes, nombre_validees, nombre_en_attente, nombre_annulees }
  } catch (error) {
    return { total_commandes: 0, nombre_validees: 0, nombre_en_attente: 0, nombre_annulees: 0 }
  }
}

export async function OrdersStats() {
  const stats = await getOrdersStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total commandes</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_commandes}</div>
          <p className="text-xs text-muted-foreground">Toutes les commandes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Validées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_validees}</div>
          <p className="text-xs text-muted-foreground">Commandes validées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">En attente</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_en_attente}</div>
          <p className="text-xs text-muted-foreground">À traiter</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Annulées</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_annulees}</div>
          <p className="text-xs text-muted-foreground">Commandes annulées</p>
        </CardContent>
      </Card>
    </div>
  )
}
