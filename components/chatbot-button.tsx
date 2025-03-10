"use client"

import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

interface ChatbotButtonProps {
  onClick: () => void
}

export default function ChatbotButton({ onClick }: ChatbotButtonProps) {
  const [inputFocused, setInputFocused] = useState(false)

  return (
    <div className="flex items-center gap-2 bg-white rounded-full shadow-lg p-2 w-full max-w-md">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-10 w-10 flex-shrink-0"
        onClick={onClick}
      >
        <MessageSquare className="h-5 w-5 text-blue-600" />
      </Button>
      
      <Input
        placeholder="Ask Juanito about San Juan..."
        className={`w-96 border-none focus-visible:ring-0 focus-visible:ring-offset-0 ${inputFocused ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        onClick={onClick}
        readOnly
      />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-10 w-10 flex-shrink-0 text-blue-600 hover:bg-blue-50"
        onClick={onClick}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  )
}

