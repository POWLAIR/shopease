import { Suspense } from "react"
import { ProductDetails } from "@/components/products/product-details"
import { ProductVariants } from "@/components/products/product-variants"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détails du produit</h1>
          <p className="text-muted-foreground">Informations et variantes du produit</p>
        </div>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <ProductDetails productId={id} />
      </Suspense>

      <Suspense fallback={<div>Chargement des variantes...</div>}>
        <ProductVariants productId={id} />
      </Suspense>
    </div>
  )
}
