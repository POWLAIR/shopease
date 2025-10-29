import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { buildApiUrl } from "@/lib/api"

async function getRecentOrders() {
  try {
    const res = await fetch(buildApiUrl("/api/commandes"), {
      cache: "no-store",
    })
    if (!res.ok) return []
    const orders = await res.json()
    return orders.slice(0, 10)
  } catch (error) {
    return []
  }
}

function getStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive"> = {
    VALIDEE: "default",
    EN_ATTENTE: "secondary",
    ANNULEE: "destructive",
  }
  return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
}

export async function RecentOrders() {
  const orders = await getRecentOrders()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dernières commandes</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune commande disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.ref}</TableCell>
                  <TableCell>{order.client_nom || "N/A"}</TableCell>
                  <TableCell>{order.total_ttc?.toFixed(2)} €</TableCell>
                  <TableCell>{getStatusBadge(order.statut)}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString("fr-FR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
