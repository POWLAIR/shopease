"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { PromotionDialog } from "./promotion-dialog"

export function PromotionsHeader() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground">Gérez vos offres promotionnelles</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle promotion
        </Button>
      </div>
      <PromotionDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
