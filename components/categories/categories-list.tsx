import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CategoryActions } from "./category-actions"

async function getCategories() {
  try {
    const res = await fetch("http://localhost:8000/api/categories", {
      cache: "no-store",
    })
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function CategoriesList() {
  const categories = await getCategories()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des catégories ({categories.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune catégorie disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category: any) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.libelle}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.parent_id ? "Sous-catégorie" : "Principale"}</TableCell>
                  <TableCell className="text-right">
                    <CategoryActions category={category} />
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
