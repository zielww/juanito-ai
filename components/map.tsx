"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Hotel, Utensils, Waves, Camera, Navigation, LocateFixed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReactMapGL, { Marker, ViewportProps, FlyToInterpolator, WebMercatorViewport, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { easeCubic } from 'd3-ease';

// Define types for places and filters
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

interface Filter {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  mapboxCategory: string
}

// Map filter options with corresponding Mapbox POI categories
const FILTERS: Filter[] = [
  { id: "all", label: "All", icon: MapPin, mapboxCategory: "" },
  { id: "beach", label: "Beaches", icon: Waves, mapboxCategory: "beach" },
  { id: "resort", label: "Resorts", icon: Hotel, mapboxCategory: "hotel,lodging,resort" },
  { id: "restaurant", label: "Dining", icon: Utensils, mapboxCategory: "restaurant,food" },
  { id: "attraction", label: "Attractions", icon: Camera, mapboxCategory: "attraction,landmark,park" },
]

// Function to calculate distance between two points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance;
};

// Function to calculate estimated travel time
const calculateTravelTime = (distanceKm: number): string => {
  // Assuming average speed of 40 km/h
  const timeHours = distanceKm / 40;
  
  if (timeHours < 1/60) {
    // Less than a minute
    return "Less than a minute";
  } else if (timeHours < 1) {
    // Convert to minutes
    const minutes = Math.round(timeHours * 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else {
    // Hours and minutes
    const hours = Math.floor(timeHours);
    const minutes = Math.round((timeHours - hours) * 60);
    
    if (minutes === 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    } else {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    }
  }
};

const MapComponent: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewport, setViewport] = useState<ViewportProps>({
    longitude: 121.4042, // Center on San Juan, Batangas area
    latitude: 13.6633,
    zoom: 12,
    width: 800,
    height: 500,
    bearing: 0,
    pitch: 0,
    altitude: 1.5,
    maxZoom: 20,
    minZoom: 0,
    maxPitch: 60,
    minPitch: 0
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Handle map container resizing
  useEffect(() => {
    if (!mapContainer.current) return;
    
    const updateSize = () => {
      setViewport(v => ({
        ...v,
        width: mapContainer.current?.clientWidth || 800,
        height: mapContainer.current?.clientHeight || 500
      }));
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Fetch POI data from Mapbox when map moves or filter changes
  const fetchPOIs = useCallback(async () => {
    if (!mapRef.current || !mapRef.current.getMap) return;
    
    setIsLoading(true);
    
    try {
      const map = mapRef.current.getMap();
      const bounds = map.getBounds();
      
      const filter = FILTERS.find(f => f.id === activeFilter);
      const categoryParam = filter?.mapboxCategory || '';
      
      // Use Mapbox Geocoding API to fetch POIs
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${
          categoryParam ? categoryParam + ' in ' : ''
        }San Juan Batangas.json?bbox=${
          bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()
        }&limit=10&access_token=${
          "pk.eyJ1IjoiemllbHd3IiwiYSI6ImNtODM2MXV0bTBrNmgyam9wajNwZ2wyejYifQ.YMVqTlPt3EbgcWoTyztDNA"
        }`
      );
      
      const data = await response.json();
      
      // Transform the data to our Place interface
      const newPlaces: Place[] = data.features.map((feature: any) => {
        // Determine the type based on feature properties
        let type = "attraction";
        if (feature.properties?.category?.includes("beach")) type = "beach";
        else if (feature.properties?.category?.includes("hotel") || 
                feature.properties?.category?.includes("lodging") || 
                feature.properties?.category?.includes("resort")) type = "resort";
        else if (feature.properties?.category?.includes("restaurant") || 
                feature.properties?.category?.includes("food")) type = "restaurant";
        
        return {
          id: feature.id,
          name: feature.text || feature.place_name,
          type,
          lat: feature.center[1],
          lng: feature.center[0],
          occupancy: "medium", // Default value
          description: feature.properties?.description || `A popular ${type} in San Juan, Batangas.`,
          address: feature.place_name,
          rating: 4.0 + Math.random() // Random rating between 4.0 and 5.0
        };
      });
      
      setPlaces(newPlaces);
    } catch (error) {
      console.error("Error fetching POIs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter]);

  // Fetch POIs when map is loaded, viewport changes, or filter changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.getMap) {
      fetchPOIs();
    }
  }, [fetchPOIs, activeFilter]);

  // Function to fly to a location
  const flyToLocation = useCallback((latitude: number, longitude: number, zoom = 14) => {
    setViewport(vp => ({
      ...vp,
      latitude,
      longitude,
      zoom,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: easeCubic
    }));
  }, []);

  // Function to show directions
  const showDirectionsToPlace = useCallback((place: Place) => {
    if (!userLocation) {
      alert("Your location is needed to show directions. Please allow location access.");
      return;
    }
    
    setShowDirections(true);
    
    // Calculate a viewport that shows both the user location and the destination
    if (userLocation) {
      try {
        const webMercatorViewport = new WebMercatorViewport({
          width: mapContainer.current?.clientWidth || 800,
          height: mapContainer.current?.clientHeight || 500,
        });
        
        const bounds: [[number, number], [number, number]] = [
          [userLocation.longitude, userLocation.latitude],
          [place.lng, place.lat]
        ];
        
        const { longitude, latitude, zoom } = webMercatorViewport.fitBounds(bounds, {
          padding: 100
        });
        
        setViewport(vp => ({
          ...vp,
          longitude,
          latitude,
          zoom,
          transitionDuration: 1000,
          transitionInterpolator: new FlyToInterpolator(),
          transitionEasing: easeCubic
        }));
      } catch (error) {
        console.error("Error calculating bounds:", error);
        // Fallback to just flying to the place
        flyToLocation(place.lat, place.lng);
      }
    } else {
      flyToLocation(place.lat, place.lng);
    }
  }, [userLocation, flyToLocation]);

  // Function to center on user's location
  const centerOnUserLocation = useCallback(() => {
    if (userLocation) {
      flyToLocation(userLocation.latitude, userLocation.longitude, 15);
    } else {
      alert("Your location is not available. Please allow location access.");
    }
  }, [userLocation, flyToLocation]);

  // Get icon for place type
  const getIconForType = (type: string) => {
    switch (type) {
      case "beach": return <Waves className="h-6 w-6 text-blue-500" />;
      case "resort": return <Hotel className="h-6 w-6 text-purple-500" />;
      case "restaurant": return <Utensils className="h-6 w-6 text-orange-500" />;
      case "attraction": return <Camera className="h-6 w-6 text-green-500" />;
      default: return <MapPin className="h-6 w-6 text-red-500" />;
    }
  };

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
        {FILTERS.filter(f => f.id !== "all").map(filter => (
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
      
      <div ref={mapContainer} className="relative h-[500px] w-full rounded-lg overflow-hidden">
        <ReactMapGL
          ref={mapRef}
          {...viewport}
          mapboxApiAccessToken="pk.eyJ1IjoiemllbHd3IiwiYSI6ImNtODM2MXV0bTBrNmgyam9wajNwZ2wyejYifQ.YMVqTlPt3EbgcWoTyztDNA"
          onViewportChange={(newViewport: ViewportProps) => setViewport(newViewport)}
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onLoad={() => {
            if (mapRef.current) {
              fetchPOIs();
            }
          }}
          onInteractionStateChange={(state) => {
            if (!state.isDragging && mapRef.current) {
              fetchPOIs();
            }
          }}
        >
          {/* Place markers */}
          {places.map(place => (
            <Marker 
              key={place.id} 
              latitude={place.lat} 
              longitude={place.lng}
              offsetLeft={-12}
              offsetTop={-24}
            >
              <div 
                className="cursor-pointer" 
                onClick={() => {
                  setSelectedPlace(place);
                  setShowDirections(false);
                  flyToLocation(place.lat, place.lng);
                }}
              >
                {getIconForType(place.type)}
              </div>
            </Marker>
          ))}
          
          {/* User location marker */}
          {userLocation && (
            <Marker 
              latitude={userLocation.latitude} 
              longitude={userLocation.longitude}
              offsetLeft={-12}
              offsetTop={-12}
            >
              <div className="relative">
                <div className="absolute w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
                <div className="relative w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
              </div>
            </Marker>
          )}
          
          {/* Direction line between user and selected place */}
          {showDirections && selectedPlace && userLocation && (
            <Source
              id="route"
              type="geojson"
              data={{
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'LineString',
                  coordinates: [
                    [userLocation.longitude, userLocation.latitude],
                    [selectedPlace.lng, selectedPlace.lat]
                  ]
                }
              }}
            >
              <Layer
                id="route-line"
                type="line"
                paint={{
                  'line-color': '#3b82f6',
                  'line-width': 3,
                  'line-dasharray': [2, 1]
                }}
              />
            </Source>
          )}
        </ReactMapGL>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-md shadow-md">
            <p className="text-sm font-medium">Loading places...</p>
          </div>
        )}
        
        {/* Location info popup */}
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="font-bold text-lg">{selectedPlace.name}</h3>
            <div className="flex items-center mt-1 mb-2">
              <span className="text-sm text-gray-600 capitalize mr-2">{selectedPlace.type}</span>
              {selectedPlace.occupancy && (
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${selectedPlace.occupancy === "low" ? "bg-green-100 text-green-800" : ""}
                  ${selectedPlace.occupancy === "medium" ? "bg-yellow-100 text-yellow-800" : ""}
                  ${selectedPlace.occupancy === "high" ? "bg-red-100 text-red-800" : ""}
                `}>
                  {selectedPlace.occupancy.charAt(0).toUpperCase() + selectedPlace.occupancy.slice(1)} Occupancy
                </span>
              )}
            </div>
            {selectedPlace.address && (
              <p className="text-xs text-gray-600 mb-2">{selectedPlace.address}</p>
            )}
            {selectedPlace.description && (
              <p className="text-sm text-gray-700 mb-2">{selectedPlace.description}</p>
            )}
            {selectedPlace.rating && (
              <div className="flex items-center mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(selectedPlace.rating || 0) ? "text-yellow-400" : "text-gray-400"}>★</span>
                  ))}
                </div>
                <span className="ml-1 text-sm text-gray-600">{selectedPlace.rating.toFixed(1)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedPlace(null)}
              >
                Close
              </Button>
              <Button 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1"
                onClick={() => showDirectionsToPlace(selectedPlace)}
              >
                <Navigation className="h-4 w-4" />
                Directions
              </Button>
            </div>
          </div>
        )}
        
        {/* Direction info */}
        {showDirections && selectedPlace && userLocation && (
          <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-md shadow-md z-10">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium flex items-center">
                <Navigation className="h-4 w-4 mr-1 text-blue-600" />
                Directions to {selectedPlace.name}
              </p>
              <button 
                className="ml-2 text-gray-400 hover:text-gray-600" 
                onClick={() => setShowDirections(false)}
              >
                ✕
              </button>
            </div>
            {userLocation && (
              <>
                <p className="text-xs text-gray-600 mt-1">
                  Distance: {calculateDistance(
                    userLocation.latitude, 
                    userLocation.longitude, 
                    selectedPlace.lat, 
                    selectedPlace.lng
                  ).toFixed(1)} km
                </p>
                <p className="text-xs text-gray-600">
                  Est. travel time: {calculateTravelTime(calculateDistance(
                    userLocation.latitude, 
                    userLocation.longitude, 
                    selectedPlace.lat, 
                    selectedPlace.lng
                  ))}
                </p>
              </>
            )}
          </div>
        )}
        
        {/* Current location button */}
        <div className="absolute top-4 right-4">
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white shadow-md hover:bg-gray-100"
            onClick={centerOnUserLocation}
          >
            <LocateFixed className="h-5 w-5 text-blue-600" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;


