"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface ChatbotDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface Message {
  role: "user" | "bot"
  content: string
}

// Sample chatbot messages
const INITIAL_MESSAGES: Message[] = [
  {
    role: "bot",
    content: "Hello! I'm Juanito, your virtual guide to San Juan, Batangas. How can I help you explore our beautiful town today?",
  },
]

// Sample suggestions
const SUGGESTIONS = [
  "What are the best beaches to visit?",
  "Recommend a good restaurant",
  "Tell me about Laiya Beach",
  "What activities are available?",
  "Show me the weather forecast",
  "When is the town fiesta?",
]

// Knowledge base about San Juan, Batangas
const SAN_JUAN_INFO = {
  location: "San Juan is a municipality in the province of Batangas, Philippines. It is located on the southwestern part of Luzon island.",
  beaches: "San Juan is known for its beautiful beaches, particularly in the Laiya area. Popular beaches include Laiya Beach, White Beach, and Calubcub Bay.",
  activities: "Visitors can enjoy swimming, snorkeling, diving, island hopping, hiking, and various water sports in San Juan.",
  food: "Local delicacies include lomi (a noodle soup), Batangas beef, and fresh seafood. Popular restaurants include Lomihan sa Pulang Bato and Kuya Oliver's Gotohan.",
  culture: "San Juan celebrates its town fiesta on June 24, honoring St. John the Baptist. The town has a rich cultural heritage with Spanish influences.",
  accommodation: "There are various resorts and hotels in San Juan, particularly in Laiya, such as Acuatico Beach Resort, La Luz Beach Resort, and One Laiya.",
  transportation: "San Juan is accessible by bus from Manila, with a travel time of approximately 3-4 hours.",
  weather: "San Juan has a tropical climate with a dry season from November to May and a wet season from June to October.",
  products: "Local products include Batangas coffee, lambanog (coconut wine), and various handicrafts.",
}

export default function ChatbotDialog({ isOpen, onClose }: ChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Reset chat when closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setMessages(INITIAL_MESSAGES)
      }, 300)
    }
  }, [isOpen])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message to chat
    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Call Google Gemini API
      const response = await fetchGeminiResponse(input, messages);
      
      // Add bot response to chat
      const botMessage: Message = { role: "bot", content: response };
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 500); // Small delay for natural feel
    } catch (error) {
      console.error("Error fetching response:", error);
      setIsTyping(false);
      setIsLoading(false);
      
      // Add error message
      const errorMessage: Message = {
        role: "bot",
        content: "I'm sorry, I'm having trouble connecting right now. Please try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Connection Error",
        description: "Could not connect to Juanito's brain. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Fetch response from Google Gemini API
  const fetchGeminiResponse = async (userInput: string, chatHistory: Message[]): Promise<string> => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chatHistory, { role: 'user', content: userInput }]
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error fetching response:', error);
      throw error;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    // Optional: automatically send the suggestion
    // setInput("")
    // setMessages(prev => [...prev, { role: "user", content: suggestion }])
    // handleSendMessage()
  }

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-blue-600" />
            Juanito - San Juan Guide
          </DialogTitle>
        </DialogHeader>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 mb-4 min-h-[300px]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                className="text-xs bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-700 transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="flex items-center space-x-2 p-4 pt-0">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about San Juan..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

