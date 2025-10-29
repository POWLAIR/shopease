import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getCart(id: string) {
  try {
    const res = await fetch(`http://localhost:8000/api/paniers/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    return await res.json()
  } catch (error) {
    return null
  }
}

export async function CartDetails({ cartId }: { cartId: string }) {
  const cart = await getCart(cartId)

  if (!cart) {
    return (
      <Card>
        <CardContent className="py-8 text-center">Panier non trouvé</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du panier</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Token</p>
            <p className="font-mono text-sm">{cart.token}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Client</p>
            <p className="text-sm">{cart.id_client ? `ID: ${cart.id_client.substring(0, 8)}...` : "Anonyme"}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date de création</p>
            <p className="text-sm">{new Date(cart.created_at).toLocaleString("fr-FR")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Dernière mise à jour</p>
            <p className="text-sm">{new Date(cart.updated_at).toLocaleString("fr-FR")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
