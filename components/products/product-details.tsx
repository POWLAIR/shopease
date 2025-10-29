import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

async function getProduct(id: string) {
  try {
    const res = await fetch(`http://localhost:8000/api/produits`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const products = await res.json()
    return products.find((p: any) => p.id === id)
  } catch (error) {
    return null
  }
}

export async function ProductDetails({ productId }: { productId: string }) {
  const product = await getProduct(productId)

  if (!product) {
    return (
      <Card>
        <CardContent className="py-8 text-center">Produit non trouvé</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nom</p>
            <p className="text-lg font-semibold">{product.nom}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Slug</p>
            <p className="text-lg">{product.slug}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Description</p>
          <p className="text-base">{product.description || "Aucune description"}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Catégorie</p>
            <p className="text-base">{product.categorie_libelle || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">TVA</p>
            <p className="text-base">{product.tva}%</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Statut</p>
            <Badge variant={product.actif ? "default" : "secondary"}>{product.actif ? "Actif" : "Inactif"}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
