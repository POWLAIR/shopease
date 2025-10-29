"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { DeliveryDialog } from "./delivery-dialog"

export function DeliveriesHeader() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Livraisons</h1>
          <p className="text-muted-foreground">Gérez les livraisons et le suivi des colis</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle livraison
        </Button>
      </div>
      <DeliveryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
