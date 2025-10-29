"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { buildApiUrl } from "@/lib/api"

async function getPaymentsStats() {
  try {
    const res = await fetch(buildApiUrl("/api/paiements/stats"), { cache: "no-store" })
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
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

export function PaymentsChart() {
  const [repartition, setRepartitionData] = useState<Array<any>>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const stats = await getPaymentsStats()
      if (!mounted) return

      // mapper à partir des champs EXACTS de l'API
      const sd = (stats.repartition_par_statut || []).map((r: any) => ({
        name: r.statut,
        value: Number(r.count) || 0,
      }))


      setRepartitionData(sd)
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par mode de paiement</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={repartition}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {repartition.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
