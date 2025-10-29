import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, CheckCircle, XCircle, TrendingUp } from "lucide-react"

async function getPaymentsStats() {
  try {
    const res = await fetch("http://localhost:8000/api/paiements/stats", { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return {
        montant_total: 0,
        montant_moyen: 0,
        total_paiements: 0,
        nombre_reussis: 0,
        nombre_echoues: 0,
        nombre_rembourses: 0,
        taux_reussite: 0,
        repartition_par_mode: [],
        repartition_par_statut: [],
      }
    }

    const montant_total = Number(data.montant_total) || 0
    const montant_moyen = Number(data.montant_moyen) || 0
    const total_paiements = Number(data.total_paiements) || 0
    const nombre_reussis = Number(data.nombre_reussis) || 0
    const nombre_echoues = Number(data.nombre_echoues) || 0
    const nombre_rembourses = Number(data.nombre_rembourses) || 0
    const taux_reussite = Number(data.taux_reussite) || 0

    const repartition_par_mode = Array.isArray(data.repartition_par_mode)
      ? data.repartition_par_mode.map((r: any) => ({
        mode: r.mode,
        count: Number(r.count) || 0,
        pourcentage: Number(r.pourcentage) || 0,
      }))
      : []

    const repartition_par_statut = Array.isArray(data.repartition_par_statut)
      ? data.repartition_par_statut.map((r: any) => ({
        statut: r.statut,
        count: Number(r.count) || 0,
        pourcentage: Number(r.pourcentage) || 0,
      }))
      : []

    return {
      montant_total,
      montant_moyen,
      total_paiements,
      nombre_reussis,
      nombre_echoues,
      nombre_rembourses,
      taux_reussite,
      repartition_par_mode,
      repartition_par_statut,
    }
  } catch (error) {
    return {
      montant_total: 0,
      montant_moyen: 0,
      total_paiements: 0,
      nombre_reussis: 0,
      nombre_echoues: 0,
      nombre_rembourses: 0,
      taux_reussite: 0,
      repartition_par_mode: [],
      repartition_par_statut: [],
    }
  }
}

export async function PaymentsStats() {
  const stats = await getPaymentsStats()

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Montant total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.montant_total.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Total encaissé</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Paiements réussis</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_reussis}</div>
          <p className="text-xs text-muted-foreground">Transactions validées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Paiements échoués</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.nombre_echoues}</div>
          <p className="text-xs text-muted-foreground">Transactions refusées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Montant moyen</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.montant_moyen.toFixed(2)} €</div>
          <p className="text-xs text-muted-foreground">Par transaction</p>
        </CardContent>
      </Card>
    </div>
  )
}
