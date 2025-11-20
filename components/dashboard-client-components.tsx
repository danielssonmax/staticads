"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutGrid, Search, Bookmark, FolderHeart, HelpCircle, Twitter, Menu, CreditCard } from "lucide-react"

export const ClientSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const sidebarItems = [
    {
      title: "Templates",
      icon: LayoutGrid,
      href: "/dashboard/ads-library",
      active: true,
    },
    {
      title: "Explore",
      icon: Search,
      href: "/dashboard/explore",
      badge: "Coming soon",
    },
    {
      title: "All Saved",
      icon: Bookmark,
      href: "/dashboard/saved",
    },
    {
      title: "Collections",
      icon: FolderHeart,
      href: "/dashboard/collections",
      badge: "Coming soon",
    },
    {
      title: "Subscription",
      icon: CreditCard,
      href: "/dashboard/subscription",
    },
  ]

  const bottomItems = [
    {
      title: "FAQ & Support",
      icon: HelpCircle,
      href: "/support",
    },
    {
      title: "Follow @staticadtemplates",
      icon: Twitter,
      href: "https://twitter.com/staticflowio",
    },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white border-r z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/staticads-logo.png"
              alt="staticads logo"
              width={180}
              height={60}
              className="h-10 w-auto"
            />
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                item.active ? "bg-purple-100 text-purple-900" : "text-gray-600 hover:bg-gray-100",
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
              {item.badge && <span className="ml-auto text-xs bg-gray-100 px-2 py-0.5 rounded-full">{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t space-y-1">
          {bottomItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <item.icon className="w-5 h-5" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export const ClientHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <div className="h-14 border-b flex items-center justify-between px-4 lg:px-6">
      <Button variant="outline" size="sm" className="lg:hidden p-2" onClick={() => setIsSidebarOpen(true)}>
        <Menu className="w-5 h-5" />
      </Button>
    </div>
  )
}
