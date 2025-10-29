"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { buildApiUrl } from "@/lib/api"

export function AddressDialog({
  open,
  onOpenChange,
  clientId,
  address,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  clientId: string
  address?: any
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    libelle: "",
    ligne1: "",
    ligne2: "",
    code_postal: "",
    ville: "",
    pays: "France",
    is_default_billing: false,
    is_default_shipping: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    if (address) {
      setFormData({
        libelle: address.libelle || "",
        ligne1: address.ligne1 || "",
        ligne2: address.ligne2 || "",
        code_postal: address.code_postal || "",
        ville: address.ville || "",
        pays: address.pays || "France",
        is_default_billing: address.is_default_billing || false,
        is_default_shipping: address.is_default_shipping || false,
      })
    } else {
      setFormData({
        libelle: "",
        ligne1: "",
        ligne2: "",
        code_postal: "",
        ville: "",
        pays: "France",
        is_default_billing: false,
        is_default_shipping: false,
      })
    }
  }, [address, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = address ? buildApiUrl(`/api/adresses/${address.id}`) : buildApiUrl("/api/adresses")
      const method = address ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id_client: clientId,
        }),
      })

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")

      toast({
        title: address ? "Adresse modifiée" : "Adresse créée",
        description: "Les modifications ont été enregistrées avec succès",
      })

      onOpenChange(false)
      onSuccess?.()
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
          <DialogTitle>{address ? "Modifier l'adresse" : "Nouvelle adresse"}</DialogTitle>
          <DialogDescription>
            {address ? "Modifiez les informations de l'adresse" : "Créez une nouvelle adresse pour ce client"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="libelle">Libellé</Label>
              <Input
                id="libelle"
                value={formData.libelle}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                placeholder="Domicile, Bureau, etc."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ligne1">Adresse ligne 1</Label>
              <Input
                id="ligne1"
                value={formData.ligne1}
                onChange={(e) => setFormData({ ...formData, ligne1: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ligne2">Adresse ligne 2 (optionnel)</Label>
              <Input
                id="ligne2"
                value={formData.ligne2}
                onChange={(e) => setFormData({ ...formData, ligne2: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code_postal">Code postal</Label>
                <Input
                  id="code_postal"
                  value={formData.code_postal}
                  onChange={(e) => setFormData({ ...formData, code_postal: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pays">Pays</Label>
              <Input
                id="pays"
                value={formData.pays}
                onChange={(e) => setFormData({ ...formData, pays: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_default_billing"
                  checked={formData.is_default_billing}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default_billing: checked })}
                />
                <Label htmlFor="is_default_billing">Adresse de facturation par défaut</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_default_shipping"
                  checked={formData.is_default_shipping}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default_shipping: checked })}
                />
                <Label htmlFor="is_default_shipping">Adresse de livraison par défaut</Label>
              </div>
            </div>
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
