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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"

export function ReviewDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    id_produit: "",
    auteur_nom: "",
    auteur_email: "",
    note: "5",
    commentaire: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    if (open) {
      setFormData({
        id_produit: "",
        auteur_nom: "",
        auteur_email: "",
        note: "5",
        commentaire: "",
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/api/avis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_produit: Number.parseInt(formData.id_produit),
          auteur: {
            nom: formData.auteur_nom,
            email: formData.auteur_email,
          },
          note: Number.parseInt(formData.note),
          commentaire: formData.commentaire,
        }),
      })

      if (!res.ok) throw new Error("Erreur lors de la création")

      toast({
        title: "Avis créé",
        description: "L'avis a été créé avec succès",
      })

      onOpenChange(false)
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
          <DialogTitle>Nouvel avis</DialogTitle>
          <DialogDescription>Créez un nouvel avis produit</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id_produit">ID du produit</Label>
              <Input
                id="id_produit"
                type="number"
                value={formData.id_produit}
                onChange={(e) => setFormData({ ...formData, id_produit: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="auteur_nom">Nom de l'auteur</Label>
                <Input
                  id="auteur_nom"
                  value={formData.auteur_nom}
                  onChange={(e) => setFormData({ ...formData, auteur_nom: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="auteur_email">Email de l'auteur</Label>
                <Input
                  id="auteur_email"
                  type="email"
                  value={formData.auteur_email}
                  onChange={(e) => setFormData({ ...formData, auteur_email: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="note">Note</Label>
              <Select value={formData.note} onValueChange={(value) => setFormData({ ...formData, note: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 étoiles</SelectItem>
                  <SelectItem value="4">4 étoiles</SelectItem>
                  <SelectItem value="3">3 étoiles</SelectItem>
                  <SelectItem value="2">2 étoiles</SelectItem>
                  <SelectItem value="1">1 étoile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="commentaire">Commentaire</Label>
              <Textarea
                id="commentaire"
                value={formData.commentaire}
                onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                rows={4}
                required
              />
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
