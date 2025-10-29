"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ReviewDialog } from "./review-dialog"

export function ReviewsHeader() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Avis</h1>
          <p className="text-muted-foreground">Gérez les avis clients sur vos produits</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel avis
        </Button>
      </div>
      <ReviewDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
