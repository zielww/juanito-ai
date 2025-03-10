"use client"

import { useState, useEffect } from "react"
import { Sun, Cloud, CloudRain, Wind, CloudSun, CloudFog, CloudLightning, Snowflake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

// Define weather data interface
interface WeatherData {
  current: {
    temp: number;
    condition: string;
    description: string;
    humidity: number;
    wind: number;
    icon: string;
  };
  forecast: {
    day: string;
    temp_max: number;
    temp_min: number;
    condition: string;
    icon: string;
  }[];
  location: {
    name: string;
    country: string;
  };
  lastUpdated: string;
}

export default function WeatherWidget() {
  const [expanded, setExpanded] = useState(true)
  const [currentTime, setCurrentTime] = useState("")
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // San Juan, Batangas coordinates
  const LAT = 13.7633
  const LON = 121.4042

  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true)
      try {
        // Using OpenWeatherMap API - remove hardcoded key and use environment variable
        const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
        
        if (!apiKey) {
          throw new Error("OpenWeather API key is missing")
        }
        
        // Add error handling and logging for debugging
        console.log("Fetching weather data for San Juan...")
        
        // Current weather - add error handling and timeout
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${apiKey}`,
          { signal: AbortSignal.timeout(10000) }
        ).catch(error => {
          console.error("Error fetching current weather:", error)
          throw new Error("Failed to fetch current weather data")
        })
        
        // 5-day forecast - add error handling and timeout
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&appid=${apiKey}`,
          { signal: AbortSignal.timeout(10000) }
        ).catch(error => {
          console.error("Error fetching forecast:", error)
          throw new Error("Failed to fetch forecast data")
        })
        
        if (!currentResponse.ok) {
          const errorText = await currentResponse.text()
          console.error("Current weather API error:", errorText)
          throw new Error(`Current weather API error: ${currentResponse.status}`)
        }
        
        if (!forecastResponse.ok) {
          const errorText = await forecastResponse.text()
          console.error("Forecast API error:", errorText)
          throw new Error(`Forecast API error: ${forecastResponse.status}`)
        }
        
        const currentData = await currentResponse.json()
        const forecastData = await forecastResponse.json()
        
        console.log("Weather data fetched successfully")
        
        // Process forecast data to get daily forecasts
        const dailyForecasts = processForecastData(forecastData)
        
        // Format the data
        const formattedData: WeatherData = {
          current: {
            temp: Math.round(currentData.main.temp),
            condition: currentData.weather[0].main,
            description: currentData.weather[0].description,
            humidity: currentData.main.humidity,
            wind: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
            icon: currentData.weather[0].icon
          },
          forecast: dailyForecasts,
          location: {
            name: "San Juan",
            country: "PH"
          },
          lastUpdated: new Date().toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          })
        }
        
        setWeatherData(formattedData)
      } catch (error) {
        console.error("Error fetching weather data:", error)
        
        // Fallback to sample data if API fails
        setWeatherData({
          current: {
            temp: 32,
            condition: "Clear",
            description: "clear sky",
            humidity: 65,
            wind: 12,
            icon: "01d"
          },
          forecast: [
            { day: "Today", temp_max: 32, temp_min: 28, condition: "Clear", icon: "01d" },
            { day: "Tomorrow", temp_max: 31, temp_min: 27, condition: "Clouds", icon: "02d" },
            { day: "Wed", temp_max: 30, temp_min: 26, condition: "Clouds", icon: "03d" },
            { day: "Thu", temp_max: 29, temp_min: 25, condition: "Rain", icon: "10d" },
            { day: "Fri", temp_max: 30, temp_min: 26, condition: "Clouds", icon: "02d" },
          ],
          location: {
            name: "San Juan",
            country: "PH"
          },
          lastUpdated: new Date().toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          })
        })
        
        toast({
          title: "Using offline weather data",
          description: "Could not load live weather information. Showing estimated data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchWeatherData()
    
    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [toast])

  // Process forecast data to get daily forecasts
  const processForecastData = (forecastData: any) => {
    const dailyData: { [key: string]: any[] } = {}
    
    // Group forecast data by day
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000)
      const day = date.toLocaleDateString('en-US', { weekday: 'short' })
      
      if (!dailyData[day]) {
        dailyData[day] = []
      }
      
      dailyData[day].push({
        temp: item.main.temp,
        temp_max: item.main.temp_max,
        temp_min: item.main.temp_min,
        condition: item.weather[0].main,
        icon: item.weather[0].icon
      })
    })
    
    // Get min/max temps and most common condition for each day
    return Object.entries(dailyData).map(([day, items]) => {
      const temps = items.map(item => item.temp)
      const maxTemp = Math.round(Math.max(...items.map(item => item.temp_max)))
      const minTemp = Math.round(Math.min(...items.map(item => item.temp_min)))
      
      // Get most common condition
      const conditionCounts: { [key: string]: number } = {}
      items.forEach(item => {
        conditionCounts[item.condition] = (conditionCounts[item.condition] || 0) + 1
      })
      
      const mostCommonCondition = Object.entries(conditionCounts)
        .sort((a, b) => b[1] - a[1])[0][0]
      
      // Get most common icon for that condition
      const iconsForCondition = items
        .filter(item => item.condition === mostCommonCondition)
        .map(item => item.icon)
      
      const mostCommonIcon = iconsForCondition[Math.floor(iconsForCondition.length / 2)]
      
      return {
        day,
        temp_max: maxTemp,
        temp_min: minTemp,
        condition: mostCommonCondition,
        icon: mostCommonIcon
      }
    }).slice(0, 5) // Limit to 5 days
  }

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
    switch (condition.toLowerCase()) {
      case "clear":
        return <Sun className="h-5 w-5 text-yellow-500" />
      case "partly cloudy":
      case "few clouds":
      case "scattered clouds":
        return <CloudSun className="h-5 w-5 text-gray-400" />
      case "clouds":
      case "broken clouds":
      case "overcast clouds":
        return <Cloud className="h-5 w-5 text-gray-500" />
      case "rain":
      case "light rain":
      case "moderate rain":
      case "shower rain":
        return <CloudRain className="h-5 w-5 text-blue-500" />
      case "thunderstorm":
        return <CloudLightning className="h-5 w-5 text-purple-500" />
      case "snow":
        return <Snowflake className="h-5 w-5 text-blue-200" />
      case "mist":
      case "fog":
      case "haze":
        return <CloudFog className="h-5 w-5 text-gray-400" />
      default:
        return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  // Get weather icon based on OpenWeatherMap icon code
  const getWeatherIconFromCode = (iconCode: string) => {
    // Map icon codes to conditions
    const iconMap: { [key: string]: string } = {
      "01d": "clear",
      "01n": "clear",
      "02d": "partly cloudy",
      "02n": "partly cloudy",
      "03d": "clouds",
      "03n": "clouds",
      "04d": "clouds",
      "04n": "clouds",
      "09d": "rain",
      "09n": "rain",
      "10d": "rain",
      "10n": "rain",
      "11d": "thunderstorm",
      "11n": "thunderstorm",
      "13d": "snow",
      "13n": "snow",
      "50d": "mist",
      "50n": "mist"
    }
    
    return getWeatherIcon(iconMap[iconCode] || "clear")
  }

  if (loading) {
    return (
      <Card className="w-64">
        <CardContent className="p-3">
          <div className="flex justify-between items-center mb-3">
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-16" />
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-3 w-10 mb-1" />
                <Skeleton className="h-5 w-5 rounded-full my-1" />
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`transition-all duration-300 ${expanded ? "w-64" : "w-auto"} absolute z-10 left-4 top-12`}>
      <CardContent className="p-3">
        {expanded && weatherData ? (
          <div>
            {/* Expanded view */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <h3 className="font-medium">{weatherData.location.name}, {weatherData.location.country}</h3>
                <p className="text-xs text-gray-500">Updated: {weatherData.lastUpdated}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setExpanded(false)}>
                <span>×</span>
              </Button>
            </div>

            {/* Current weather */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {weatherData.current.icon ? 
                  getWeatherIconFromCode(weatherData.current.icon) : 
                  getWeatherIcon(weatherData.current.condition)}
                <span className="text-2xl ml-2">{weatherData.current.temp}°C</span>
              </div>
              <div className="text-xs text-gray-500">
                <div>Humidity: {weatherData.current.humidity}%</div>
                <div className="flex items-center">
                  <Wind className="h-3 w-3 mr-1" />
                  {weatherData.current.wind} km/h
                </div>
              </div>
            </div>

            {/* Forecast */}
            <div className="grid grid-cols-5 gap-1 text-center text-xs">
              {weatherData.forecast.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-gray-600">{day.day}</span>
                  <div className="my-1">
                    {day.icon ? 
                      getWeatherIconFromCode(day.icon) : 
                      getWeatherIcon(day.condition)}
                  </div>
                  <span>{day.temp_max}°/{day.temp_min}°</span>
                </div>
              ))}
            </div>
          </div>
        ) : weatherData ? (
          // Collapsed view
          <Button variant="ghost" className="flex items-center p-2" onClick={() => setExpanded(true)}>
            {weatherData.current.icon ? 
              getWeatherIconFromCode(weatherData.current.icon) : 
              getWeatherIcon(weatherData.current.condition)}
            <span className="ml-2">{weatherData.current.temp}°C</span>
          </Button>
        ) : (
          // Fallback if no data
          <Button variant="ghost" className="flex items-center p-2" onClick={() => setExpanded(true)}>
            <Cloud className="h-5 w-5 text-gray-400" />
            <span className="ml-2">Weather</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}


