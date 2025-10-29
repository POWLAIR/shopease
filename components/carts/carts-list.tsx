import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CartActions } from "./cart-actions"
import { buildApiUrl } from "@/lib/api"

async function getCarts() {
  try {
    const res = await fetch(buildApiUrl("/api/paniers"), { cache: "no-store" })
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function CartsList() {
  const carts = await getCarts()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des paniers ({carts.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {carts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun panier disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead>Dernière MAJ</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carts.map((cart: any) => (
                <TableRow key={cart.id}>
                  <TableCell className="font-mono text-xs">{cart.token?.substring(0, 16)}...</TableCell>
                  <TableCell>{cart.id_client ? `Client ${cart.id_client.substring(0, 8)}` : "Anonyme"}</TableCell>
                  <TableCell>{new Date(cart.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{new Date(cart.updated_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <CartActions cart={cart} />
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
