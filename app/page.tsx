"use client"

import { useState } from "react"
import Map from "@/components/map"
import Sidebar from "@/components/sidebar"
import ChatbotButton from "@/components/chatbot-button"
import ChatbotDialog from "@/components/chatbot-dialog"
import BeachRulesPopup from "@/components/beach-rules-popup"
import WeatherWidget from "@/components/weather-widget"

export default function HomePage() {
  const [showChatbot, setShowChatbot] = useState(false)
  const [showRules, setShowRules] = useState(true)

  return (
    <main className="flex h-screen w-full overflow-hidden bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Beach Rules Popup */}
      {showRules && <BeachRulesPopup onClose={() => setShowRules(false)} />}

      <div className="flex flex-col md:flex-row w-full h-full">
        {/* Sidebar with filters and info */}
        <Sidebar />

        {/* Main map area */}
        <div className="relative flex-1 h-full">
          <Map />

          {/* Weather widget */}
          <div className="absolute top-4 right z-10">
            <WeatherWidget />
          </div>

          {/* Chatbot button */}
          <div className="absolute bottom-6 right-6 z-10">
            <ChatbotButton onClick={() => setShowChatbot(true)} />
          </div>
        </div>
      </div>

      {/* Chatbot dialog */}
      <ChatbotDialog isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
    </main>
  )
}

