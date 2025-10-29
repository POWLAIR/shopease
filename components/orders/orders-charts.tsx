"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { buildApiUrl } from "@/lib/api"

async function getOrdersStats() {
  try {
    const res = await fetch(buildApiUrl("/api/commandes/stats"), { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return {
        total_commandes: 0,
        nombre_validees: 0,
        nombre_en_attente: 0,
        nombre_annulees: 0,
        repartition_par_statut: [],
        volume_par_jour: [],
      }
    }

    const total_commandes = Number(data.total_commandes) || 0
    const nombre_validees = Number(data.nombre_validees) || 0
    const nombre_en_attente = Number(data.nombre_en_attente) || 0
    const nombre_annulees = Number(data.nombre_annulees) || 0

    const repartition_par_statut = Array.isArray(data.repartition_par_statut)
      ? data.repartition_par_statut.map((r: any) => ({
        statut: r.statut,
        count: Number(r.count) || 0,
        pourcentage: Number(r.pourcentage) || 0,
      }))
      : []

    const volume_par_jour = Array.isArray(data.volume_par_jour)
      ? data.volume_par_jour.map((v: any) => ({
        date: v.date,
        nombre_commandes: Number(v.nombre_commandes) || 0,
        total_ventes: Number(v.total_ventes) || 0,
      }))
      : []

    return { total_commandes, nombre_validees, nombre_en_attente, nombre_annulees, repartition_par_statut, volume_par_jour }
  } catch (error) {
    return {
      total_commandes: 0,
      nombre_validees: 0,
      nombre_en_attente: 0,
      nombre_annulees: 0,
      repartition_par_statut: [],
      volume_par_jour: [],
    }
  }
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

export function OrdersCharts() {
  const [volumeData, setVolumeData] = useState<Array<any>>([])
  const [statusData, setStatusData] = useState<Array<any>>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const stats = await getOrdersStats()
      if (!mounted) return

      // mapper à partir des champs EXACTS de l'API
      const sd = (stats.repartition_par_statut || []).map((r: any) => ({
        name: r.statut,
        value: Number(r.count) || 0,
      }))

      const vd = (stats.volume_par_jour || []).map((v: any) => ({
        day: v.date, // on garde la date fournie par l'API
        orders: Number(v.nombre_commandes) || 0,
        total_ventes: Number(v.total_ventes) || 0,
      }))

      setStatusData(sd)
      setVolumeData(vd)
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Volume de commandes par jour</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

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
    </div>
  )
}
