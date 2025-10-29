import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ClientActions } from "./client-actions"

async function getClients() {
  try {
    const res = await fetch("http://localhost:8000/api/clients", {
      cache: "no-store",
    })
    if (!res.ok) return []
    return await res.json()
  } catch (error) {
    return []
  }
}

export async function ClientsList() {
  const clients = await getClients()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des clients ({clients.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun client disponible</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client: any) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    {client.prenom} {client.nom}
                  </TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.tel || "N/A"}</TableCell>
                  <TableCell>{new Date(client.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <ClientActions client={client} />
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
