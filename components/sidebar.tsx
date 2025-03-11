"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, Star, Info, ChevronLeft, ChevronRight, MapPin, X, ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import ChatbotButton from "@/components/chatbot-button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

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
  date?: string
  time?: string
  endDate?: string
  organizer?: string
  recurring?: string
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

// Add local products data to POPULAR_PLACES
const LOCAL_PRODUCTS: Place[] = [
  {
    id: "palayok",
    name: "Palayok",
    type: "crafts",
    lat: 13.8243, // Near the public market
    lng: 121.3923,
    description: "Traditional clay pots handcrafted by local artisans. Used for cooking Filipino dishes like sinigang and adobo.",
    rating: 4.3,
    address: "San Juan Public Market, San Juan, Batangas"
  },
  {
    id: "lambanog",
    name: "Lambanog",
    type: "beverage",
    lat: 13.8243, // Near the public market
    lng: 121.3923,
    description: "A traditional Filipino alcoholic beverage made from coconut sap. Known for its potent flavor and high alcohol content.",
    rating: 4.6,
    address: "San Juan Public Market, San Juan, Batangas"
  },
  {
    id: "suman",
    name: "Suman",
    type: "food",
    lat: 13.8243, // Near the public market
    lng: 121.3923,
    description: "A rice cake made from glutinous rice cooked in coconut milk, wrapped in banana leaves. A popular Filipino delicacy.",
    rating: 4.5,
    address: "San Juan Public Market, San Juan, Batangas"
  },
  {
    id: "tablea",
    name: "Tablea",
    type: "food",
    lat: 13.8243, // Near the public market
    lng: 121.3923,
    description: "Pure cacao tablets used to make traditional Filipino hot chocolate (tsokolate). Rich and bittersweet in flavor.",
    rating: 4.4,
    address: "San Juan Public Market, San Juan, Batangas"
  }
];

// Enhanced events data with proper dates
const EVENTS: Place[] = [
  {
    id: "beach-cleanup",
    name: "Beach Cleanup Drive🏖️",
    type: "event",
    lat: 13.6633, // Laiya Beach
    lng: 121.4353,
    description: "Join the community in cleaning up Laiya Beach. Bring gloves and water. Snacks will be provided. Help preserve the beauty of our beaches!",
    rating: 4.9,
    address: "Laiya Beach, San Juan, Batangas",
    date: "2025-06-15", // ISO format for easier date handling
    time: "7:00 AM - 11:00 AM",
    organizer: "San Juan Environmental Council"
  },
  {
    id: "food-festival",
    name: "Scuba Diving🤿",
    type: "event",
    lat: 13.6633, // Public Market
    lng: 121.4353,
    description: "Experience the underwater world of San Juan",
    rating: 4.8,
    address: "Laiya Beach, San Juan, Batangas",
    date: "2025-06-22", // First day
    endDate: "2025-06-23", // Last day
    time: "9:00 AM - 9:00 PM",
    organizer: "San Juan Tourism Office"
  },
  {
    id: "music-festival",
    name: "Mangrove Planting",
    type: "event",
    lat: 13.7623, // Town center
    lng: 121.4326,
    description: "Three days of planting mangroves in San Juan",
    rating: 4.7,
    address: "Acuatico Beach Resort, San Juan, Batangas",
    date: "2025-07-05", // First day
    endDate: "2025-07-07", // Last day
    time: "4:00 PM - 12:00 AM",
    organizer: "San Juan Cultural Committee"
  },
  {
    id: "fiesta-san-juan",
    name: "Fiesta San Juan",
    type: "event",
    lat: 13.8243, // Town center
    lng: 121.3923,
    description: "Annual town fiesta celebrating the feast day of St. John the Baptist. Includes religious processions, cultural performances, and traditional games.",
    rating: 4.9,
    address: "San Juan Town Plaza, San Juan, Batangas",
    date: "2023-05-16", // Feast of St. John the Baptist
    time: "All Day",
    organizer: "San Juan Parish Church"
  },
  {
    id: "surfing-competition",
    name: "Laiya Surfing Cup",
    type: "event",
    lat: 13.6633, // Laiya Beach
    lng: 121.4353,
    description: "Annual surfing competition featuring local and national surfers. Categories include shortboard, longboard, and bodyboard divisions.",
    rating: 4.6,
    address: "Laiya Beach, San Juan, Batangas",
    date: "2025-08-12",
    endDate: "2023-08-13",
    time: "7:00 AM - 5:00 PM",
    organizer: "Batangas Surfing Association"
  },
  {
    id: "farmers-market",
    name: "Organic Farmers Market",
    type: "event",
    lat: 13.8243, // Public Market
    lng: 121.3923,
    description: "Weekly market featuring organic produce, handcrafted goods, and local delicacies from San Juan farmers and artisans.",
    rating: 4.5,
    address: "San Juan Public Market, San Juan, Batangas",
    date: "2025-06-10", // Recurring event
    recurring: "weekly",
    time: "6:00 AM - 12:00 PM",
    organizer: "San Juan Farmers Cooperative"
  },
  {
    id: "art-exhibit",
    name: "Batangas Art Exhibition",
    type: "event",
    lat: 13.7633, // Town center
    lng: 121.4042,
    description: "Art exhibition showcasing works by local artists from San Juan and surrounding areas. Paintings, sculptures, and photography inspired by local culture and landscapes.",
    rating: 4.4,
    address: "San Juan Community Center, San Juan, Batangas",
    date: "2025-07-15",
    endDate: "2023-07-30",
    time: "10:00 AM - 6:00 PM",
    organizer: "Batangas Artists Collective"
  }
];

