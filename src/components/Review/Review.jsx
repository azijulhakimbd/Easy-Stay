import React from 'react';
import { Star, CheckCircle } from 'lucide-react';


const StarRating = ({ rating, size = 'w-4 h-4' }) => {
  const fullStars = Math.round(rating);
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        className={`${size} ${i <= fullStars ? 'text-black fill-black' : 'text-gray-300'}`}
        fill={i <= fullStars ? 'currentColor' : 'none'}
        strokeWidth={2}
        aria-hidden="true"
      />
    );
  }
  return <div className="flex space-x-0.5">{stars}</div>;
};


const formatDate = (dateString) => {
  if (!dateString) return 'Unknown Date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
};


const ReviewCard = ({ review }) => {
 
  const mockReview = {
    reviewerName: 'Alice Johnson', 
    rating: 4.5,
    comment: 'The apartment was spotless and the check-in process was seamless. Great natural light! We thoroughly enjoyed our stay. Highly recommend for short-term rentals, although the parking was a bit tight.',
    // Photos section is removed as requested
    photos: [], 
    verified: true,
    adminReply: 'Thank you so much for your kind words, Alice! We are delighted you enjoyed your stay and hope to welcome you back soon!',
    createdAt: new Date('2024-10-26T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-27T12:30:00Z').toISOString(),
  };

  const data = review || mockReview;

  return (
    <div className="max-w-xl w-full mx-auto bg-white rounded-xl p-0 shadow-none border-b border-gray-200">
      
      {/* HEADER: Avatar, Name, and Date (Classic Airbnb layout) */}
      <div className="flex items-center space-x-4 mb-4">
        
        {/* Avatar */}
        <img 
          className="h-14 w-14 rounded-full object-cover flex-shrink-0" 
          src={`https://placehold.co/56x56/D3D3D3/000?text=${data.reviewerName.charAt(0)}`}
          alt={`${data.reviewerName} avatar`}
        />
        
        {/* Name and Date */}
        <div>
          <p className="font-semibold text-gray-900 text-base">{data.reviewerName}</p>
          <p className="text-sm text-gray-500">{formatDate(data.createdAt)}</p>
        </div>
      </div>

      {/* REVIEW BODY: Comment and Rating */}
      <div className="review-body">
        {/* Comment Text (Primary Focus) */}
        <p className="text-gray-700 text-base leading-relaxed mb-4">
          {data.comment}
        </p>

        {/* Rating and Verification Badge (Subtle and inline) */}
        <div className="flex items-center space-x-3 text-sm text-gray-700 font-medium pb-4">
            <div className="flex items-center space-x-1">
                <StarRating rating={data.rating} size="w-3.5 h-3.5" />
                <span className="ml-1">{data.rating.toFixed(1)}</span>
            </div>
            
            <span className="text-gray-400">|</span>

            {data.verified && (
                <span className="inline-flex items-center text-green-700">
                    <CheckCircle className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
                    Verified Stay
                </span>
            )}
        </div>
      </div>
    </div>
  );
};

// Exporting the component and the mock data for easy use in an App wrapper
export default function App() {
  const mockReviewData = {
    reviewerName: 'Alice Johnson',
    rating: 4.5,
    comment: 'The apartment was spotless and the check-in process was seamless. Great natural light! We thoroughly enjoyed our stay. Highly recommend for short-term rentals, although the parking was a bit tight.',
    photos: [],
    verified: true,
    adminReply: 'Thank you so much for your kind words, Alice! We are delighted you enjoyed your stay and hope to welcome you back soon!',
    createdAt: new Date('2024-10-26T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-27T12:30:00Z').toISOString(),
  };
  
  const unverifiedReview = {
    reviewerName: 'Bob Smith',
    rating: 2.0,
    comment: 'The heating did not work properly and the Wi-Fi was very slow. It needs maintenance, but the location was good.',
    photos: [],
    verified: false,
    adminReply: '', // Empty reply
    createdAt: new Date('2024-10-20T10:00:00Z').toISOString(),
    updatedAt: new Date('2024-10-21T09:00:00Z').toISOString(),
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">Property Reviews</h1>
        
        <div className="space-y-6 max-w-lg mx-auto">
            <ReviewCard review={mockReviewData} />
            <ReviewCard review={unverifiedReview} />
            <ReviewCard review={{
                reviewerName: 'Charlie Brown',
                rating: 5.0,
                comment: 'Perfect location and exactly as described. The host was very communicative and helpful. Five stars!',
                photos: [],
                verified: true,
                adminReply: '',
                createdAt: new Date('2024-10-01T10:00:00Z').toISOString(),
                updatedAt: new Date('2024-10-01T10:00:00Z').toISOString(),
            }} />
        </div>
    </div>
  );
}
