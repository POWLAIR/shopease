import { Suspense } from "react"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { RecentOrders } from "@/components/dashboard/recent-orders"
import { ApiStatus } from "@/components/dashboard/api-status"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre boutique e-commerce</p>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <ApiStatus />
      </Suspense>

      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <DashboardStats />
      </Suspense>

      <Suspense fallback={<div>Chargement des graphiques...</div>}>
        <DashboardCharts />
      </Suspense>

      <Suspense fallback={<div>Chargement des commandes...</div>}>
        <RecentOrders />
      </Suspense>
    </div>
  )
}
