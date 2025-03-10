"use client"

import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatbotButtonProps {
  onClick: () => void
}

export default function ChatbotButton({ onClick }: ChatbotButtonProps) {
  return (
    <Button onClick={onClick} className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg">
      <MessageSquare className="h-6 w-6" />
    </Button>
  )
}

