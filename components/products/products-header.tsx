"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ProductDialog } from "./product-dialog"

export function ProductsHeader() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
          <p className="text-muted-foreground">Gérez votre catalogue de produits et variantes</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>
      <ProductDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
