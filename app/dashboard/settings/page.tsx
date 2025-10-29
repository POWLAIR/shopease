import { Suspense } from "react"
import { SettingsHeader } from "@/components/settings/settings-header"
import { ApiHealthStatus } from "@/components/settings/api-health-status"

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <SettingsHeader />
      <Suspense fallback={<div>Chargement...</div>}>
        <ApiHealthStatus />
      </Suspense>
    </div>
  )
}
