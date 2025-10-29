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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function DeliveryDialog({
  open,
  onOpenChange,
  delivery,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  delivery?: any
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id_commande: "",
    transporteur: "",
    num_suivi: "",
    statut: "EN_PREPARATION",
    cout_ht: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (delivery) {
      setFormData({
        id_commande: delivery.id_commande || "",
        transporteur: delivery.transporteur || "",
        num_suivi: delivery.num_suivi || "",
        statut: delivery.statut || "EN_PREPARATION",
        cout_ht: delivery.cout_ht?.toString() || "",
      })
    } else {
      setFormData({
        id_commande: "",
        transporteur: "",
        num_suivi: "",
        statut: "EN_PREPARATION",
        cout_ht: "",
      })
    }
  }, [delivery, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = delivery
        ? `http://localhost:8000/api/livraisons/${delivery.id}`
        : "http://localhost:8000/api/livraisons"
      const method = delivery ? "PUT" : "POST"

      const body: any = {
        transporteur: formData.transporteur,
        num_suivi: formData.num_suivi || null,
        statut: formData.statut,
        cout_ht: Number.parseFloat(formData.cout_ht),
      }

      if (!delivery) {
        body.id_commande = formData.id_commande
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")

      toast({
        title: delivery ? "Livraison modifiée" : "Livraison créée",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{delivery ? "Modifier la livraison" : "Nouvelle livraison"}</DialogTitle>
          <DialogDescription>
            {delivery ? "Modifiez les informations de la livraison" : "Créez une nouvelle livraison"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!delivery && (
              <div className="grid gap-2">
                <Label htmlFor="id_commande">ID de commande</Label>
                <Input
                  id="id_commande"
                  value={formData.id_commande}
                  onChange={(e) => setFormData({ ...formData, id_commande: e.target.value })}
                  required
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="transporteur">Transporteur</Label>
              <Input
                id="transporteur"
                value={formData.transporteur}
                onChange={(e) => setFormData({ ...formData, transporteur: e.target.value })}
                placeholder="Colissimo, Chronopost, etc."
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="num_suivi">Numéro de suivi</Label>
              <Input
                id="num_suivi"
                value={formData.num_suivi}
                onChange={(e) => setFormData({ ...formData, num_suivi: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="statut">Statut</Label>
              <Select value={formData.statut} onValueChange={(value) => setFormData({ ...formData, statut: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EN_PREPARATION">En préparation</SelectItem>
                  <SelectItem value="EXPEDIE">Expédié</SelectItem>
                  <SelectItem value="LIVREE">Livré</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cout_ht">Coût HT (€)</Label>
              <Input
                id="cout_ht"
                type="number"
                step="0.01"
                value={formData.cout_ht}
                onChange={(e) => setFormData({ ...formData, cout_ht: e.target.value })}
                required
              />
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
