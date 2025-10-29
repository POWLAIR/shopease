"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ClientDialog } from "./client-dialog"

export function ClientsHeader() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et leurs adresses</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau client
        </Button>
      </div>
      <ClientDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
