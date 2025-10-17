"use client"
import React, { useState } from "react";
// Shadcn Imports
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar"; // Assuming this is installed via shadcn CLI

// Utility Imports
// NOTE: Ensure your @/lib/utils/cn function is imported/available
import { cn } from "@/lib/utils"; 
import { format, differenceInDays } from "date-fns"; // For formatting and date calculation

// Icon Imports
import { MapPin, Star, Users, Bed, Bath, ChevronDown, Minus, Plus } from "lucide-react"; 

// Custom/External Imports
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoaderOne } from "@/components/ui/loader"; // Assuming LoaderOne is imported/available
import ReviewsList from "@/components/ReviewsList"; // Assuming ReviewsList is imported/available
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import ChatBox from "@/components/Chatbox/Chatbox";


// ==============================================================================
// 1. DATE PICKER COMPONENT (Helper function defined within the file)
// ==============================================================================
const AirbnbDatePicker = ({ dateRange, setDateRange }) => {
    // Determine the text to display for Check-in and Check-out
    const checkInText = dateRange?.from ? format(dateRange.from, "MMM dd") : 'Add Date';
    const checkOutText = dateRange?.to ? format(dateRange.to, "MMM dd") : 'Add Date';

    const selectedRange = dateRange || { from: undefined, to: undefined };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="flex border-b border-gray-300 cursor-pointer">
                    <div 
                        className={cn(
                            "flex flex-col p-2 pt-3 flex-1 text-left rounded-tl-xl hover:bg-gray-100",
                            // Highlight check-in until check-out is picked
                            { "bg-gray-100": selectedRange.from && !selectedRange.to } 
                        )}
                    >
                        <span className="text-xs font-bold uppercase">Check-in</span>
                        <span className="text-sm text-gray-700 font-normal">
                            {checkInText}
                        </span>
                    </div>

                    <div 
                        className={cn(
                            "flex flex-col p-2 pt-3 flex-1 text-left border-l border-gray-300 rounded-tr-xl hover:bg-gray-100"
                        )}
                    >
                        <span className="text-xs font-bold uppercase">Check-out</span>
                        <span className="text-sm text-gray-700 font-normal">
                            {checkOutText}
                        </span>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent 
                className="w-auto p-0 z-50 shadow-2xl rounded-xl" 
                align="end" 
            >
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={selectedRange.from}
                    selected={selectedRange}
                    onSelect={setDateRange}
                    numberOfMonths={2}
                    // Disable dates in the past
                    disabled={(date) => date < new Date() && date.toDateString() !== new Date().toDateString()} 
                />
            </PopoverContent>
        </Popover>
    );
};


// ==============================================================================
// 2. GUEST COUNTER COMPONENT (Helper function defined within the file)
// ==============================================================================
const GuestSelector = ({ numGuests, setNumGuests, maxGuests }) => {
    const increment = () => setNumGuests(prev => Math.min(prev + 1, maxGuests));
    const decrement = () => setNumGuests(prev => Math.max(prev - 1, 1));
    
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button 
                    className="flex justify-between items-center p-2 pt-3 w-full text-left rounded-b-xl hover:bg-gray-100 focus:outline-none"
                >
                    <div className="flex flex-col">
                        <span className="text-xs font-bold uppercase">Guests</span>
                        <span className="text-sm text-gray-700 font-normal">
                            {numGuests} guest{numGuests > 1 ? 's' : ''}
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
            </PopoverTrigger>

            <PopoverContent 
                className="w-72 p-4 z-50 shadow-2xl rounded-xl" 
                align="end" 
            >
                <div className="flex justify-between items-center">
                    <span className="font-medium">Adults</span>
                    <div className="flex items-center space-x-3">
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={decrement} 
                            disabled={numGuests <= 1}
                            className="rounded-full h-8 w-8 border-gray-400 text-gray-700 hover:bg-gray-100"
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-4 text-center text-lg">{numGuests}</span>
                        <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={increment} 
                            disabled={numGuests >= maxGuests}
                            className="rounded-full h-8 w-8 border-gray-400 text-gray-700 hover:bg-gray-100"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Max {maxGuests} guests allowed.</p>
            </PopoverContent>
        </Popover>
    );
};


