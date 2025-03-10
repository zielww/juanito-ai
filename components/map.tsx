"use client"

import React, { useState, useEffect, useRef } from "react"
import { MapPin, Hotel, Utensils, Waves, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReactMapGL, { Marker, ViewportProps } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


// Define types for places and filters
interface Place {
  id: number
  name: string
  type: string
  lat: number
  lng: number
  occupancy: string
}

interface Filter {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// Sample data for map markers
const PLACES: Place[] = [
  { id: 1, name: "Laiya Beach", type: "beach", lat: 13.6633, lng: 121.4042, occupancy: "medium" },
  { id: 2, name: "Acuatico Beach Resort", type: "resort", lat: 13.6583, lng: 121.3992, occupancy: "high" },
  { id: 3, name: "La Luz Beach Resort", type: "resort", lat: 13.6733, lng: 121.4142, occupancy: "low" },
  { id: 4, name: "Sabangan Beach", type: "beach", lat: 13.6533, lng: 121.3942, occupancy: "low" },
  { id: 5, name: "Local Seafood Restaurant", type: "restaurant", lat: 13.6683, lng: 121.4092, occupancy: "medium" },
  { id: 6, name: "Sunset Viewpoint", type: "attraction", lat: 13.6603, lng: 121.4002, occupancy: "low" },
]

// Map filter options
const FILTERS: Filter[] = [
  { id: "all", label: "All", icon: MapPin },
  { id: "beach", label: "Beaches", icon: Waves },
  { id: "resort", label: "Resorts", icon: Hotel },
  { id: "restaurant", label: "Dining", icon: Utensils },
  { id: "attraction", label: "Attractions", icon: Camera },
]

// Define viewport state type for v8
interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

const MapComponent: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
  const [viewport, setViewport] = useState<ViewportProps>({
    longitude: 121.4079,
    latitude: 13.8443,
    zoom: 13,
    width: 1600,
    height: 900,
    bearing: 0,
    pitch: 0,
    altitude: 1.5,
    maxZoom: 20,
    minZoom: 0,
    maxPitch: 60,
    minPitch: 0
  });

  // Filter places based on selected filter
  const filteredPlaces = activeFilter === "all" ? PLACES : PLACES.filter((place) => place.type === activeFilter)

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Map of San Juan, Batangas</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          onClick={() => setActiveFilter("all")}
          className="flex items-center gap-2"
        >
          All
        </Button>
        {FILTERS.map(filter => (
          <TooltipProvider key={filter.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  onClick={() => setActiveFilter(filter.id)}
                  className="flex items-center gap-2"
                >
                  <filter.icon className="h-4 w-4" />
                  {filter.label}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Show {filter.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      <div className="relative rounded-lg overflow-hidden">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1IjoiemllbHd3IiwiYSI6ImNtODM2MXV0bTBrNmgyam9wajNwZ2wyejYifQ.YMVqTlPt3EbgcWoTyztDNA"
          onViewportChange={(newViewport: ViewportProps) => setViewport(newViewport)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {PLACES.filter(place => activeFilter === "all" || place.type === activeFilter).map(place => (
            <Marker 
              key={place.id} 
              latitude={place.lat} 
              longitude={place.lng}
              offsetLeft={-12}
              offsetTop={-24}
            >
              <div 
                className="cursor-pointer" 
                onClick={() => setSelectedPlace(place)}
              >
                <MapPin className="h-6 w-6 text-red-500" />
              </div>
            </Marker>
          ))}
        </ReactMapGL>
        
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-bold text-lg">{selectedPlace.name}</h3>
            <p className="text-sm text-gray-600">Type: {selectedPlace.type}</p>
            <p className="text-sm text-gray-600">Occupancy: {selectedPlace.occupancy}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setSelectedPlace(null)}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapComponent


