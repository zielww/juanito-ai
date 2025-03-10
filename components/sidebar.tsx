"use client"

import { useState } from "react"
import { Search, Calendar, Star, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className={`
      relative bg-white shadow-lg transition-all duration-300 flex flex-col
      ${collapsed ? "w-16" : "w-full md:w-80"}
    `}
    >
      {/* Toggle button */}
      <button
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md z-10 hidden md:block"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* App logo and title */}
      <div className="p-4 border-b flex items-center">
        {collapsed ? (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            J
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
              J4A
            </div>
            <div>
              <h1 className="font-bold text-lg">Juan 4 All</h1>
              <p className="text-xs text-gray-500">Your Personal Travel Companion</p>
            </div>
          </>
        )}
      </div>

      {/* Search bar */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input placeholder="Search destinations..." className="pl-8" />
          </div>
        </div>
      )}

      {/* Tabs content */}
      {!collapsed ? (
        <Tabs defaultValue="explore" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="explore" className="mt-0">
              <h2 className="font-medium mb-3">Popular in San Juan</h2>

              {/* Featured places */}
              <div className="space-y-3">
                {[
                  { name: "Laiya Beach", type: "Beach", rating: 4.8 },
                  { name: "Acuatico Beach Resort", type: "Resort", rating: 4.6 },
                  { name: "Local Seafood Festival", type: "Event", rating: 4.7 },
                ].map((place, i) => (
                  <Card key={i} className="cursor-pointer hover:bg-gray-50">
                    <div className="flex p-3">
                      <div className="w-16 h-16 bg-blue-100 rounded-md mr-3 flex-shrink-0">
                        <img
                          src={`/placeholder.svg?height=64&width=64`}
                          alt={place.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{place.name}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Badge variant="outline" className="mr-2">
                            {place.type}
                          </Badge>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                            <span>{place.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <h2 className="font-medium mt-6 mb-3">Local Products</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Handcrafted Souvenirs", type: "Crafts" },
                  { name: "Fresh Seafood Market", type: "Food" },
                  { name: "Local Coffee", type: "Beverage" },
                  { name: "Batangas Lomi", type: "Food" },
                ].map((product, i) => (
                  <Card key={i} className="cursor-pointer hover:bg-gray-50">
                    <div className="p-3">
                      <div className="w-full h-24 bg-gray-100 rounded-md mb-2">
                        <img
                          src={`/placeholder.svg?height=96&width=120`}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <h3 className="font-medium text-sm">{product.name}</h3>
                      <p className="text-xs text-gray-500">{product.type}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Upcoming Events</h2>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Beach Cleanup Drive", date: "Jun 15", type: "Community" },
                  { name: "Local Food Festival", date: "Jun 22-23", type: "Food" },
                  { name: "Summer Music Festival", date: "Jul 5-7", type: "Entertainment" },
                ].map((event, i) => (
                  <Card key={i} className="cursor-pointer hover:bg-gray-50">
                    <CardHeader className="p-3 pb-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base">{event.name}</CardTitle>
                        <Badge>{event.date}</Badge>
                      </div>
                      <CardDescription>{event.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-2">
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                        <Button size="sm">RSVP</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="saved" className="mt-0">
              <h2 className="font-medium mb-3">Your Saved Places</h2>
              <div className="flex flex-col items-center justify-center h-40 text-center text-gray-500">
                <Info className="h-8 w-8 mb-2 opacity-50" />
                <p>You haven't saved any places yet</p>
                <Button variant="link" className="mt-2">
                  Explore the map
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        <div className="flex flex-col items-center pt-4 space-y-6">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Star className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  )
}

