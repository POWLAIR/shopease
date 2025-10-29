"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const statusData = [
  { name: "En préparation", value: 19 },
  { name: "Expédiées", value: 60 },
  { name: "Livrées", value: 21 },
]

const COLORS = ["hsl(var(--chart-2))", "hsl(var(--chart-1))", "hsl(var(--chart-3))"]

export function DeliveriesChart() {
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
