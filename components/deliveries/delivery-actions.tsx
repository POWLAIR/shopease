"use client"

import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { DeliveryDialog } from "./delivery-dialog"
import { DeleteDeliveryDialog } from "./delete-delivery-dialog"

export function DeliveryActions({ delivery, onUpdate }: { delivery: any; onUpdate: () => void }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

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
          <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeliveryDialog open={editOpen} onOpenChange={setEditOpen} delivery={delivery} onSuccess={onUpdate} />
      <DeleteDeliveryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        deliveryId={delivery.id}
        onSuccess={onUpdate}
      />
    </>
  )
}
