"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { buildApiUrl } from "@/lib/api"

export function OrderDialog({
  open,
  onOpenChange,
  order,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: any
}) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [addresses, setAddresses] = useState<any[]>([])
  const [formData, setFormData] = useState({
    ref: "",
    id_client: "",
    id_adr_fact: "",
    id_adr_livr: "",
    statut: "EN_ATTENTE",
    total_ht: "",
    total_tva: "",
    total_ttc: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetch(buildApiUrl("/api/clients"))
      .then((res) => res.json())
      .then(setClients)
      .catch(() => { })
  }, [])

  useEffect(() => {
    if (formData.id_client) {
      fetch(buildApiUrl(`/api/adresses/client/${formData.id_client}`))
        .then((res) => res.json())
        .then(setAddresses)
        .catch(() => { })
    }
  }, [formData.id_client])

  useEffect(() => {
    if (order) {
      setFormData({
        ref: order.ref || "",
        id_client: order.id_client || "",
        id_adr_fact: order.id_adr_fact || "",
        id_adr_livr: order.id_adr_livr || "",
        statut: order.statut || "EN_ATTENTE",
        total_ht: order.total_ht?.toString() || "",
        total_tva: order.total_tva?.toString() || "",
        total_ttc: order.total_ttc?.toString() || "",
      })
    } else {
      setFormData({
        ref: `CMD-${Date.now()}`,
        id_client: "",
        id_adr_fact: "",
        id_adr_livr: "",
        statut: "EN_ATTENTE",
        total_ht: "",
        total_tva: "",
        total_ttc: "",
      })
    }
  }, [order, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = order ? buildApiUrl(`/api/commandes/${order.id}`) : buildApiUrl("/api/commandes")
      const method = order ? "PUT" : "POST"

      const body: any = order
        ? {
          statut: formData.statut,
          id_adr_fact: formData.id_adr_fact || null,
          id_adr_livr: formData.id_adr_livr || null,
        }
        : {
          ref: formData.ref,
          id_client: formData.id_client,
          id_adr_fact: formData.id_adr_fact,
          id_adr_livr: formData.id_adr_livr,
          total_ht: Number.parseFloat(formData.total_ht),
          total_tva: Number.parseFloat(formData.total_tva),
          total_ttc: Number.parseFloat(formData.total_ttc),
          lignes: [],
        }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")

      toast({
        title: order ? "Commande modifiée" : "Commande créée",
        description: "Les modifications ont été enregistrées avec succès",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{order ? "Modifier la commande" : "Nouvelle commande"}</DialogTitle>
          <DialogDescription>
            {order ? "Modifiez les informations de la commande" : "Créez une nouvelle commande"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!order && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="ref">Référence</Label>
                  <Input
                    id="ref"
                    value={formData.ref}
                    onChange={(e) => setFormData({ ...formData, ref: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="client">Client</Label>
                  <Select
                    value={formData.id_client}
                    onValueChange={(value) => setFormData({ ...formData, id_client: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.prenom} {client.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="adr_fact">Adresse facturation</Label>
                <Select
                  value={formData.id_adr_fact}
                  onValueChange={(value) => setFormData({ ...formData, id_adr_fact: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id}>
                        {addr.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adr_livr">Adresse livraison</Label>
                <Select
                  value={formData.id_adr_livr}
                  onValueChange={(value) => setFormData({ ...formData, id_adr_livr: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {addresses.map((addr) => (
                      <SelectItem key={addr.id} value={addr.id}>
                        {addr.libelle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="statut">Statut</Label>
              <Select value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BROUILLON">Brouillon</SelectItem>
                  <SelectItem value="EN_ATTENTE_PAIEMENT">En attente de paiement</SelectItem>
                  <SelectItem value="PAYEE">Payée</SelectItem>
                  <SelectItem value="PREPAREE">Préparée</SelectItem>
                  <SelectItem value="EXPEDIEE">Expédiée</SelectItem>
                  <SelectItem value="LIVREE">Livrée</SelectItem>
                  <SelectItem value="ANNULEE">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!order && (
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="total_ht">Total HT</Label>
                  <Input
                    id="total_ht"
                    type="number"
                    step="0.01"
                    value={formData.total_ht}
                    onChange={(e) => setFormData({ ...formData, total_ht: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="total_tva">TVA</Label>
                  <Input
                    id="total_tva"
                    type="number"
                    step="0.01"
                    value={formData.total_tva}
                    onChange={(e) => setFormData({ ...formData, total_tva: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="total_ttc">Total TTC</Label>
                  <Input
                    id="total_ttc"
                    type="number"
                    step="0.01"
                    value={formData.total_ttc}
                    onChange={(e) => setFormData({ ...formData, total_ttc: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