// ==============================================================================
// 3. MAIN COMPONENT
// ==============================================================================
export default function PropertyDetails() {
  
  const Router = useRouter();
  const { id } = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
   const [showChat, setShowChat] = useState(false);
  
  console.log(id,'this is for cheack')
  // State for Booking Widget
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const [numGuests, setNumGuests] = useState(1); 
  
  
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const response = await axios.get(`/api/property/${id}`);
      return response.data.data
    }
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["property-reviews", id],
    queryFn: async () => {
      const res = await axios.get(`/api/reviews?propertyId=${id}`);
      return res.data;
    },
  });

  // Derived Values
  const pricePerNight = property?.pricePerNight || 0;
  const maxGuests = property?.maxGuests || 1;
  
  const nights = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) 
    : 0;

  const subtotal = pricePerNight * nights;
  const serviceFee = nights > 0 ? Math.ceil(subtotal * 0.15) : 0; // 15% service fee
  const total = subtotal + serviceFee;

  const handleReserve = async () => {
    if (!session) {
        toast.error("You must be logged in to reserve a property.");
        return;
    }
    if (!dateRange?.from || !dateRange?.to || nights <= 0 || numGuests === 0) {
        toast.error("Please select valid check-in/check-out dates.");
        return;
    }
    
    setLoading(true);

    try {
      const bookingDetails = {
        propertyId: id,
        userId: session?.user._id,
        // Convert dates to ISO string for API payload
        checkInDate: dateRange.from.toISOString(),
        checkOutDate: dateRange.to.toISOString(),
        guests: numGuests,
        totalPrice: total,
      };

      const bookingResponse = await axios.post("/api/bookings", bookingDetails);

      if (bookingResponse.data.booking) {
        toast.success("Booking created successfully!");
        Router.push('/dashboard/guest/payments');
      }
    } catch (error) {
      console.error("Failed to create booking or Stripe session:", error);
      toast.error("Failed to create booking.");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 my-20 md:my-40 min-h-screen flex items-center justify-center">
        <LoaderOne />
      </div>
    );
  }
  if (!property) return <div className="max-w-7xl mx-auto px-4 my-20 min-h-screen">Property not found.</div>

  const averageRating = reviewsData?.averageRating || property.averageRating || 4.8;
  const reviewCount = reviewsData?.reviewCount || property.reviewCount || 0;

  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];
  const secondaryImages = property.images?.filter(img => img !== primaryImage);

