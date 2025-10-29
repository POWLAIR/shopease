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
import { useToast } from "@/hooks/use-toast"

export function StockDialog({
  open,
  onOpenChange,
  variant,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: any
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    quantite: "",
    reservee: "",
    seuil_alerte: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (variant) {
      setFormData({
        quantite: variant.stock_quantite?.toString() || "0",
        reservee: variant.stock_reservee?.toString() || "0",
        seuil_alerte: variant.stock_seuil_alerte?.toString() || "10",
      })
    }
  }, [variant, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`http://localhost:8000/api/produits/variantes/${variant.id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quantite: Number.parseInt(formData.quantite),
          reservee: Number.parseInt(formData.reservee),
          seuil_alerte: Number.parseInt(formData.seuil_alerte),
        }),
      })

      if (!res.ok) throw new Error("Erreur lors de la mise à jour du stock")

      toast({
        title: "Stock mis à jour",
        description: "Le stock a été mis à jour avec succès",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour",
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
          <DialogTitle>Gérer le stock</DialogTitle>
          <DialogDescription>Mettez à jour les quantités en stock pour cette variante</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="quantite">Quantité disponible</Label>
              <Input
                id="quantite"
                type="number"
                value={formData.quantite}
                onChange={(e) => setFormData({ ...formData, quantite: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reservee">Quantité réservée</Label>
              <Input
                id="reservee"
                type="number"
                value={formData.reservee}
                onChange={(e) => setFormData({ ...formData, reservee: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="seuil_alerte">Seuil d'alerte</Label>
              <Input
                id="seuil_alerte"
                type="number"
                value={formData.seuil_alerte}
                onChange={(e) => setFormData({ ...formData, seuil_alerte: e.target.value })}
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
