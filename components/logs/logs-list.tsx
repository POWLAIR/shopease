"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { buildApiUrl } from "@/lib/api"

export function LogsList() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [clientId, setClientId] = useState("")

  const loadLogs = async () => {
    if (!clientId) return

    setLoading(true)
    try {
      const res = await fetch(buildApiUrl(`/api/logs/${clientId}`))
      if (res.ok) {
        const data = await res.json()
        setLogs(data)
      } else {
        setLogs([])
      }
    } catch (error) {
      console.error("[v0] Error loading logs:", error)
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rechercher les logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label htmlFor="clientId">ID du client</Label>
            <Input
              id="clientId"
              placeholder="Entrez l'ID du client"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            />
          </div>
          <Button onClick={loadLogs} disabled={loading || !clientId} className="mt-auto">
            <Search className="mr-2 h-4 w-4" />
            Rechercher
          </Button>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Chargement...</p>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {clientId ? "Aucun log trouvé pour ce client" : "Entrez un ID de client pour rechercher"}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>ID Produit</TableHead>
                <TableHead>Date et heure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log: any, index: number) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.id_produit || "N/A"}</TableCell>
                  <TableCell>{new Date(log.timestamp).toLocaleString("fr-FR")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