const userId=session?.user._id.toString()
const hostId=property?.hostId._id.toString()

  return (
    <div className="max-w-[1300px] mx-auto px-6 md:px-10 my-10 md:my-20">
      {/* Title & Info Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">
          {property.title}
        </h1>
        <div className="flex items-center text-gray-700 mt-2 text-base">
          <Star className="w-4 h-4 text-gray-800 mr-1" fill="currentColor" />
          <span className="font-semibold mr-1">
            {averageRating.toFixed(2)}
          </span>
          <span className="mx-1">•</span>
          <span className="underline cursor-pointer hover:text-gray-900">
            {reviewCount} reviews
          </span>
          <span className="mx-1">•</span>
          <MapPin className="w-4 h-4 mr-1" />
          <span className="underline cursor-pointer hover:text-gray-900">
            {property.city}, {property.country}
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 mt-6 rounded-xl overflow-hidden shadow-lg">
        {/* Large Primary Image */}
        {primaryImage && (
          <motion.img
            src={primaryImage.url}
            alt="Primary Property Image"
            className="col-span-2 row-span-2 object-cover w-full h-full min-h-[300px] cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        )}
        {/* Smaller Secondary Images */}
        {secondaryImages?.slice(0, 4).map((img, idx) => (
          <motion.img
            key={idx}
            src={img.url}
            alt={`Property Image ${idx + 2}`}
            className={`object-cover w-full h-full min-h-[150px] cursor-pointer ${
              idx === 1 ? 'rounded-tr-xl' : idx === 3 ? 'rounded-br-xl' : '' 
            }`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-10">
        {/* Left: Property Info & Reviews */}
        <div className="lg:col-span-2">
            <div className="pb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Entire place hosted by Host Name
                </h2>
                <div className="flex flex-wrap gap-4 text-gray-700 text-base mt-2">
                  <div className="flex items-center gap-1">
                    {property.maxGuests} guests
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    {property.bedrooms} bedrooms
                  </div>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    {property.bathrooms} baths
                  </div>
                </div>
            </div>
            <Separator className="my-6" />
            <p className="text-gray-800 leading-relaxed">{property.description}</p>
            <Separator className="my-6" />
            
            {/* Amenities, ReviewsList, Map sections */}
            <h2 className="text-lg font-semibold mt-8 mb-3">What this place offers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.amenities?.map((a) => (
                <div
                  key={a._id}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <span>• {a.name}</span>
                </div>
              ))}
            </div>

            <Separator className="my-6" />
            <ReviewsList propertyId={id}></ReviewsList>
            <Separator className="my-6" />
            
            <h2 className="text-lg font-semibold mt-8 mb-3">Where you’ll be</h2>
              <div className="rounded-xl overflow-hidden border">
                <iframe
                  title="map"
                  src={`https://maps.google.com/maps?q=${property.location.coordinates[1]},${property.location.coordinates[0]}&z=15&output=embed`}
                  className="w-full h-64"
                  loading="lazy"
                />
              </div>
        </div>

        {/* Right: Booking Card (Sticky) */}
        <div>
          <Card className="shadow-2xl sticky top-28 border rounded-xl p-6">
            <CardContent className="p-0">
              {/* Price and Rating Header */}
              <div className="flex items-baseline justify-between mb-4">
                <p className="text-2xl font-semibold">
                  ${pricePerNight}
                  <span className="text-base text-gray-600 font-normal"> / night</span>
                </p>
                <div className="flex items-center text-sm text-gray-700">
                  <Star className="w-4 h-4 text-gray-900 mr-1" fill="currentColor" />
                  <span className="font-medium">{averageRating.toFixed(2)}</span>
                  <span className="mx-1">•</span>
                  <span className="underline">{reviewCount} reviews</span>
                </div>
              </div>

              {/* Check-in / Check-out / Guests Inputs */}
              <div className="border border-gray-300 rounded-xl mb-4">
                {/* Dates Section */}
                <AirbnbDatePicker dateRange={dateRange} setDateRange={setDateRange} />
                
                {/* Guests Section */}
                <div className="border-t border-gray-300">
                    <GuestSelector 
                        numGuests={numGuests} 
                        setNumGuests={setNumGuests} 
                        maxGuests={maxGuests}
                    />
                </div>
              </div>

              {/* Reserve Button */}
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 text-lg rounded-lg transition duration-200"
                onClick={handleReserve}
                disabled={loading || !session || nights <= 0}
              >
                {loading 
                    ? 'Reserving...' 
                    : (nights > 0 ? `Reserve for ${nights} night${nights > 1 ? 's' : ''}` : (session ? 'Check availability' : 'Log in to Reserve'))}
              </Button>

              <p className="text-sm text-gray-500 mt-3 text-center">
                You won’t be charged yet
              </p>
              
              {/* Price Calculation */}
              {nights > 0 && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-2 text-gray-800 text-base">
                    <div className="flex justify-between">
                        <span className="underline">${pricePerNight} x {nights} night{nights > 1 ? 's' : ''}</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="underline">Service fee</span>
                        <span>${serviceFee.toFixed(2)}</span>
                    </div>
                    <Separator className="my-4" />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total before taxes</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>



      {/* -------------------------------chat app-------------------------- */}
         <div className="p-6">
      <h1 className="text-2xl font-semibold">{property.title}</h1>

      <button
        onClick={() => setShowChat(!showChat)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        {showChat ? "Close Chat" : "💬 Chat with Owner"}
      </button>

      {showChat && (
        <div className="mt-6">
          <ChatBox
            apiKey={process.env.NEXT_PUBLIC_STREAM_API_KEY}
            userId={userId}
            userName={"Guest"}
            hostId={hostId}
            hostName={"Owner"}
          />
        </div>
      )}
    </div>


    </div>
  );
}