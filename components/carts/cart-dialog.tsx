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

export function CartDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    token: "",
    id_client: "none", // Updated default value to be a non-empty string
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetch(buildApiUrl("/api/clients"))
      .then((res) => res.json())
      .then(setClients)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (open) {
      setFormData({
        token: `cart_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        id_client: "none", // Updated default value to be a non-empty string
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(buildApiUrl("/api/paniers"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: formData.token,
          id_client: formData.id_client === "none" ? null : formData.id_client, // Updated to handle "none" value
        }),
      })

      if (!res.ok) throw new Error("Erreur lors de la création")

      toast({
        title: "Panier créé",
        description: "Le panier a été créé avec succès",
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
          <DialogTitle>Nouveau panier</DialogTitle>
          <DialogDescription>Créez un nouveau panier d'achat</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Token</Label>
              <Input
                id="token"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client">Client (optionnel)</Label>
              <Select
                value={formData.id_client}
                onValueChange={(value) => setFormData({ ...formData, id_client: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Panier anonyme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun (anonyme)</SelectItem>{" "}
                  {/* Updated value prop to be a non-empty string */}
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.prenom} {client.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
