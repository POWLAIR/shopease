"use client"

import { MoreHorizontal, Edit, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { VariantDialog } from "./variant-dialog"
import { StockDialog } from "./stock-dialog"

export function VariantActions({ variant, onUpdate }: { variant: any; onUpdate: () => void }) {
  const [editOpen, setEditOpen] = useState(false)
  const [stockOpen, setStockOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setStockOpen(true)}>
            <Package className="mr-2 h-4 w-4" />
            Gérer le stock
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <VariantDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        productId={variant.id_produit}
        variant={variant}
        onSuccess={onUpdate}
      />
      <StockDialog open={stockOpen} onOpenChange={setStockOpen} variant={variant} onSuccess={onUpdate} />
    </>
  )
}
