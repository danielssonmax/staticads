"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { Slot } from "@radix-ui/react-slot"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
  onClick?: () => void
  asChild?: boolean
}

export const Button = ({ variant = "default", size = "default", children, className, asChild = false, ...props }: ButtonProps) => {
  const router = useRouter()
  const Comp = asChild ? Slot : "button"

  const sizeClass = size === "sm" ? "px-3 py-1.5 text-sm" : size === "lg" ? "px-6 py-3 text-lg" : "px-4 py-2 text-base"

  const variantClass =
    variant === "outline"
      ? "bg-white text-[#7C3AED] border border-[#7C3AED] hover:bg-[#7C3AED] hover:text-white"
      : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!asChild && props.onClick) {
      props.onClick()
      // Only navigate if not using asChild (Link handles its own navigation)
      if (!props.onClick.toString().includes('setIsDialogOpen') && !props.onClick.toString().includes('setIsSignupOpen')) {
        router.push("/dashboard/ads-library")
      }
    }
  }

  return (
    <Comp className={`${sizeClass} rounded-md ${variantClass} ${className}`} onClick={!asChild ? handleClick : undefined} {...props}>
      {children}
    </Comp>
  )
}

type SelectProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string
  onValueChange?: (value: string) => void
}

export const Select = ({ value, onValueChange, children, className, ...props }: SelectProps) => {
  return (
    <div className={`relative ${className}`} {...props}>
      {children}
    </div>
  )
}

export const SelectTrigger = ({ children, className, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={`w-full py-2 px-3 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const SelectContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`absolute top-full left-0 z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black/5 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const SelectItem = ({
  children,
  value,
  ...props
}: { children: React.ReactNode; value: string } & React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <li className="cursor-pointer hover:bg-gray-100 px-3 py-2" {...props} value={value}>
      {children}
    </li>
  )
}

export const SelectValue = ({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className="block truncate" {...props}>
      {children}
    </span>
  )
}
