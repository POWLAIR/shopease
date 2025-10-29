import { Suspense } from "react"
import { ClientsList } from "@/components/clients/clients-list"
import { ClientsHeader } from "@/components/clients/clients-header"
import { ClientsStats } from "@/components/clients/clients-stats"

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ClientsHeader />
      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <ClientsStats />
      </Suspense>
      <Suspense fallback={<div>Chargement des clients...</div>}>
        <ClientsList />
      </Suspense>
    </div>
  )
}
