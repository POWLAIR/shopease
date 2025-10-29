import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getOrder(id: string) {
  try {
    const res = await fetch(`http://localhost:8000/api/commandes/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    return null
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

export async function OrderDetails({ orderId }: { orderId: string }) {
  const order = await getOrder(orderId)

  if (!order) {
    return (
      <Card>
        <CardContent className="py-8 text-center">Commande non trouvée</CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Référence</p>
              <p className="text-lg font-semibold">{order.ref}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client</p>
              <p className="text-lg">{order.client_nom || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              {getStatusBadge(order.statut)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total HT</p>
              <p className="text-lg font-semibold">{order.total_ht?.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">TVA</p>
              <p className="text-lg">{order.total_tva?.toFixed(2)} €</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total TTC</p>
              <p className="text-lg font-semibold">{order.total_ttc?.toFixed(2)} €</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date de création</p>
            <p className="text-base">{new Date(order.created_at).toLocaleString("fr-FR")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
