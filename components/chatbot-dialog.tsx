"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface ChatbotDialogProps {
  isOpen: boolean
  onClose: () => void
}

// Sample chatbot messages
const INITIAL_MESSAGES = [
  {
    role: "bot",
    content: "Hello! I'm your Juanito. How can I help you explore San Juan, Batangas today?",
  },
]

// Sample suggestions
const SUGGESTIONS = [
  "What are the best beaches to visit?",
  "Recommend a good restaurant",
  "What activities are available?",
  "Show me the weather forecast",
]

export default function ChatbotDialog({ isOpen, onClose }: ChatbotDialogProps) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: input }])
    setInput("")

    // Simulate bot typing
    setIsTyping(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      let response = ""

      // Simple pattern matching for demo purposes
      if (input.toLowerCase().includes("beach")) {
        response =
          "Laiya Beach is the most popular beach in San Juan. It has crystal clear waters and white sand. The current occupancy is medium, so it's a good time to visit!"
      } else if (input.toLowerCase().includes("restaurant") || input.toLowerCase().includes("food")) {
        response =
          "I recommend trying the local seafood restaurants near Laiya Beach. They serve fresh catch of the day and traditional Batangas dishes."
      } else if (input.toLowerCase().includes("weather")) {
        response = "The weather in San Juan today is sunny with a high of 32°C. Perfect beach weather!"
      } else if (input.toLowerCase().includes("activit")) {
        response =
          "Popular activities in San Juan include swimming, snorkeling, island hopping, and beach volleyball. Many resorts also offer water sports equipment rentals."
      } else {
        response =
          "I'd be happy to help you explore San Juan! You can ask me about beaches, restaurants, activities, or the weather."
      }

      setMessages((prev) => [...prev, { role: "bot", content: response }])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-blue-600" />
            Juanito
          </DialogTitle>
        </DialogHeader>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`
                    max-w-[80%] rounded-lg px-4 py-2
                    ${
                      message.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none"
                    }
                  `}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg rounded-tl-none max-w-[80%] px-4 py-2">
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Suggestions */}
        {messages.length < 3 && (
          <div className="px-4 py-2 border-t">
            <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setInput(suggestion)
                    setMessages((prev) => [...prev, { role: "user", content: suggestion }])

                    // Simulate bot typing
                    setIsTyping(true)

                    // Simulate bot response after a delay
                    setTimeout(() => {
                      let response = ""

                      if (suggestion.includes("beaches")) {
                        response =
                          "The best beaches in San Juan are Laiya Beach, Sabangan Beach, and White Beach. Laiya is the most developed with resorts and facilities."
                      } else if (suggestion.includes("restaurant")) {
                        response =
                          "For authentic local cuisine, try Laiya Coco Grove or any of the seafood restaurants along the beach. The grilled fish and Batangas Lomi are must-tries!"
                      } else if (suggestion.includes("activities")) {
                        response =
                          "You can enjoy swimming, snorkeling, jet skiing, banana boat rides, and island hopping tours. Many resorts also offer kayaking and paddleboarding."
                      } else if (suggestion.includes("weather")) {
                        response =
                          "The weather in San Juan today is sunny with a high of 32°C and a low of 26°C. The water temperature is around 28°C, perfect for swimming!"
                      }

                      setMessages((prev) => [...prev, { role: "bot", content: response }])
                      setIsTyping(false)
                      setInput("")
                    }, 1500)
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <DialogFooter className="flex-shrink-0 border-t pt-2">
          <form
            className="flex w-full items-center space-x-2"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

