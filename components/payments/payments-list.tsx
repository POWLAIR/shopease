"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

function getStatusBadge(status: string) {
  const variants: Record<string, "default" | "secondary" | "destructive"> = {
    SUCCESS: "default",
    CREATED: "secondary",
    FAILED: "destructive",
    PENDING: "secondary",
  }
  return <Badge variant={variants[status] || "secondary"}>{status}</Badge>
}

export function PaymentsList() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState("")

  const loadPayments = async () => {
    if (!orderId) return

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/api/paiements/commande/${orderId}`)
      if (res.ok) {
        const data = await res.json()
        setPayments(data)
      } else {
        setPayments([])
      }
    } catch (error) {
      console.error("[v0] Error loading payments:", error)
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechercher les paiements</CardTitle>
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
          <Button onClick={loadPayments} disabled={loading || !orderId} className="mt-auto">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {orderId ? "Aucun paiement trouvé pour cette commande" : "Entrez un ID de commande pour rechercher"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mode</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment: any) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.mode}</TableCell>
                  <TableCell>{payment.montant?.toFixed(2)} €</TableCell>
                  <TableCell>{getStatusBadge(payment.statut)}</TableCell>
                  <TableCell className="font-mono text-xs">{payment.transaction_id || "N/A"}</TableCell>
                  <TableCell>{new Date(payment.created_at).toLocaleDateString("fr-FR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
