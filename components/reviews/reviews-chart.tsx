"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const ratingsData = [
  { rating: "5 étoiles", count: 65 },
  { rating: "4 étoiles", count: 35 },
  { rating: "3 étoiles", count: 18 },
  { rating: "2 étoiles", count: 7 },
  { rating: "1 étoile", count: 2 },
]

export function ReviewsChart() {
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
            <YAxis dataKey="rating" type="category" className="text-xs" width={80} />
            <Tooltip />
            <Bar dataKey="count" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
