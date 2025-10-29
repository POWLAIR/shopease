"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  ShoppingCart,
  ShoppingBag,
  CreditCard,
  Truck,
  Tag,
  Star,
  FileText,
  Settings,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Vue d'ensemble",
    items: [{ title: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Catalogue",
    items: [
      { title: "Produits", href: "/dashboard/products", icon: Package },
      { title: "Catégories", href: "/dashboard/categories", icon: FolderTree },
    ],
  },
  {
    title: "Clients",
    items: [{ title: "Clients", href: "/dashboard/clients", icon: Users }],
  },
  {
    title: "Ventes",
    items: [
      { title: "Paniers", href: "/dashboard/carts", icon: ShoppingCart },
      { title: "Commandes", href: "/dashboard/orders", icon: ShoppingBag },
      { title: "Paiements", href: "/dashboard/payments", icon: CreditCard },
      { title: "Livraisons", href: "/dashboard/deliveries", icon: Truck },
    ],
  },
  {
    title: "Marketing",
    items: [{ title: "Promotions", href: "/dashboard/promotions", icon: Tag }],
  },
  {
    title: "Données",
    items: [
      { title: "Avis", href: "/dashboard/reviews", icon: Star },
      { title: "Logs", href: "/dashboard/logs", icon: FileText },
    ],
  },
  {
    title: "Système",
    items: [{ title: "Paramètres", href: "/dashboard/settings", icon: Settings }],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-lg font-bold">L</span>
          </div>
          <span className="text-xl font-bold">Looping</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
