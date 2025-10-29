import type React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-6 md:p-8">{children}</main>
          <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
            ShopEase Dashboard - Efrei 2025
          </footer>
        </div>
      </div>
    </SidebarProvider>
  )
}
