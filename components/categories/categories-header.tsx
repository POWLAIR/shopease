"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CategoryDialog } from "./category-dialog"

export function CategoriesHeader() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
          <p className="text-muted-foreground">Organisez votre catalogue par catégories</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>
      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