// Combine all places for search
const ALL_PLACES = [...POPULAR_PLACES, ...LOCAL_PRODUCTS, ...EVENTS];

// Helper function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Helper function to get month name
const getMonthName = (month: number) => {
  const date = new Date();
  date.setMonth(month);
  return date.toLocaleString('en-US', { month: 'long' });
};

// Calendar component
function EventCalendar({ events, onSelectEvent }: { events: any[], onSelectEvent: (event: any) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };
  
  // Navigate to previous month
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };
  
  // Navigate to next month
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };
  
  // Check if date has events
  const hasEvents = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.some(event => {
      // Check if event is on this date
      if (event.date === dateString) return true;
      
      // Check if event spans multiple days
      if (event.endDate) {
        const startDate = new Date(event.date);
        const endDate = new Date(event.endDate);
        const checkDate = new Date(dateString);
        return checkDate >= startDate && checkDate <= endDate;
      }
      
      // Check if event is recurring weekly
      if (event.recurring === 'weekly') {
        const eventDate = new Date(event.date);
        const checkDate = new Date(dateString);
        return eventDate.getDay() === checkDate.getDay();
      }
      
      return false;
    });
  };
  
  // Get events for selected date
  const getEventsForDate = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => {
      // Check if event is on this date
      if (event.date === dateString) return true;
      
      // Check if event spans multiple days
      if (event.endDate) {
        const startDate = new Date(event.date);
        const endDate = new Date(event.endDate);
        const checkDate = new Date(dateString);
        return checkDate >= startDate && checkDate <= endDate;
      }
      
      // Check if event is recurring weekly
      if (event.recurring === 'weekly') {
        const eventDate = new Date(event.date);
        const checkDate = new Date(dateString);
        return eventDate.getDay() === checkDate.getDay();
      }
      
      return false;
    });
  };
  
  // Handle date selection
  const handleDateClick = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateString);
  };
  
  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = new Date().toISOString().split('T')[0] === dateString;
      const isSelected = selectedDate === dateString;
      const hasEventOnDay = hasEvents(day);
      
      days.push(
        <div 
          key={day} 
          className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer relative
            ${isToday ? 'bg-blue-100 text-blue-800' : ''}
            ${isSelected ? 'bg-blue-600 text-white' : ''}
            ${!isToday && !isSelected && hasEventOnDay ? 'font-bold' : ''}
            ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
          `}
          onClick={() => handleDateClick(day)}
        >
          {day}
          {hasEventOnDay && !isSelected && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
          )}
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <div className="bg-white rounded-lg p-4">
      {/* Calendar header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{getMonthName(currentMonth)} {currentYear}</h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {/* Day names */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="h-8 w-8 flex items-center justify-center text-gray-500 text-sm">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {renderCalendar()}
      </div>
      
      {/* Selected date events */}
      {selectedDate && (
        <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2">{formatDate(selectedDate)}</h4>
          {getEventsForDate(parseInt(selectedDate.split('-')[2])).length > 0 ? (
            <div className="space-y-2">
              {getEventsForDate(parseInt(selectedDate.split('-')[2])).map((event, i) => (
                <div 
                  key={i} 
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                  onClick={() => onSelectEvent(event)}
                >
                  <div className="flex items-start">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 mr-2"></div>
                    <div>
                      <p className="font-medium text-sm">{event.name}</p>
                      <p className="text-xs text-gray-500">{event.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No events scheduled for this day</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Place[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)

  // Function to search places
  const searchPlaces = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    const results = ALL_PLACES.filter(place => 
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

  // Handle place selection with animation
  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
    setShowSearchResults(false);
    
    // Add animation effect
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1000);
    
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

  // Helper function to check if a card is selected
  const isSelected = (id: string) => {
    return selectedPlace?.id === id;
  };

  // Listen for place selection events from the map
  useEffect(() => {
    const handleMapPlaceSelected = (event: CustomEvent<Place>) => {
      const place = event.detail;
      setSelectedPlace(place);
      
      // Add animation effect
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    };

    // Add event listener for custom event
    window.addEventListener('mapPlaceSelected', handleMapPlaceSelected as EventListener);
    
    // Clean up
    return () => {
      window.removeEventListener('mapPlaceSelected', handleMapPlaceSelected as EventListener);
    };
  }, []);

  // Handle event selection from calendar
  const handleEventSelect = (event: any) => {
    // Find the corresponding event in EVENTS
    const fullEventData = EVENTS.find(e => e.id === event.id);
    if (fullEventData) {
      handlePlaceSelect(fullEventData);
    }
    setShowCalendar(false);
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
              <Image src="/logo.jpg" alt="Juanito" className="rounded-full w-full h-full" width={32} height={32} />
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
          <TabsList className="grid grid-cols-2 mx-4 mt-2">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="explore" className="mt-0">
              <h2 className="font-medium mb-3">Popular in San Juan</h2>

              {/* Featured places */}
              <div className="space-y-3">
                {[
                  {
                    id: "laiya-beach",
                    name: "Laiya Beach",
                    type: "Beach",
                    rating: 4.7,
                    description: "Known for its white sand and clear waters, it's a favorite weekend getaway.",
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdWppFhrebl5AbOr3YlreKdVCzL-bv6pDQHg&s"
                  },
                  {
                    id: "acuatico-beach-resort",
                    name: "Acuatico Beach Resort",
                    type: "Resort",
                    rating: 4.8,
                    description: "A luxury beach resort with infinity pools overlooking the ocean.",
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJAemgxbQgMjKH1KiBJuxS0wMb5BcmdqJ8PQ&s"
                  },
                  {
                    id: "san-juan-public-market",
                    name: "San Juan Public Market",
                    type: "Market",
                    rating: 4.1,
                    description: "A bustling local market selling fresh produce, seafood, and various goods.",
                    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxEnFl_jSVn_rENh-Jd8kvJI69EOxf831Csw&s"
                  }
                ].map((placeCard, i) => {
                  // Find the corresponding place in POPULAR_PLACES
                  const fullPlaceData = POPULAR_PLACES.find(p => p.id === placeCard.id);
                  const isCardSelected = isSelected(placeCard.id);
                  
                  return (
                    <Card 
                      key={i} 
                      className={`cursor-pointer transition-all duration-300 ${
                        isCardSelected 
                          ? 'bg-blue-50 border-blue-300 shadow-md' 
                          : 'hover:bg-gray-50'
                      } ${isAnimating && isCardSelected ? 'animate-pulse' : ''}`}
                      onClick={() => fullPlaceData && handlePlaceSelect(fullPlaceData)}
                    >
                      <div className="flex p-3">
                        <div className="w-16 h-16 bg-blue-100 rounded-md mr-3 flex-shrink-0">
                          <img
                            src={placeCard.image}
                            alt={placeCard.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{placeCard.name}</h3>
                          <p className="text-sm text-gray-500">{placeCard.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Badge variant="outline" className="mr-2">
                              {placeCard.type}
                            </Badge>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                              <span>{placeCard.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <h2 className="font-medium mt-6 mb-3">Local Products</h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "palayok", name: "Palayok", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJNFLZxEsaWk6GlQsoZtmyPEoD6WqTQanHQ&s", type: "Crafts" },
                  { id: "lambanog", name: "Lambanog", image: "https://manila-wine.com/media/catalog/product/cache/ab779e9c28832bdb1d1b6d48074ac569/s/a/san_juan.jpg", type: "Beverage" },
                  { id: "suman", name: "Suman", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQePnsQUXDL1jYsqHwpeupgwt9HgiQ-af1DXw&s", type: "Food" },
                  { id: "tablea", name: "Tablea", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRzUXPtVVRaXT3kKGjFP3iHqGKbnIkubQNow&s",  type: "Food" },
                ].map((product, i) => {
                  // Find the corresponding product in LOCAL_PRODUCTS
                  const fullProductData = LOCAL_PRODUCTS.find(p => p.id === product.id);
                  const isCardSelected = isSelected(product.id);
                  
                  return (
                    <Card 
                      key={i} 
                      className={`cursor-pointer transition-all duration-300 ${
                        isCardSelected 
                          ? 'bg-blue-50 border-blue-300 shadow-md' 
                          : 'hover:bg-gray-50'
                      } ${isAnimating && isCardSelected ? 'animate-pulse' : ''}`}
                      onClick={() => fullProductData && handlePlaceSelect(fullProductData)}
                    >
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
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Upcoming Events</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCalendar(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { id: "beach-cleanup", name: "Beach Cleanup Drive🏖️", date: "Jun 15", type: "Community" },
                  { id: "food-festival", name: "Scuba Diving🤿", date: "Jun 22-23", type: "Food" },
                  { id: "music-festival", name: "Mangrove Planting🌱", date: "Jul 5-7", type: "Entertainment" },
                  { id: "fiesta-san-juan", name: "Fiesta San Juan🎉", date: "May 16", type: "Cultural" },
                ].map((event, i) => {
                  // Find the corresponding event in EVENTS
                  const fullEventData = EVENTS.find(e => e.id === event.id);
                  const isCardSelected = isSelected(event.id);
                  
                  return (
                    <Card 
                      key={i} 
                      className={`cursor-pointer transition-all duration-300 ${
                        isCardSelected 
                          ? 'bg-blue-50 border-blue-300 shadow-md' 
                          : 'hover:bg-gray-50'
                      } ${isAnimating && isCardSelected ? 'animate-pulse' : ''}`}
                      onClick={() => fullEventData && handlePlaceSelect(fullEventData)}
                    >
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
                  );
                })}
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

      {/* Calendar Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Calendar</DialogTitle>
            <DialogDescription>
              View and select events happening in San Juan
            </DialogDescription>
          </DialogHeader>
          
          <EventCalendar events={EVENTS} onSelectEvent={handleEventSelect} />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCalendar(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

