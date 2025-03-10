"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { MapPin, Hotel, Utensils, Waves, Camera, Navigation, LocateFixed, Map, Download, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import ReactMapGL, { Marker, ViewportProps, FlyToInterpolator, WebMercatorViewport, Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { easeCubic } from 'd3-ease';
import { toast } from "@/components/ui/use-toast"

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

// Define filter categories
const FILTERS = [
  { id: "all", label: "All", icon: Map, mapboxCategory: "all" },
  { id: "beach", label: "Beaches", icon: Waves, mapboxCategory: "beach" },
  { id: "hotel", label: "Hotels & Resorts", icon: Hotel, mapboxCategory: "hotel,resort" },
  { id: "restaurant", label: "Dining", icon: Utensils, mapboxCategory: "restaurant,food" },
  { id: "attraction", label: "Attractions", icon: Camera, mapboxCategory: "attraction,landmark,park" },
  { id: "establishment", label: "Establishments", icon: MapPin, mapboxCategory: "establishment,shop,store" },
] 

// Fetch places data from Mapbox API
const fetchPlaces = async (bounds: any): Promise<Place[]> => {
  // Use the filter categories to fetch places
  const categories = FILTERS.filter(f => f.id !== "all").map(f => f.id);
  let allPlaces: Place[] = [];

  try {
    // Fetch places for each category using Mapbox Places API
    for (const category of categories) {
      const filter = FILTERS.find(f => f.id === category);
      if (!filter) continue;
      
      const query = getQueryForCategory(category);

      try {
        // Use the improved fetchPlacesFromAPI function that returns JSON directly
        const data = await fetchPlacesFromAPI(query, bounds);

        // Check if features exists before transforming
        if (data && data.features && Array.isArray(data.features)) {
          // Transform Mapbox features to our Place interface
          const places = transformFeaturesToPlaces(data.features, category);
          allPlaces = [...allPlaces, ...places];
        } else {
          console.warn(`No features found for category: ${category}`);
        }
      } catch (error) {
        console.error(`Error fetching places for category ${category}:`, error);
        // Continue with other categories even if one fails
      }
    }

    // Always combine with popular places to ensure good coverage
    const combinedPlaces = [...allPlaces, ...POPULAR_PLACES];
    
    // Remove duplicates by id using a plain object
    const placeMap: { [key: string]: Place } = {};
    combinedPlaces.forEach(place => {
      placeMap[place.id] = place;
    });
    const uniquePlaces = Object.values(placeMap);
    
    // If we still have no places, use fallback data
    if (uniquePlaces.length === 0) {
      console.warn("No places found from API, using fallback data only");
      return POPULAR_PLACES;
    }
    
    return uniquePlaces;

  } catch (error) {
    console.error("Error fetching places:", error);
    // Fallback to predefined places on error
    return POPULAR_PLACES;
  }
};

// Helper function to get query for category
const getQueryForCategory = (category: string): string => {
  switch (category) {
    case "beach":
      return "beach resort";
    case "hotel":
      return "hotel resort accommodation";
    case "restaurant":
      return "restaurant dining food";
    case "attraction":
      return "attraction landmark tourist spot";
    case "establishment":
      return "establishment shop store business";
    default:
      return category;
  }
};

// Helper function to fetch places from API
const fetchPlacesFromAPI = (query: string, bounds: any) => {
  // Encode the query properly for URL
  const encodedQuery = encodeURIComponent(`${query} in San Juan Batangas Philippines`);
  
  // Construct the URL with proper formatting
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?` +
    `bbox=${bounds.west},${bounds.south},${bounds.east},${bounds.north}&` +
    `access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiemllbHd3IiwiYSI6ImNtODM2MXV0bTBrNmgyam9wajNwZ2wyejYifQ.YMVqTlPt3EbgcWoTyztDNA"}&` +
    `types=poi,place&limit=50`; // Increased limit and added place type
  
  console.log(`Fetching places for query: ${query}`);
  
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(`Found ${data.features?.length || 0} places for query: ${query}`);
      return data;
    })
    .catch(error => {
      console.error(`Error fetching places for query ${query}:`, error);
      // Return an empty result structure instead of throwing
      return { features: [] };
    });
};

// Transform Mapbox features to our Place interface
const transformFeaturesToPlaces = (features: any[], category: string): Place[] => {
  if (!features || !Array.isArray(features)) {
    console.warn("No features to transform");
    return [];
  }

  return features
    .filter(feature => {
      // Make sure the feature is within San Juan bounds
      const lng = feature.center[0];
      const lat = feature.center[1];
      const bounds = {
        west: 121.3042,
        south: 13.6633,
        east: 121.5042,
        north: 13.8633
      };
      
      return (
        lng >= bounds.west && 
        lng <= bounds.east && 
        lat >= bounds.south && 
        lat <= bounds.north
      );
    })
    .map(feature => {
      // Determine the type based on feature properties and the requested category
      let type = category;
      
      // Check if the place name or category contains specific keywords
      const name = feature.text.toLowerCase();
      const placeName = feature.place_name.toLowerCase();
      const properties = feature.properties || {};
      
      if (name.includes('beach') || placeName.includes('beach')) {
        type = 'beach';
      } else if (name.includes('resort') || placeName.includes('resort') || 
                name.includes('hotel') || placeName.includes('hotel')) {
        type = 'hotel';
      } else if (name.includes('restaurant') || placeName.includes('restaurant') || 
                name.includes('cafe') || placeName.includes('cafe') ||
                name.includes('dining') || placeName.includes('dining')) {
        type = 'restaurant';
      } else if (name.includes('park') || placeName.includes('park') ||
                name.includes('attraction') || placeName.includes('attraction') ||
                name.includes('landmark') || placeName.includes('landmark')) {
        type = 'attraction';
      }
      
      // Generate a unique ID
      const id = `${feature.id || Math.random().toString(36).substring(2, 9)}`;
      
      return {
        id,
        name: feature.text || 'Unnamed Place',
        type,
        lat: feature.center[1],
        lng: feature.center[0],
        description: feature.place_name || '',
        address: feature.place_name || '',
        rating: Math.floor(Math.random() * 5) + 1 // Random rating 1-5 for demo
      };
    });
};

