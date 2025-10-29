"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { DeliveryActions } from "./delivery-actions"

function getStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive"> = {
    LIVREE: "default",
    EXPEDIE: "secondary",
    EN_PREPARATION: "secondary",
  }
  return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
}

export function DeliveriesList() {
  const [deliveries, setDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")

  const loadDeliveries = async () => {
    if (!orderId) return

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/api/livraisons/commande/${orderId}`)
      if (res.ok) {
        const data = await res.json()
        setDeliveries(data ? [data] : [])
      } else {
        setDeliveries([])
      }
    } catch (error) {
      console.error("[v0] Error loading deliveries:", error)
      setDeliveries([])
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    loadDeliveries()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechercher les livraisons</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="orderId">ID de commande</Label>
            <Input
              id="orderId"
              placeholder="Entrez l'ID de la commande"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
            />
          </div>
          <Button onClick={loadDeliveries} disabled={loading || !orderId} className="mt-auto">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : deliveries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {orderId ? "Aucune livraison trouvée pour cette commande" : "Entrez un ID de commande pour rechercher"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transporteur</TableHead>
                <TableHead>Numéro de suivi</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Coût HT</TableHead>
                <TableHead>Date création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveries.map((delivery: any) => (
                <TableRow key={delivery.id}>
                  <TableCell className="font-medium">{delivery.transporteur}</TableCell>
                  <TableCell className="font-mono text-xs">{delivery.num_suivi || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(delivery.statut)}</TableCell>
                  <TableCell>{delivery.cout_ht?.toFixed(2)} €</TableCell>
                  <TableCell>{new Date(delivery.created_at).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell className="text-right">
                    <DeliveryActions delivery={delivery} onUpdate={handleUpdate} />
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
