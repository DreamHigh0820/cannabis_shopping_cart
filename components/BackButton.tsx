"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  to?: string
  className?: string
  children?: React.ReactNode
}

export default function BackButton({ 
  to, 
  className = "mb-4",
  children 
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (to) {
      router.push(to)
    } else {
      router.back()
    }
  }

  return (
    <Button variant="outline" onClick={handleClick} className={className}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      {children || "Back"}
    </Button>
  )
}