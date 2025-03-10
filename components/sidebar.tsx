"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Star, Info, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ChatbotButton from "@/components/chatbot-button"

// Import the Place interface and POPULAR_PLACES array
interface Place {
  id: string
  name: string
  type: string
  lat: number
  lng: number
  occupancy?: string
  description?: string
  rating?: number
  address?: string
}

// Sample places data (this would normally be imported from map.tsx)
const POPULAR_PLACES: Place[] = [
  {
    id: "laiya-beach",
    name: "Laiya Beach",
    type: "beach", 
    lat: 13.6633,
    lng: 121.4353,
    occupancy: "high",
    description: "Laiya Beach is one of the most popular beaches in San Juan, Batangas. Known for its white sand and clear waters, it's a favorite weekend getaway for locals and tourists.",
    rating: 4.7,
    address: "Laiya, San Juan, Batangas"
  },
  {
    id: "white-beach",
    name: "White Beach",
    type: "beach",
    lat: 13.6727,
    lng: 121.3867,
    occupancy: "medium",
    description: "A pristine white sand beach with crystal clear waters, perfect for swimming and snorkeling.",
    rating: 4.5,
    address: "Laiya, San Juan, Batangas"
  },
  {
    id: "acuatico-beach-resort",
    name: "Acuatico Beach Resort",
    type: "hotel",
    lat: 13.6651,
    lng: 121.3731,
    occupancy: "high",
    description: "A luxury beach resort with infinity pools overlooking the ocean, offering premium accommodations and amenities.",
    rating: 4.8,
    address: "Laiya, San Juan, Batangas"
  },
  {
    id: "la-luz-beach-resort",
    name: "La Luz Beach Resort",
    type: "hotel",
    lat: 13.6853,
    lng: 121.4262,
    occupancy: "medium",
    description: "A cozy beach resort with comfortable cottages and a relaxing atmosphere.",
    rating: 4.5,
    address: "Laiya, San Juan, Batangas"
  },
  {
    id: "one-laiya",
    name: "One Laiya",
    type: "hotel",
    lat: 13.6664,
    lng: 121.4083,
    occupancy: "medium",
    description: "A cozy cafe offering coffee, pastries, and light meals with a view of the beach.",
    rating: 4.4,
    address: "Laiya, San Juan, Batangas"
  },
  {
    id: "calubcub",
    name: "Calubcub Bay Resort",
    type: "resort",
    lat: 13.7623,
    lng: 121.4326,
    occupancy: "medium",
    description: "A historic resort with beautiful beachfront views",
    rating: 4.5,
    address: "San Juan, Batangas"
  },
  {
    id: "lomian-sa-pulang-bato",
    name: "Lomihan sa Pulang Bato",
    type: "dining",
    lat: 13.7695,
    lng: 121.4166,
    occupancy: "low",
    description: "A restaurant with beautiful and tasty lomi",
    rating: 4.6,
    address: "Malabrigo, San Juan, Batangas"
  },
  {
    id: "oliver-gotohan",
    name: "Kuya Olivers Gotohan",
    type: "dining",
    lat: 13.8198,
    lng: 121.3995,
    occupancy: "high",
    description: "A restaurant with delicious and affordable food",
    rating: 4.2,
    address: "San Juan, Batangas"
  },
  {
    id: "san-juan-public-market",
    name: "San Juan Public Market",
    type: "establishment",
    lat: 13.8243,
    lng: 121.3923,
    occupancy: "high",
    description: "A bustling local market selling fresh produce, seafood, and various goods.",
    rating: 4.1,
    address: "San Juan, Batangas"
  }
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Place[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)

  // Function to search places
  const searchPlaces = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    const results = POPULAR_PLACES.filter(place => 
      place.name.toLowerCase().includes(normalizedQuery) || 
      place.type.toLowerCase().includes(normalizedQuery) ||
      (place.address && place.address.toLowerCase().includes(normalizedQuery)) ||
      (place.description && place.description.toLowerCase().includes(normalizedQuery))
    );
    
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchPlaces(query);
  };

  // Handle place selection
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setShowSearchResults(false);
    
    // Dispatch a custom event to notify the map component
    const event = new CustomEvent('placeSelected', { detail: place });
    window.dispatchEvent(event);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

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
              <h1 className="font-bold text-lg">Juanito</h1>
              <p className="text-xs text-gray-500">Personal Travel Companion</p>
            </div>
          </>
        )}
      </div>

      {/* Search bar */}
      {!collapsed && (
        <div className="p-4 border-b relative">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search places in San Juan..." 
              className="pl-8 pr-8" 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button 
                className="absolute right-2 top-2.5"
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
          
          {/* Search results dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-4 right-4 top-[calc(100%-8px)] bg-white rounded-md shadow-lg z-20 max-h-64 overflow-y-auto">
              <div className="p-2">
                <p className="text-xs text-gray-500 mb-2">Found {searchResults.length} places</p>
                {searchResults.map((place) => (
                  <div 
                    key={place.id}
                    className="p-2 hover:bg-gray-50 rounded cursor-pointer"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{place.name}</p>
                        <p className="text-xs text-gray-500">{place.address}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* No results message */}
          {showSearchResults && searchQuery && searchResults.length === 0 && (
            <div className="absolute left-4 right-4 top-[calc(100%-8px)] bg-white rounded-md shadow-lg z-20">
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">No places found for "{searchQuery}"</p>
              </div>
            </div>
          )}
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
                  {
                    name: "Laiya Beach",
                    type: "Beach",
                    rating: 4.7,
                    description: "Known for its white sand and clear waters, it's a favorite weekend getaway.",
                    image: "/images/laiya-beach.jpg"
                  },
                  {
                    name: "Acuatico Beach Resort",
                    type: "Resort",
                    rating: 4.8,
                    description: "A luxury beach resort with infinity pools overlooking the ocean.",
                    image: "/images/acuatico-beach-resort.jpg"
                  },
                  {
                    name: "San Juan Public Market",
                    type: "Market",
                    rating: 4.1,
                    description: "A bustling local market selling fresh produce, seafood, and various goods.",
                    image: "/images/san-juan-public-market.jpg"
                  }
                ].map((place, i) => (
                  <Card key={i} className="cursor-pointer hover:bg-gray-50">
                    <div className="flex p-3">
                      <div className="w-16 h-16 bg-blue-100 rounded-md mr-3 flex-shrink-0">
                        <img
                          src={place.image}
                          alt={place.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{place.name}</h3>
                        <p className="text-sm text-gray-500">{place.description}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
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
                  { name: "Palayok", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJNFLZxEsaWk6GlQsoZtmyPEoD6WqTQanHQ&s", type: "Crafts" },
                  { name: "Lambanog", image: "https://manila-wine.com/media/catalog/product/cache/ab779e9c28832bdb1d1b6d48074ac569/s/a/san_juan.jpg", type: "Beverage" },
                  { name: "Suman", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQePnsQUXDL1jYsqHwpeupgwt9HgiQ-af1DXw&s", type: "Food" },
                  { name: "Tablea", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRzUXPtVVRaXT3kKGjFP3iHqGKbnIkubQNow&s",  type: "Food" },
                ].map((product, i) => (
                  <Card key={i} className="cursor-pointer hover:bg-gray-50">
                    <div className="p-3">
                      <div className="w-full h-24 bg-gray-100 rounded-md mb-2">
                        <img
                          src={product.image}
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

      {/* Add this at the bottom of your sidebar, just before the closing div */}
      <div className={`p-4 border-t ${collapsed ? "hidden" : "block"}`}>
        <ChatbotButton onClick={() => {}} />
      </div>
    </div>
  )
}

