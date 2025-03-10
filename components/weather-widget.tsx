"use client"

import { useState, useEffect } from "react"
import { Sun, Cloud, CloudRain, Wind } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Sample weather data
const WEATHER_DATA = {
  current: {
    temp: 32,
    condition: "sunny",
    humidity: 65,
    wind: 12,
  },
  forecast: [
    { day: "Today", temp: 32, condition: "sunny" },
    { day: "Tomorrow", temp: 31, condition: "partly-cloudy" },
    { day: "Wed", temp: 30, condition: "cloudy" },
    { day: "Thu", temp: 29, condition: "rainy" },
    { day: "Fri", temp: 30, condition: "partly-cloudy" },
  ],
}

export default function WeatherWidget() {
  const [expanded, setExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "partly-cloudy":
        return <Cloud className="h-5 w-5 text-gray-400" />
      case "cloudy":
        return <Cloud className="h-5 w-5 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <Card className={`transition-all duration-300 ${expanded ? "w-64" : "w-auto"}`}>
      <CardContent className="p-3">
        {expanded ? (
          <div>
            {/* Expanded view */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-medium">San Juan, Batangas</h3>
                <p className="text-xs text-gray-500">{currentTime}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setExpanded(false)}>
                <span>×</span>
              </Button>
            </div>

            {/* Current weather */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {getWeatherIcon(WEATHER_DATA.current.condition)}
                <span className="text-2xl ml-2">{WEATHER_DATA.current.temp}°C</span>
              </div>
              <div className="text-xs text-gray-500">
                <div>Humidity: {WEATHER_DATA.current.humidity}%</div>
                <div className="flex items-center">
                  <Wind className="h-3 w-3 mr-1" />
                  {WEATHER_DATA.current.wind} km/h
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="grid grid-cols-5 gap-1 text-center text-xs">
              {WEATHER_DATA.forecast.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-gray-600">{day.day}</span>
                  <div className="my-1">{getWeatherIcon(day.condition)}</div>
                  <span>{day.temp}°</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Collapsed view
          <Button variant="ghost" className="flex items-center p-2" onClick={() => setExpanded(true)}>
            {getWeatherIcon(WEATHER_DATA.current.condition)}
            <span className="ml-2">{WEATHER_DATA.current.temp}°C</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

