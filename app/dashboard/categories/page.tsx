import { Suspense } from "react"
import { CategoriesList } from "@/components/categories/categories-list"
import { CategoriesHeader } from "@/components/categories/categories-header"

export const dynamic = 'force-dynamic'

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <CategoriesHeader />
      <Suspense fallback={<div>Chargement des catégories...</div>}>
        <CategoriesList />
      </Suspense>
    </div>
  )
}
