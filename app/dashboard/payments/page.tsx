import { Suspense } from "react"
import { PaymentsList } from "@/components/payments/payments-list"
import { PaymentsHeader } from "@/components/payments/payments-header"
import { PaymentsStats } from "@/components/payments/payments-stats"
import { PaymentsChart } from "@/components/payments/payments-chart"

export const dynamic = 'force-dynamic'

export default function PaymentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PaymentsHeader />
      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <PaymentsStats />
      </Suspense>
      <Suspense fallback={<div>Chargement du graphique...</div>}>
        <PaymentsChart />
      </Suspense>
      <Suspense fallback={<div>Chargement des paiements...</div>}>
        <PaymentsList />
      </Suspense>
    </div>
  )
}
