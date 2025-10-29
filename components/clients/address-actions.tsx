"use client"

import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { AddressDialog } from "./address-dialog"
import { DeleteAddressDialog } from "./delete-address-dialog"

export function AddressActions({ address, onUpdate }: { address: any; onUpdate: () => void }) {
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
      <AddressDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        clientId={address.id_client}
        address={address}
        onSuccess={onUpdate}
      />
      <DeleteAddressDialog open={deleteOpen} onOpenChange={setDeleteOpen} addressId={address.id} onSuccess={onUpdate} />
    </>
  )
}
