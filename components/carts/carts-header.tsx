"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CartDialog } from "./cart-dialog"

export function CartsHeader() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Paniers</h1>
          <p className="text-muted-foreground">Gérez les paniers d'achat des clients</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau panier
        </Button>
      </div>
      <CartDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
