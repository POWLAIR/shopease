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
import { useToast } from "@/hooks/use-toast"
import { buildApiUrl } from "@/lib/api"

export function ClientDialog({
  open,
  onOpenChange,
  client,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: any
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    tel: "",
    pwd_hash: "",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (client) {
      setFormData({
        prenom: client.prenom || "",
        nom: client.nom || "",
        email: client.email || "",
        tel: client.tel || "",
        pwd_hash: "",
      })
    } else {
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        tel: "",
        pwd_hash: "",
      })
    }
  }, [client, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = client ? buildApiUrl(`/api/clients/${client.id}`) : buildApiUrl("/api/clients")
      const method = client ? "PUT" : "POST"

      const body: any = {
        prenom: formData.prenom,
        nom: formData.nom,
        email: formData.email,
        tel: formData.tel || null,
      }

      if (!client || formData.pwd_hash) {
        body.pwd_hash = formData.pwd_hash || "hashed_password_placeholder"
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error("Erreur lors de la sauvegarde")

      toast({
        title: client ? "Client modifié" : "Client créé",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{client ? "Modifier le client" : "Nouveau client"}</DialogTitle>
          <DialogDescription>
            {client ? "Modifiez les informations du client" : "Créez un nouveau client"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tel">Téléphone</Label>
              <Input
                id="tel"
                type="tel"
                value={formData.tel}
                onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
              />
            </div>
            {!client && (
              <div className="grid gap-2">
                <Label htmlFor="pwd_hash">Mot de passe</Label>
                <Input
                  id="pwd_hash"
                  type="password"
                  value={formData.pwd_hash}
                  onChange={(e) => setFormData({ ...formData, pwd_hash: e.target.value })}
                  required={!client}
                />
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
