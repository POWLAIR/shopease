"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { VariantDialog } from "./variant-dialog"
import { VariantActions } from "./variant-actions"
import { buildApiUrl } from "@/lib/api"

export function ProductVariants({ productId }: { productId: string }) {
  const [variants, setVariants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadVariants = async () => {
    try {
      const res = await fetch(buildApiUrl(`/api/produits/${productId}/variantes`))
      if (res.ok) {
        const data = await res.json()
        setVariants(data)
      }
    } catch (error) {
      console.error("[v0] Error loading variants:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVariants()
  }, [productId])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Variantes ({variants.length})</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une variante
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : variants.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune variante disponible</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>EAN</TableHead>
                  <TableHead>Prix HT</TableHead>
                  <TableHead>Poids (g)</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Réservé</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant: any) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">{variant.sku}</TableCell>
                    <TableCell>{variant.ean || "N/A"}</TableCell>
                    <TableCell>{variant.prix_ht?.toFixed(2)} €</TableCell>
                    <TableCell>{variant.poids_g}g</TableCell>
                    <TableCell>{variant.stock_quantite || 0}</TableCell>
                    <TableCell>{variant.stock_reservee || 0}</TableCell>
                    <TableCell className="text-right">
                      <VariantActions variant={variant} onUpdate={loadVariants} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <VariantDialog open={dialogOpen} onOpenChange={setDialogOpen} productId={productId} onSuccess={loadVariants} />
    </>
  )
}
