import { Suspense } from "react"
import { OrdersList } from "@/components/orders/orders-list"
import { OrdersHeader } from "@/components/orders/orders-header"
import { OrdersStats } from "@/components/orders/orders-stats"
import { OrdersCharts } from "@/components/orders/orders-charts"

export const dynamic = 'force-dynamic'

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <OrdersHeader />
      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <OrdersStats />
      </Suspense>
      <Suspense fallback={<div>Chargement des graphiques...</div>}>
        <OrdersCharts />
      </Suspense>
      <Suspense fallback={<div>Chargement des commandes...</div>}>
        <OrdersList />
      </Suspense>
    </div>
  )
}
