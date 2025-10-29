import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Users, TrendingUp } from "lucide-react"

async function getLogsStats() {
  try {
    // Mock data - would need to aggregate from MongoDB
    return {
      totalActions: 1542,
      activeUsers: 87,
      peakHour: "14h-15h",
    }
  } catch (error) {
    return {
      totalActions: 0,
      activeUsers: 0,
      peakHour: "N/A",
    }
  }
}

export async function LogsStats() {
  const stats = await getLogsStats()

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total actions</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalActions}</div>
          <p className="text-xs text-muted-foreground">Actions enregistrées</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">Utilisateurs uniques</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Heure de pointe</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.peakHour}</div>
          <p className="text-xs text-muted-foreground">Plus forte activité</p>
        </CardContent>
      </Card>
    </div>
  )
}
