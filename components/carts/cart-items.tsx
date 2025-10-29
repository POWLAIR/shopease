"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CartItems({ cartId }: { cartId: string }) {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`http://localhost:8000/api/paniers/${cartId}/lignes`)
      .then((res) => res.json())
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cartId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Articles du panier ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun article dans ce panier</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Prix unitaire</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Stock disponible</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item: any) => (
                <TableRow key={item.id_variante}>
                  <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                  <TableCell>{item.prix_unitaire?.toFixed(2)} €</TableCell>
                  <TableCell>{item.quantite}</TableCell>
                  <TableCell>{item.stock_disponible}</TableCell>
                  <TableCell className="text-right font-medium">
                    {(item.prix_unitaire * item.quantite).toFixed(2)} €
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
