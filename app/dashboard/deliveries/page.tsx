import { Suspense } from "react"
import { DeliveriesList } from "@/components/deliveries/deliveries-list"
import { DeliveriesHeader } from "@/components/deliveries/deliveries-header"
import { DeliveriesStats } from "@/components/deliveries/deliveries-stats"
import { DeliveriesChart } from "@/components/deliveries/deliveries-chart"

export default function DeliveriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <DeliveriesHeader />
      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <DeliveriesStats />
      </Suspense>
      <Suspense fallback={<div>Chargement du graphique...</div>}>
        <DeliveriesChart />
      </Suspense>
      <Suspense fallback={<div>Chargement des livraisons...</div>}>
        <DeliveriesList />
      </Suspense>
    </div>
  )
}
