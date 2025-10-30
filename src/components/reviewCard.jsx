import React, { useMemo } from 'react';
import { StarHalf } from 'lucide-react';

// --- MOCK DATA (You will replace this with real data) ---
const mockReviewData = {
  averageRating: 4.8,
  totalReviews: 1400,
  // The counts for the distribution chart. The bar lengths are calculated based on these counts.
  ratings: {
    5: 106,
    4: 32,
    3: 0,
    2: 0,
    1: 0,
  },
};

// Array to control the order (5 to 1) for rendering the bars
const ratingLevels = [5, 4, 3, 2, 1];

// Utility function to format numbers (e.g., 1400 -> 1.4k)
const formatCount = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num?.toString();
};

// --- SHADCN/UI MIMIC COMPONENTS (Styled with Tailwind) ---

// Mimics the lucide Star icon
const StarIcon = ({ fill = 'none', className = '' }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill={fill} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// Renders the average star rating visually (e.g., 4.8 stars)
const StarRatingDisplay = ({ rating }) => {
  const fullStars = Math.floor(rating);
  // Treat rating remainder between 0.25 and 0.75 as a half-star
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75; 
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex space-x-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} fill="currentColor" className="text-yellow-500" />
      ))}
      {hasHalfStar && <StarHalf key="half" className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarIcon key={`empty-${i}`} className="text-gray-300 dark:text-gray-600" />
      ))}
    </div>
  );
};

// Mimics shadcn/ui Progress component
const ProgressBar = ({ value, className = '' }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}>
    <div
      // Bar fill color using foreground for high contrast
      className="h-full bg-foreground transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Mimics shadcn/ui Button component
const Button = ({ children, className = '', onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 
    bg-primary text-primary-foreground hover:bg-primary/90 
    dark:bg-white dark:text-black dark:hover:bg-gray-200 ${className}`}
  >
    {children}
  </button>
);

// Mimics shadcn/ui Card component
const Card = ({ children, className = '' }) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow-lg transition-colors duration-300 w-full max-w-sm ${className}`}
  >
    {children}
  </div>
);



const ReviewCard = ({ reviewData = mockReviewData }) => {
console.log(reviewData,"this is review data")
  // Calculate max count for bar length
   const ratings = reviewData?.ratings || { 5:0,4:0,3:0,2:0,1:0 };

  // Calculate max count for bar length
  const maxRatingCount = useMemo(() => {
    return Math.max(...Object.values(ratings));
  }, [ratings])
  return (
    <Card className="p-6 space-y-6 col-span-4">
      {/* 1. Key Metrics Section */}
      <div className="grid grid-cols-2 gap-4 pb-4">
        <div className="flex flex-col items-start p-4 rounded-lg bg-muted/70 dark:bg-muted/30 transition-colors">
          <span className="text-4xl font-extrabold text-foreground">{reviewData?.averageRating?.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">Average rating</span>
        </div>
        <div className="flex flex-col items-start p-4 rounded-lg bg-muted/70 dark:bg-muted/30 transition-colors">
          <span className="text-4xl font-extrabold text-foreground">{formatCount(reviewData?.totalReviews)}</span>
          <span className="text-sm text-muted-foreground">Reviews</span>
        </div>
      </div>

      {/* 2. Reviews Header and Star Rating Summary */}
      <div className="flex justify-between items-center border-b pb-4 border-border/70">
        <h3 className="text-xl font-semibold text-foreground">Reviews</h3>
        <StarRatingDisplay rating={reviewData?.averageRating} />
      </div>

      {/* 3. Rating Distribution */}
      <div className="space-y-3">
        {ratingLevels.map((star) => {
          console.log(star)
          const count = reviewData?.ratings[star] || 0;
          const percent = maxRatingCount > 0 ? (count / maxRatingCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center space-x-3">
              <span className="w-4 text-sm font-medium text-right text-foreground">{star}</span>
              <div className="flex-grow">
                <ProgressBar value={percent} />
              </div>
              <span className="w-6 text-sm text-right text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Export the main component along with the mock data for easy use in your app.
export { ReviewCard, mockReviewData };

// Export ReviewCard as the default for easy importing
export default ReviewCard;
