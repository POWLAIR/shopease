"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { buildApiUrl } from "@/lib/api"

async function getDeliveriesStats() {
  try {
    const res = await fetch(buildApiUrl("/api/livraisons/stats"), { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return { repartition_par_statut: [] }
    }

    const repartition_par_statut = Array.isArray(data.repartition_par_statut)
      ? data.repartition_par_statut.map((r: any) => ({
        statut: r.statut,
        count: Number(r.count) || 0,
        pourcentage: Number(r.pourcentage) || 0,
      }))
      : []

    return { repartition_par_statut }
  } catch (error) {
    return { repartition_par_statut: [] }
  }
}

const COLORS = ["hsl(var(--chart-2))", "hsl(var(--chart-1))", "hsl(var(--chart-3))"]

export function DeliveriesChart() {
  const [statusData, setStatusData] = useState<Array<any>>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const stats = await getDeliveriesStats()
      if (!mounted) return

      const sd = (stats.repartition_par_statut || []).map((r: any) => ({
        name: r.statut,
        value: Number(r.count) || 0,
      }))

      setStatusData(sd)
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par statut</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
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
