import { Suspense } from "react"
import { PromotionsList } from "@/components/promotions/promotions-list"
import { PromotionsHeader } from "@/components/promotions/promotions-header"
import { PromotionsStats } from "@/components/promotions/promotions-stats"

export const dynamic = 'force-dynamic'

export default function PromotionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PromotionsHeader />
      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <PromotionsStats />
      </Suspense>
      <Suspense fallback={<div>Chargement des promotions...</div>}>
        <PromotionsList />
      </Suspense>
    </div>
  )
}
