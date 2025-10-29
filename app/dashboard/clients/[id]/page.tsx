import { Suspense } from "react"
import { ClientDetails } from "@/components/clients/client-details"
import { ClientAddresses } from "@/components/clients/client-addresses"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détails du client</h1>
          <p className="text-muted-foreground">Informations et adresses du client</p>
        </div>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <ClientDetails clientId={params.id} />
      </Suspense>

      <Suspense fallback={<div>Chargement des adresses...</div>}>
        <ClientAddresses clientId={params.id} />
      </Suspense>
    </div>
  )
}