// Keep POPULAR_PLACES as fallback data
const POPULAR_PLACES: Place[] = [
  // BEACHES - 2 beaches in San Juan
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
  
  // HOTELS & RESORTS - 2 hotels/resorts in San Juan
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
  
  // ATTRACTIONS - 2 attractions in San Juan
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
  
  // ESTABLISHMENTS - 2 establishments in San Juan
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
    latitude: 13.7633,   // Centered between north and south boundaries
    zoom: 12,
    width: 800, // Default value, will be updated in useEffect
    height: 600, // Default value, will be updated in useEffect
    bearing: 0,
    pitch: 0,
    altitude: 1.5,
    maxZoom: 20,
    minZoom: 10, // Restrict minimum zoom to keep focus on San Juan
    maxPitch: 60,
    minPitch: 0
  });
  const [routeCoordinates, setRouteCoordinates] = useState<[number, number][]>([]);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/satellite-streets-v12"); // Satellite with streets
  const [isAddingWaypoint, setIsAddingWaypoint] = useState(false);

  // Define San Juan bounds to restrict map movement
  const SAN_JUAN_BOUNDS = {
    west: 121.3042, // Western boundary
    south: 13.6633, // Southern boundary (adjusted to include more southern area)
    east: 121.5042, // Eastern boundary
    north: 13.8633  // Northern boundary (adjusted to include less northern area)
  };

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
        width: mapContainer.current?.clientWidth || window.innerWidth,
        height: mapContainer.current?.clientHeight || window.innerHeight - 100 // Subtract navbar height
      }));
    };

    window.addEventListener('resize', updateSize);
    // Initial size update
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize with both API places and predefined places
  useEffect(() => {
    const fetchInitialPlaces = async () => {
      setIsLoading(true);
      try {
        // Use a wider bounding box for San Juan, Batangas to get more places
        const initialBounds = {
          west: 121.2, // Expanded west boundary
          south: 13.6, // Expanded south boundary
          east: 121.6, // Expanded east boundary
          north: 13.9  // Expanded north boundary
        };
        
        // Try to fetch places from API - the updated fetchPlaces function
        // already combines with POPULAR_PLACES and removes duplicates
        const initialPlaces = await fetchPlaces(initialBounds);
        
        console.log(`Loaded ${initialPlaces.length} places for initial display`);
        setPlaces(initialPlaces);
      } catch (error) {
        console.error("Error in initial places fetch:", error);
        // Fallback to predefined places on error
        setPlaces(POPULAR_PLACES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialPlaces();
  }, []); // Empty dependency array to run only once on mount

  // Fetch POI data from Mapbox when map moves or filter changes
  const fetchPOIs = useCallback(async (filter = activeFilter) => {
    if (!mapRef.current || !mapRef.current.getMap) return;
    
    setIsLoading(true);
    
    try {
      const map = mapRef.current.getMap();
      const bounds = map.getBounds();
      
      // Convert bounds to the format expected by fetchPlaces
      const boundingBox = {
        west: bounds.getWest(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        north: bounds.getNorth()
      };
      
      console.log(`Fetching POIs for bounds: ${JSON.stringify(boundingBox)}`);
      
      // Fetch all places - the updated fetchPlaces function already combines with POPULAR_PLACES
      let fetchedPlaces = await fetchPlaces(boundingBox);
      
      console.log(`Fetched ${fetchedPlaces.length} places for the current view`);
      
      // Always include POPULAR_PLACES to ensure we have good coverage
      const combinedPlaces = [...fetchedPlaces, ...POPULAR_PLACES];
      
      // Remove duplicates
      const uniquePlacesMap: { [key: string]: Place } = {};
      combinedPlaces.forEach(place => {
        uniquePlacesMap[place.id] = place;
      });
      let uniquePlaces = Object.values(uniquePlacesMap);
      
      // Filter places based on the active filter
      if (filter !== "all") {
        uniquePlaces = uniquePlaces.filter(place => place.type === filter);
        console.log(`Filtered to ${uniquePlaces.length} ${filter} places`);
      }
      
      // If no places found for the selected filter, show a message
      if (uniquePlaces.length === 0) {
        console.warn(`No ${filter} places found in the current view, using fallback data`);
        // Get fallback places for the current filter
        if (filter !== "all") {
          uniquePlaces = POPULAR_PLACES.filter(place => place.type === filter);
        } else {
          uniquePlaces = POPULAR_PLACES;
        }
      }
      
      setPlaces(uniquePlaces);
    } catch (error) {
      console.error("Error fetching POIs:", error);
      // On error, fall back to popular places
      let fallbackPlaces = POPULAR_PLACES;
      if (filter !== "all") {
        fallbackPlaces = POPULAR_PLACES.filter(place => place.type === filter);
      }
      setPlaces(fallbackPlaces);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch POIs when map is loaded, viewport changes, or filter changes
  useEffect(() => {
    if (mapRef.current && mapRef.current.getMap) {
      fetchPOIs(activeFilter);
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

  // Enhanced function to fetch route between two points
  const fetchRoute = useCallback(async (from: [number, number], to: [number, number]) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${from[0]},${from[1]};${to[0]},${to[1]}?steps=true&geometries=geojson&access_token=${
          "pk.eyJ1IjoiemllbHd3IiwiYSI6ImNtODM2MXV0bTBrNmgyam9wajNwZ2wyejYifQ.YMVqTlPt3EbgcWoTyztDNA"
        }`
      );
      
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setRouteCoordinates(route.geometry.coordinates);
        setRouteDistance(route.distance / 1000); // Convert to km
        setRouteDuration(calculateTravelTime(route.distance / 1000));
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  }, []);

  // Enhanced function to show directions
  const showDirectionsToPlace = useCallback((place: Place) => {
    if (!userLocation) {
      alert("Your location is needed to show directions. Please allow location access.");
      return;
    }
    
    setShowDirections(true);
    setSelectedPlace(place);
    
    // Fetch the route
    fetchRoute(
      [userLocation.longitude, userLocation.latitude],
      [place.lng, place.lat]
    );
    
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
      }
    }
  }, [userLocation, fetchRoute]);

  // Function to center on user location
  const centerOnUserLocation = useCallback(() => {
    if (userLocation) {
      flyToLocation(userLocation.latitude, userLocation.longitude, 14);
    } else {
      alert("Your location is not available. Please allow location access.");
    }
  }, [userLocation, flyToLocation]);

  // Function to clear directions
  const clearDirections = useCallback(() => {
    setShowDirections(false);
    setRouteCoordinates([]);
    setRouteDistance(null);
    setRouteDuration(null);
  }, []);

  // Function to handle adding a custom waypoint
  const handleAddWaypoint = useCallback((event: any) => {
    if (!isAddingWaypoint) return;
    
    const { lngLat } = event;
    const newPlace: Place = {
      id: `custom-${Date.now()}`,
      name: `Custom Waypoint ${places.filter(p => p.id.startsWith('custom-')).length + 1}`,
      type: "custom",
      lat: lngLat.lat,
      lng: lngLat.lng,
      description: "A custom waypoint added by the user",
      rating: 5.0,
      occupancy: "low",
      address: `${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}`
    };
    
    setPlaces(prev => [...prev, newPlace]);
    setSelectedPlace(newPlace);
    
    toast({
      title: "Waypoint added",
      description: `Added custom waypoint at ${lngLat.lat.toFixed(6)}, ${lngLat.lng.toFixed(6)}`,
      duration: 3000,
    });
    
    // Turn off adding mode after adding a waypoint
    setIsAddingWaypoint(false);
  }, [isAddingWaypoint, places]);

  // Get icon for place type
  const getIconForType = (type: string) => {
    switch (type) {
      case "beach":
        return <Waves className="h-6 w-6 text-blue-500" />;
      case "resort":
        return <Hotel className="h-6 w-6 text-purple-500" />;
      case "restaurant":
        return <Utensils className="h-6 w-6 text-orange-500" />;
      case "attraction":
        return <Camera className="h-6 w-6 text-green-500" />;
      case "establishment":
        return <MapPin className="h-6 w-6 text-yellow-500" />;
      case "custom":
        return <MapPin className="h-6 w-6 text-red-500" />;
      default:
        return <MapPin className="h-6 w-6 text-red-500" />;
    }
  };

  // Function to show all places on the map
  const showAllPlaces = useCallback(() => {
    if (places.length === 0 || !mapRef.current) return;
    
    try {
      const webMercatorViewport = new WebMercatorViewport({
        width: mapContainer.current?.clientWidth || 800,
        height: mapContainer.current?.clientHeight || 500,
      });
      
      // Create an array of [lng, lat] coordinates from all places
      const coordinates: [number, number][] = places.map(place => [place.lng, place.lat]);
      
      // Add user location if available
      if (userLocation) {
        coordinates.push([userLocation.longitude, userLocation.latitude]);
      }
      
      // Make sure we have at least one coordinate
      if (coordinates.length === 0) {
        console.warn("No coordinates to show");
        return;
      }
      
      // Calculate bounds that include all places
      const bounds: [[number, number], [number, number]] = coordinates.reduce(
        (bounds, coord) => {
          return [
            [Math.min(bounds[0][0], coord[0]), Math.min(bounds[0][1], coord[1])],
            [Math.max(bounds[1][0], coord[0]), Math.max(bounds[1][1], coord[1])]
          ];
        },
        [
          [coordinates[0][0], coordinates[0][1]],
          [coordinates[0][0], coordinates[0][1]]
        ]
      );
      
      // Fit the map to these bounds
      const { longitude, latitude, zoom } = webMercatorViewport.fitBounds(bounds, {
        padding: 50
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
      
      toast({
        title: "Showing all places",
        description: `Displaying ${places.length} places on the map`,
        duration: 3000,
      });
    } catch (error) {
      console.error("Error showing all places:", error);
    }
  }, [places, userLocation]);

  // Function to export places as GPX waypoints
  const exportPlacesAsGPX = useCallback(() => {
    if (places.length === 0) {
      toast({
        title: "No places to export",
        description: "There are no places to export as waypoints",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Create GPX format
    let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Juan For All App" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>San Juan, Batangas Places</name>
    <desc>Points of interest in San Juan, Batangas</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>`;
    
    // Add each place as a waypoint
    places.forEach(place => {
      gpx += `
    <wpt lat="${place.lat}" lon="${place.lng}">
      <name>${place.name}</name>
      <desc>${place.description || `A ${place.type} in San Juan, Batangas`}</desc>
      <type>${place.type}</type>
    </wpt>`;
    });
    
    // Close GPX
    gpx += `
</gpx>`;
    
    // Create a blob and download link
    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'san-juan-places.gpx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Waypoints exported",
      description: `Exported ${places.length} places as GPX waypoints`,
      duration: 3000,
    });
  }, [places]);

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex flex-wrap gap-2 p-2 bg-white shadow-sm z-10">
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
      
      <div ref={mapContainer} className="relative flex-grow w-full h-[calc(100vh-60px)]">
        <ReactMapGL
          ref={mapRef}
          {...viewport}
          mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoiemllbHd3IiwiYSI6ImNtODM2MXV0bTBrNmgyam9wajNwZ2wyejYifQ.YMVqTlPt3EbgcWoTyztDNA"}
          onViewportChange={(newViewport: ViewportProps) => {
            // Restrict panning to San Juan bounds
            const longitude = Math.min(Math.max(newViewport.longitude, SAN_JUAN_BOUNDS.west), SAN_JUAN_BOUNDS.east);
            const latitude = Math.min(Math.max(newViewport.latitude, SAN_JUAN_BOUNDS.south), SAN_JUAN_BOUNDS.north);
            
            setViewport({
              ...newViewport,
              longitude,
              latitude
            });
          }}
          mapStyle={mapStyle}
          onClick={handleAddWaypoint}
          onLoad={() => {
            if (mapRef.current) {
              // Set initial 3D view with pitch and bearing
              setViewport(v => ({
                ...v,
                pitch: 45, // Tilt the map for 3D effect
                bearing: 0,
                transitionDuration: 1000
              }));
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
                className="cursor-pointer relative group" 
                onClick={() => {
                  console.log("Clicked place:", place);
                  setSelectedPlace(place);
                  setShowDirections(false);
                  
                  // Fly to the location with a closer zoom
                  flyToLocation(place.lat, place.lng, 15);
                  
                  // Show a toast notification that the place was selected
                  toast({
                    title: place.name,
                    description: `Selected ${place.type}. Click "Get Directions" to navigate.`,
                    duration: 3000,
                  });
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  {place.name}
                </div>
                <div className="p-1 bg-white rounded-full shadow-md">
                  {getIconForType(place.type)}
                </div>
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
          
          {/* Route line */}
          {showDirections && routeCoordinates.length > 0 && (
            <Source
              id="route"
              type="geojson"
              data={{
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: routeCoordinates
                }
              }}
            >
              <Layer
                id="route"
                type="line"
                source="route"
                layout={{
                  "line-join": "round",
                  "line-cap": "round"
                }}
                paint={{
                  "line-color": "#3b82f6",
                  "line-width": 4,
                  "line-opacity": 0.8
                }}
              />
            </Source>
          )}
          
          {/* Map style controls */}
          <div className="absolute bottom-10 right-5 bg-white rounded-md shadow-md p-2 z-10">
            <div className="flex flex-col gap-2">
              <Button 
                size="sm"
                variant={mapStyle === "mapbox://styles/mapbox/satellite-streets-v12" ? "default" : "outline"}
                onClick={() => setMapStyle("mapbox://styles/mapbox/satellite-streets-v12")}
                className="text-xs"
              >
                Satellite
              </Button>
              <Button 
                size="sm"
                variant={mapStyle === "mapbox://styles/mapbox/outdoors-v12" ? "default" : "outline"}
                onClick={() => setMapStyle("mapbox://styles/mapbox/outdoors-v12")}
                className="text-xs"
              >
                Terrain
              </Button>
              <Button 
                size="sm"
                variant={mapStyle === "mapbox://styles/mapbox/streets-v12" ? "default" : "outline"}
                onClick={() => setMapStyle("mapbox://styles/mapbox/streets-v12")}
                className="text-xs"
              >
                Streets
              </Button>
            </div>
          </div>
          
          {/* 3D controls */}
          <div className="absolute bottom-10 left-4 bg-white rounded-md shadow-md p-2 z-10">
            <div className="flex flex-col gap-2">
              <Button 
                size="sm"
                onClick={() => setViewport(v => ({
                  ...v,
                  pitch: 0,
                  bearing: 0,
                  transitionDuration: 1000
                }))}
                className="text-xs"
              >
                2D View
              </Button>
              <Button 
                size="sm"
                onClick={() => setViewport(v => ({
                  ...v,
                  pitch: 45,
                  bearing: 0,
                  transitionDuration: 1000
                }))}
                className="text-xs"
              >
                3D View
              </Button>
              <Button 
                size="sm"
                onClick={() => setViewport(v => ({
                  ...v,
                  pitch: v.pitch,
                  bearing: (v.bearing + 45) % 360,
                  transitionDuration: 1000
                }))}
                className="text-xs"
              >
                Rotate
              </Button>
            </div>
          </div>
        </ReactMapGL>
        
        {/* Loading indicator */}
        {isLoading}
        
        {/* Selected place popup */}
        {selectedPlace && (
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">{selectedPlace.name}</h3>
                <p className="text-sm text-gray-500">{selectedPlace.address}</p>
                <div className="flex items-center mt-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(selectedPlace.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-sm text-gray-500">{selectedPlace.rating?.toFixed(1)}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlace(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="mt-2 text-sm">{selectedPlace.description}</p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Button 
                size="sm" 
                onClick={() => flyToLocation(selectedPlace.lat, selectedPlace.lng, 16)}
                className="flex items-center gap-1"
              >
                <MapPin className="h-4 w-4" />
                <span>Zoom to</span>
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => showDirectionsToPlace(selectedPlace)}
                className="flex items-center gap-1"
              >
                <Navigation className="h-4 w-4" />
                <span>Directions</span>
              </Button>
            </div>
            
            {showDirections && routeDistance && routeDuration && selectedPlace && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">Distance: {routeDistance.toFixed(1)} km</p>
                    <p className="text-sm text-gray-500">Estimated travel time: {routeDuration}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={clearDirections}
                  >
                    Clear route
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Current location button */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white shadow-md hover:bg-gray-100"
            onClick={centerOnUserLocation}
            title="Center on your location"
          >
            <LocateFixed className="h-5 w-5 text-blue-600" />
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white shadow-md hover:bg-gray-100"
            onClick={showAllPlaces}
            title="Show all places"
          >
            <Map className="h-5 w-5 text-green-600" />
          </Button>
          
          <Button 
            variant={isAddingWaypoint ? "default" : "secondary"}
            size="icon"
            className={`${isAddingWaypoint ? 'bg-red-500' : 'bg-white'} shadow-md hover:bg-gray-100`}
            onClick={() => {
              setIsAddingWaypoint(!isAddingWaypoint);
              toast({
                title: isAddingWaypoint ? "Waypoint mode disabled" : "Waypoint mode enabled",
                description: isAddingWaypoint ? "Stopped adding waypoints" : "Click on the map to add a waypoint",
                duration: 3000,
              });
            }}
            title={isAddingWaypoint ? "Cancel adding waypoint" : "Add custom waypoint"}
          >
            <PlusCircle className={`h-5 w-5 ${isAddingWaypoint ? 'text-white' : 'text-red-600'}`} />
          </Button>
          
          <Button 
            variant="secondary" 
            size="icon"
            className="bg-white shadow-md hover:bg-gray-100"
            onClick={exportPlacesAsGPX}
            title="Export places as waypoints"
          >
            <Download className="h-5 w-5 text-purple-600" />
          </Button>
        </div>
      </div>
      
      {/* Waypoint adding indicator */}
      {isAddingWaypoint && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full shadow-md z-50 animate-pulse">
          Click on the map to add a waypoint
        </div>
      )}
    </div>
  );
};

export default MapComponent;


