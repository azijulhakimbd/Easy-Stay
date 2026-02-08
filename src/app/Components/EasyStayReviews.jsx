'use client'
import React from 'react';
import { Star, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { LoaderOne } from '@/components/ui/loader';

// --- MOCK REVIEW DATA (Used for static display on the landing page) ---
const MOCK_DATA = {
  "reviewCount": 8,
  "averageRating": 4.8,
  "reviews": [
    { "_id": "rev_001", "userName": "Emily R.", "rating": 5, "comment": "Absolutely perfect stay! The place was spotless, the bed was incredibly comfortable, and the communication with the host was prompt and helpful. Highly recommend!", "createdAt": "2024-10-01T10:00:00Z", "adminReply": "" },
    { "_id": "rev_002", "userName": "David Chen", "rating": 5, "comment": "The location is fantastic, right near all the major attractions. Check-in was super easy. The apartment looked exactly like the photos.", "createdAt": "2024-09-28T14:30:00Z", "adminReply": "Thank you, David! We are thrilled you enjoyed the convenient location." },
    { "_id": "rev_003", "userName": "Sarah & Tom", "rating": 4, "comment": "Great experience overall. The only slight issue was the noise from the street on Friday night, but otherwise, everything was lovely and well-stocked.", "createdAt": "2024-09-25T08:15:00Z", "adminReply": "We appreciate the feedback, Sarah and Tom. We'll look into better sound insulation for the front window." },
    { "_id": "rev_004", "userName": "Anonymous Guest", "rating": 5, "comment": "Flawless communication and exceptional cleanliness. A true gem! Would definitely stay here again when visiting the city.", "createdAt": "2024-09-20T17:00:00Z", "adminReply": "" },
    { "_id": "rev_005", "userName": "Michael K.", "rating": 4, "comment": "The amenities were exactly as described. The coffee machine was a nice touch! Had a small issue with the Wi-Fi initially, but the host fixed it within an hour.", "createdAt": "2024-09-15T12:45:00Z", "adminReply": "We're glad we could quickly resolve the Wi-Fi for you, Michael. Thanks for your patience!" },
    { "_id": "rev_006", "userName": "Jessica H.", "rating": 5, "comment": "Excellent value for money. Plenty of space for our family of four. The kitchen was very well-equipped for cooking meals.", "createdAt": "2024-09-10T09:00:00Z", "adminReply": "" },
    { "_id": "rev_007", "userName": "Ravi S.", "rating": 5, "comment": "The host went above and beyond to make us feel welcome. Personalized notes and local recommendations were much appreciated!", "createdAt": "2024-09-05T19:20:00Z", "adminReply": "It was our pleasure, Ravi. We hope to welcome you back soon!" },
    { "_id": "rev_008", "userName": "Chloe L.", "rating": 5, "comment": "The photos don't do this place justice! It's even more beautiful in person. A very stylish and cozy retreat.", "createdAt": "2024-09-01T11:55:00Z", "adminReply": "" }
  ]
};


// Helper component for star visualization
const StarRating = ({ rating = 0, size = 18 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={size} fill="#FFC107" color="#FFC107" />
      ))}
      {hasHalfStar && <Star key="half" size={size} fill="#FFC107" color="#FFC107" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} color="#B0B0B0" />
      ))}
    </div>
  );
};

// Review Card Component (Airbnb Style - adjusted for compact grid)
const ReviewCard = ({ review }) => {
  console.log(review)
  return (
    <div className="p-5 border border-gray-100 rounded-2xl bg-white dark:bg-black shadow-xl hover:shadow-2xl transition duration-500 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-start mb-3">
          {/* Placeholder for user avatar/icon */}
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 shrink-0">
            <User size={20} />
          </div>
          <div className="truncate">
            <p className="font-semibold text-gray-900 dark:text-neutral-300 ">{review.userId?.username}</p>
            <p className="text-xs text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            </p>
          </div>
        </div>
        <StarRating rating={review.rating} size={16} />
        {/* Clamp text to ensure cards in the grid are of similar height */}
        <p className="mt-3 text-gray-700 dark:text-neutral-300 leading-snug text-sm line-clamp-4 min-h-[5rem]">
          {review.comment}
        </p>
      </div>
      {review.adminReply && (
        <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs italic  text-gray-500 line-clamp-2">
                <span className="font-medium dark:text-neutral-300">Host Reply:</span> {review.adminReply}
            </p>
        </div>
      )}
    </div>
  );
};


// Main component for the Landing Page
export default function LandingPageReviewGrid() {
const {data:reviewData,isPending,isLoading,isError,error}=useQuery({
  queryKey:["reviews",'list'],
  queryFn:async()=>{
    const response=await axios.get("/api/reviews?latest-review=true")
    return response.data

  },
  staleTime:10000
})

if (isLoading) {
  return <div className='flex justify-center items-center'><LoaderOne/></div>;
}

// Handle error state
if (isError) {
  return <div>Error loading reviews: {error.message}</div>;
}

  const { averageRating, reviewCount, reviews } =reviewData ;
  
  
  // Display only the top 6 reviews for a clean grid on the landing page
  

  return (
    
  <div className="max-w-7xl mx-auto px-4 py-16">
      
      {/* Section Header with Overall Rating */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-3">
          What Our <span className='text-blue-400'>Guests Are Saying</span>
        </h2>
        <div className="flex items-center justify-center gap-3 text-xl text-gray-600">
          <span className="font-bold text-blue-600">{averageRating.toFixed(1)}</span>
          <StarRating rating={averageRating} size={22} />
          <span className="text-gray-500">
             • {reviewCount} verified stays
          </span>
        </div>
      </div>
      
      {/* Reviews Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>

      {/* Optional CTA to view all reviews */}
    
    </div>
  );
}
