import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProductActions } from "./product-actions"

async function getProducts() {
  try {
    const res = await fetch("http://localhost:8000/api/produits", {
      cache: "no-store",
    })
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function ProductsList() {
  const products = await getProducts()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des produits ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun produit disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>TVA</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.nom}</TableCell>
                  <TableCell>{product.categorie_libelle || "N/A"}</TableCell>
                  <TableCell>{product.tva}%</TableCell>
                  <TableCell>
                    <Badge variant={product.actif ? "default" : "secondary"}>
                      {product.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(product.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <ProductActions product={product} />
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
