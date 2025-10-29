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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function VariantDialog({
  open,
  onOpenChange,
  productId,
  variant,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  productId: string
  variant?: any
  onSuccess?: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    sku: "",
    ean: "",
    prix_ht: "",
    poids_g: "",
    attributs_json: "{}",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (variant) {
      setFormData({
        sku: variant.sku || "",
        ean: variant.ean || "",
        prix_ht: variant.prix_ht?.toString() || "",
        poids_g: variant.poids_g?.toString() || "",
        attributs_json: JSON.stringify(variant.attributs_json || {}, null, 2),
      })
    } else {
      setFormData({
        sku: "",
        ean: "",
        prix_ht: "",
        poids_g: "",
        attributs_json: "{}",
      })
    }
  }, [variant, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let attributs = {}
      try {
        attributs = JSON.parse(formData.attributs_json)
      } catch {
        throw new Error("Format JSON invalide pour les attributs")
      }

      const url = variant
        ? `http://localhost:8000/api/produits/variantes/${variant.id}`
        : `http://localhost:8000/api/produits/${productId}/variantes`
      const method = variant ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sku: formData.sku,
          ean: formData.ean || null,
          prix_ht: Number.parseFloat(formData.prix_ht),
          poids_g: Number.parseInt(formData.poids_g),
          attributs_json: attributs,
        }),
      })

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")

      toast({
        title: variant ? "Variante modifiée" : "Variante créée",
        description: "Les modifications ont été enregistrées avec succès",
      })

      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la sauvegarde",
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
          <DialogTitle>{variant ? "Modifier la variante" : "Nouvelle variante"}</DialogTitle>
          <DialogDescription>
            {variant ? "Modifiez les informations de la variante" : "Créez une nouvelle variante pour ce produit"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ean">EAN</Label>
                <Input
                  id="ean"
                  value={formData.ean}
                  onChange={(e) => setFormData({ ...formData, ean: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prix_ht">Prix HT (€)</Label>
                <Input
                  id="prix_ht"
                  type="number"
                  step="0.01"
                  value={formData.prix_ht}
                  onChange={(e) => setFormData({ ...formData, prix_ht: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="poids_g">Poids (g)</Label>
                <Input
                  id="poids_g"
                  type="number"
                  value={formData.poids_g}
                  onChange={(e) => setFormData({ ...formData, poids_g: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="attributs">Attributs (JSON)</Label>
              <Textarea
                id="attributs"
                value={formData.attributs_json}
                onChange={(e) => setFormData({ ...formData, attributs_json: e.target.value })}
                rows={4}
                placeholder='{"couleur": "rouge", "taille": "M"}'
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
