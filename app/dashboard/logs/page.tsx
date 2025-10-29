import { Suspense } from "react"
import { LogsList } from "@/components/logs/logs-list"
import { LogsHeader } from "@/components/logs/logs-header"
import { LogsStats } from "@/components/logs/logs-stats"

export const dynamic = 'force-dynamic'

export default function LogsPage() {
  return (
    <div className="flex flex-col gap-6">
      <LogsHeader />
      <Suspense fallback={<div>Chargement des statistiques...</div>}>
        <LogsStats />
      </Suspense>
      <Suspense fallback={<div>Chargement des logs...</div>}>
        <LogsList />
      </Suspense>
    </div>
  )
}
