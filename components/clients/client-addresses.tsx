"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Home, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AddressDialog } from "./address-dialog"
import { AddressActions } from "./address-actions"
import { buildApiUrl } from "@/lib/api"

export function ClientAddresses({ clientId }: { clientId: string }) {
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  const loadAddresses = async () => {
    try {
      const res = await fetch(buildApiUrl(`/api/adresses/client/${clientId}`))
      if (res.ok) {
        const data = await res.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error("[v0] Error loading addresses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAddresses()
  }, [clientId])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Adresses ({addresses.length})</CardTitle>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une adresse
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune adresse disponible</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {addresses.map((address: any) => (
                <Card key={address.id}>
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{address.libelle}</span>
                    </div>
                    <AddressActions address={address} onUpdate={loadAddresses} />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">{address.ligne1}</p>
                    {address.ligne2 && <p className="text-sm">{address.ligne2}</p>}
                    <p className="text-sm">
                      {address.code_postal} {address.ville}
                    </p>
                    <p className="text-sm font-medium">{address.pays}</p>
                    <div className="flex gap-2 pt-2">
                      {address.is_default_billing && (
                        <Badge variant="secondary" className="gap-1">
                          <Building className="h-3 w-3" />
                          Facturation
                        </Badge>
                      )}
                      {address.is_default_shipping && (
                        <Badge variant="secondary" className="gap-1">
                          <Home className="h-3 w-3" />
                          Livraison
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <AddressDialog open={dialogOpen} onOpenChange={setDialogOpen} clientId={clientId} onSuccess={loadAddresses} />
    </>
  )
}
