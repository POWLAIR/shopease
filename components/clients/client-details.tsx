import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getClient(id: string) {
  try {
    const res = await fetch(`http://localhost:8000/api/clients`, {
      cache: "no-store",
    })
    if (!res.ok) return null
    const clients = await res.json()
    return clients.find((c: any) => c.id === id)
  } catch (error) {
    return null
  }
}

export async function ClientDetails({ clientId }: { clientId: string }) {
  const client = await getClient(clientId)

  if (!client) {
    return (
      <Card>
        <CardContent className="py-8 text-center">Client non trouvé</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations personnelles</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prénom</p>
            <p className="text-lg font-semibold">{client.prenom}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Nom</p>
            <p className="text-lg font-semibold">{client.nom}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
            <p className="text-base">{client.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
            <p className="text-base">{client.tel || "Non renseigné"}</p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Date de création</p>
          <p className="text-base">{new Date(client.created_at).toLocaleDateString("fr-FR")}</p>
        </div>
      </CardContent>
    </Card>
  )
}
