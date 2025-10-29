import { Suspense } from "react"
import { CartsList } from "@/components/carts/carts-list"
import { CartsHeader } from "@/components/carts/carts-header"
import { CartsStats } from "@/components/carts/carts-stats"

export default function CartsPage() {
  return (
    <div className="flex flex-col gap-6">
      <CartsHeader />
      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <CartsStats />
      </Suspense>
      <Suspense fallback={<div>Chargement des paniers...</div>}>
        <CartsList />
      </Suspense>
    </div>
  )
}
