"use client";

import { useState, useEffect } from "react"; 
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
// Reverting to root-based path aliases for component imports
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Lucide Icons
import { MapPin, LocateFixed, XCircle } from "lucide-react"; 
import { motion } from "framer-motion";

// Reverting to root-based path aliases

import { LoaderOne } from "@/components/ui/loader";
import ReuseableCard from "@/components/reuseableCard/ReuseableCard";
import Link from "next/link";
import dynamic from "next/dynamic";





 const MapView = dynamic(() => import("@/components/MapView/MapView"), { ssr: false });
export default function ExploreProperties() {
 const [search,setSearch]=useState('')
  
 
  const [roomType, setRoomType] = useState("");
  const [page, setPage] = useState(1);
  const [showMap, setShowMap] = useState(false);
  
 
  const limit = 8


  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null); 

  // Function to clear the user's current location
  const clearUserLocation = () => {
    setUserLocation({ latitude: null, longitude: null });
    setLocationError(null);
    setPage(1); 
  };

  // Function to get user's current location
 const fetchUserLocation = () => {
  if (isLocating) return; // prevent multiple requests

  setLocationError(null);
  setIsLocating(true);

  if (!navigator.geolocation) {
    setLocationError("Geolocation is not supported by your browser.");
    setUserLocation({ latitude: null, longitude: null });
    setIsLocating(false);
    return;
  }

  let errorTimeout;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      clearTimeout(errorTimeout);
      const { latitude, longitude } = position.coords;
      

      if (latitude && longitude) {
        setUserLocation({ latitude, longitude });
        setPage(1);
        setLocationError(null);
      } else {
        setLocationError("Could not determine valid coordinates. Please try again.");
        setUserLocation({ latitude: null, longitude: null });
      }

      setIsLocating(false);
    },
    (error) => {
      console.error("❌ Geolocation failed:", error);

      // Delay showing error for 1 second to give success callback a chance to override it
      errorTimeout = setTimeout(() => {
        let errorMessage = "Failed to get location. Check browser settings.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow access in browser settings.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
        }

        // Only show error if success didn't already run
        setLocationError((prev) =>
          userLocation.latitude && userLocation.longitude ? prev : errorMessage
        );
        setIsLocating(false);
      }, 1000);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};
  
  // Logic to determine if we should send location data to the API
  // Location is active only if coords are present AND no manual search/filter is applied
  const isLocationActive = userLocation.latitude !== null && userLocation.longitude !== null && search === "" && roomType === "";


const apiCall= async () => {
      // API call parameters
      const params = {
        search,
        roomType,
        page,
        limit,
        // Conditionally add location parameters only if active
        ...(isLocationActive && {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        }),
      };
      
      const res = await axios.get("/api/property", { params });
      return res.data.data || []; 
    }




  // Fetch data using React Query
  const { data:properties =[], isLoading } = useQuery({
    queryKey: ["properties", search, roomType, page, userLocation,limit],
    queryFn: apiCall,
   
    enabled: !isLocating, 
    staleTime:1000*60*5
  });

  useEffect(() => {
    if (search.length > 0 || roomType) {
      setUserLocation({ latitude: null, longitude: null });
      setLocationError(null); 
      if (page !== 1) setPage(1);
    }
  }, [search, roomType]);


  return (
    <div className="dark:bg-black">
    <div className="max-w-7xl  mx-auto px-4 py-40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-neutral-300">Explore Homes</h1>
        <div className="flex flex-wrap gap-3">
          <Input 
            placeholder="Search city or area..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 dark:bg-black dark:text-neutral-300 font-medium text-lg sm:w-60"
          />
          <Select className='dark:bg-black dark:text-neutral-300'  onValueChange={setRoomType} value={roomType || ""}>
            <SelectTrigger className="w-40 dark:hover:bg-black text-sm font-medium  dark:bg-black dark:text-neutral-300">
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent className="dark:bg-black dark:text-neutral-300">
              <SelectItem value="entire_place">Entire place</SelectItem>
              <SelectItem value="private_room">Private room</SelectItem>
              <SelectItem value="shared_room">Shared room</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Detection Button */}
          <Button
            onClick={fetchUserLocation}
            variant="primary"
            className="rounded-xl border dark:text-neutral-300 flex items-center gap-2"
            disabled={isLocating}
          >
            <LocateFixed className="w-4 h-4" />
            {isLocating ? "Locating..." : "Detect Location"}
          </Button>
          
          {/* Clear Location Button (Visible only when location search is active) */}
          {isLocationActive && (
            <Button
              onClick={clearUserLocation}
              variant="ghost"
              className="rounded-xl  border dark:hover:bg-black dark:text-neutral-300 flex items-center gap-2 text-red-500 hover:text-red-600"
            >
              <XCircle className="w-4 h-4" />
              Clear Location Search
            </Button>
          )}

          <Button
            onClick={() => setShowMap((prev) => !prev)}
            variant="primary"
            className="rounded-xl dark:hover:bg-black    border dark:text-neutral-300 "
          >
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </div>
      </div>

      {/* Conditional message if location search is active */}
      {isLocationActive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-blue-50 dark:bg-black border border-blue-200 text-blue-700 rounded-lg text-sm"
        >
          <MapPin className="inline-block w-4 h-4 mr-2" />
          Showing properties near your current location. Type or filter to override.
        </motion.div>
      )}

      {/* Location Error Display */}
      {locationError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm"
        >
          <XCircle className="inline-block w-4 h-4 mr-2" />
          {locationError}
        </motion.div>
      )}

      {/* Map View Toggle (rest of your component) */}
      {showMap ? (
        <div className="h-[600px] rounded-2xl overflow-hidden my-20 ">
          <MapView properties={properties} /> 
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-6">
          {(isLoading || isLocating) ? ( 
            <div className="flex justify-center items-center w-full h-[70vh]">
              <LoaderOne />
            </div>
          ) : properties.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {properties.map((property) => (
                <ReuseableCard property={property} key={property._id} />
              ))}
            </div>
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No properties found. Please try a wider search or detect your location again.
            </p>
          )}
          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <Button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              variant="secondary"
            >
              Prev
            </Button>
            <span className="text-gray-900 dark:text-neutral-300 text-lg">Page {page}</span>
            <Button
              disabled={properties.length < limit} 
              onClick={() => setPage((prev) => prev + 1)}
              variant="secondary"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}
