import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { buildApiUrl } from "@/lib/api"

async function getPromotions() {
  try {
    const res = await fetch(buildApiUrl("/api/promotions"), { cache: "no-store" })
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function PromotionsList() {
  const promotions = await getPromotions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des promotions ({promotions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {promotions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune promotion disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Libellé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Valeur</TableHead>
                <TableHead>Date début</TableHead>
                <TableHead>Date fin</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {promotions.map((promo: any) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">{promo.libelle}</TableCell>
                  <TableCell>{promo.type}</TableCell>
                  <TableCell>
                    {promo.type === "PERCENTAGE" ? `${promo.valeur}%` : `${promo.valeur?.toFixed(2)} €`}
                  </TableCell>
                  <TableCell>{new Date(promo.date_debut).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>{new Date(promo.date_fin).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell>
                    <Badge variant={promo.actif ? "default" : "secondary"}>{promo.actif ? "Actif" : "Inactif"}</Badge>
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
