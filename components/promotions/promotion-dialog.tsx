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
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { buildApiUrl } from "@/lib/api"

export function PromotionDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    libelle: "",
    type: "PERCENTAGE",
    valeur: "",
    date_debut: "",
    date_fin: "",
    actif: true,
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      const today = new Date().toISOString().split("T")[0]
      setFormData({
        libelle: "",
        type: "PERCENTAGE",
        valeur: "",
        date_debut: today,
        date_fin: today,
        actif: true,
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(buildApiUrl("/api/promotions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          libelle: formData.libelle,
          type: formData.type,
          valeur: Number.parseFloat(formData.valeur),
          date_debut: formData.date_debut,
          date_fin: formData.date_fin,
          actif: formData.actif,
        }),
      })

      if (!res.ok) throw new Error("Erreur lors de la création")

      toast({
        title: "Promotion créée",
        description: "La promotion a été créée avec succès",
      })

      onOpenChange(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création",
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
          <DialogTitle>Nouvelle promotion</DialogTitle>
          <DialogDescription>Créez une nouvelle offre promotionnelle</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="libelle">Libellé</Label>
              <Input
                id="libelle"
                value={formData.libelle}
                onChange={(e) => setFormData({ ...formData, libelle: e.target.value })}
                placeholder="Soldes d'été"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Pourcentage</SelectItem>
                    <SelectItem value="FIXED">Montant fixe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="valeur">Valeur</Label>
                <Input
                  id="valeur"
                  type="number"
                  step="0.01"
                  value={formData.valeur}
                  onChange={(e) => setFormData({ ...formData, valeur: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date_debut">Date début</Label>
                <Input
                  id="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) => setFormData({ ...formData, date_debut: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date_fin">Date fin</Label>
                <Input
                  id="date_fin"
                  type="date"
                  value={formData.date_fin}
                  onChange={(e) => setFormData({ ...formData, date_fin: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="actif"
                checked={formData.actif}
                onCheckedChange={(checked) => setFormData({ ...formData, actif: checked })}
              />
              <Label htmlFor="actif">Promotion active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
