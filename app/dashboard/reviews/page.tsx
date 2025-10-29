import { Suspense } from "react"
import { ReviewsList } from "@/components/reviews/reviews-list"
import { ReviewsHeader } from "@/components/reviews/reviews-header"
import { ReviewsStats } from "@/components/reviews/reviews-stats"
import { ReviewsChart } from "@/components/reviews/reviews-chart"

export const dynamic = 'force-dynamic'

export default function ReviewsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ReviewsHeader />
      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <ReviewsStats />
      </Suspense>
      <Suspense fallback={<div>Chargement du graphique...</div>}>
        <ReviewsChart />
      </Suspense>
      <Suspense fallback={<div>Chargement des avis...</div>}>
        <ReviewsList />
      </Suspense>
    </div>
  )
}
