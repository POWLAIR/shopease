import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, CheckCircle, Clock } from "lucide-react"

async function getDeliveriesStats() {
  try {
    // Mock data - API doesn't have global deliveries endpoint
    return {
      total: 42,
      inPreparation: 8,
      shipped: 25,
      delivered: 9,
    }
  } catch (error) {
    return {
      total: 0,
      inPreparation: 0,
      shipped: 0,
      delivered: 0,
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
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">Toutes les livraisons</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">En préparation</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inPreparation}</div>
          <p className="text-xs text-muted-foreground">À préparer</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Expédiées</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.shipped}</div>
          <p className="text-xs text-muted-foreground">En transit</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Livrées</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.delivered}</div>
          <p className="text-xs text-muted-foreground">Terminées</p>
        </CardContent>
      </Card>
    </div>
  )
}
