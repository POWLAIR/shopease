import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { OrderActions } from "./order-actions"

async function getOrders() {
  try {
    const res = await fetch("http://localhost:8000/api/commandes", { cache: "no-store" })
    if (!res.ok) return []
    return await res.json()
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

export async function OrdersList() {
  const orders = await getOrders()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des commandes ({orders.length})</CardTitle>
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
                <TableHead>Total HT</TableHead>
                <TableHead>Total TTC</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: any) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.ref}</TableCell>
                  <TableCell>{order.client_nom || "N/A"}</TableCell>
                  <TableCell>{order.total_ht?.toFixed(2)} €</TableCell>
                  <TableCell className="font-medium">{order.total_ttc?.toFixed(2)} €</TableCell>
                  <TableCell>{getStatusBadge(order.statut)}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <OrderActions order={order} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
