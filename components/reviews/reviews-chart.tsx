"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

async function getReviewsStats() {
  try {
    const res = await fetch("http://localhost:8000/api/avis/stats", { cache: "no-store" })
    const data = res.ok ? await res.json() : null

    if (!data) {
      return { repartition_notes: {} }
    }

    const repartition_notes = data.repartition_notes && typeof data.repartition_notes === "object" ? data.repartition_notes : {}
    return { repartition_notes }
  } catch (error) {
    return { repartition_notes: {} }
  }
}

export function ReviewsChart() {
  const [ratingsData, setRatingsData] = useState<Array<any>>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const stats = await getReviewsStats()
      if (!mounted) return

      const entries = Object.entries(stats.repartition_notes || {})
      const mapped = entries.map(([key, val]) => {
        const m = key.match(/^(\d+)_etoiles$/)
        const n = m ? Number(m[1]) : 0
        const count = Number(val) || 0
        return { rating: `${n} étoiles`, count, order: n }
      }).sort((a, b) => b.order - a.order)

      setRatingsData(mapped)
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des notes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ratingsData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis dataKey="rating" type="category" className="text-xs" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
