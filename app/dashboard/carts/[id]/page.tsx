import { Suspense } from "react"
import { CartDetails } from "@/components/carts/cart-details"
import { CartItems } from "@/components/carts/cart-items"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CartDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/carts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détails du panier</h1>
          <p className="text-muted-foreground">Contenu et informations du panier</p>
        </div>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <CartDetails cartId={params.id} />
      </Suspense>

      <Suspense fallback={<div>Chargement des articles...</div>}>
        <CartItems cartId={params.id} />
      </Suspense>
    </div>
  )
}
