import type React from "react"
import { ClientSidebar, ClientHeader } from "./dashboard-client-components"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      <ClientSidebar />
      <div className="flex-1">
        <ClientHeader />
        <main className="min-h-[calc(100vh-3.5rem)] overflow-auto">{children}</main>
      </div>
    </div>
  )
}
