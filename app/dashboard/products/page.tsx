import { Suspense } from "react"
import { ProductsList } from "@/components/products/products-list"
import { ProductsHeader } from "@/components/products/products-header"

export const dynamic = 'force-dynamic'

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <ProductsHeader />
      <Suspense fallback={<div>Chargement des produits...</div>}>
        <ProductsList />
      </Suspense>
    </div>
  )
}
