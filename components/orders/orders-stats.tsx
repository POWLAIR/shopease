import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, CheckCircle, XCircle, Clock } from "lucide-react"

async function getOrdersStats() {
  try {
    const res = await fetch("http://localhost:8000/api/commandes", { cache: "no-store" })
    const orders = res.ok ? await res.json() : []

    const totalOrders = orders.length
    const validated = orders.filter((o: any) => o.statut === "VALIDEE").length
    const cancelled = orders.filter((o: any) => o.statut === "ANNULEE").length
    const pending = orders.filter((o: any) => o.statut === "EN_ATTENTE").length

    return { totalOrders, validated, cancelled, pending }
  } catch (error) {
    return { totalOrders: 0, validated: 0, cancelled: 0, pending: 0 }
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
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">Toutes les commandes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Validées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.validated}</div>
          <p className="text-xs text-muted-foreground">Commandes validées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">En attente</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">À traiter</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Annulées</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.cancelled}</div>
          <p className="text-xs text-muted-foreground">Commandes annulées</p>
        </CardContent>
      </Card>
    </div>
  )
}
