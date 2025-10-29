import { Suspense } from "react"
import { OrderDetails } from "@/components/orders/order-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Détails de la commande</h1>
          <p className="text-muted-foreground">Informations complètes de la commande</p>
        </div>
      </div>

      <Suspense fallback={<div>Chargement...</div>}>
        <OrderDetails orderId={params.id} />
      </Suspense>
    </div>
  )
}
