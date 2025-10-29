import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CheckCircle, XCircle, TrendingUp } from "lucide-react"

async function getPaymentsStats() {
  try {
    // Note: API doesn't have a global payments endpoint, would need to fetch per order
    // Using mock data for now
    return {
      totalAmount: 15420.5,
      successCount: 45,
      failedCount: 3,
      avgAmount: 342.68,
    }
  } catch (error) {
    return {
      totalAmount: 0,
      successCount: 0,
      failedCount: 0,
      avgAmount: 0,
    }
  }
}

export async function PaymentsStats() {
  const stats = await getPaymentsStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Montant total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAmount.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Total encaissé</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Paiements réussis</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successCount}</div>
          <p className="text-xs text-muted-foreground">Transactions validées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Paiements échoués</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.failedCount}</div>
          <p className="text-xs text-muted-foreground">Transactions refusées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Montant moyen</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.avgAmount.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Par transaction</p>
        </CardContent>
      </Card>
    </div>
  )
}
