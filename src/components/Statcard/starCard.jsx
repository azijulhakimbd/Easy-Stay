import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react'; // Example icons
import { Badge } from '../ui/badge';

// --- StatsCard Component ---
const StatsCard = ({
 title,
  value,
  timePeriod,
 isPositive=false,
 
 
}) => {
  
  // Determine the color for the change indicator (background/text for both light/dark)
  // Note: We use fixed colors here that work well in both modes.
  const changeColorClasses = isPositive
    ? 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-300'
    : 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-300';

  // Determine the icon based on the trend
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
     const getStatusBadge = (status) => {
     let colorClass = 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    let statusText = status;

  switch (status.toLowerCase()) {
   
       case 'completed':
      colorClass = 'bg-green-400 text-green-700 hover:bg-green-200';
      break;
       case 'confirmed':
      colorClass = 'bg-green-100 text-green-700 hover:bg-green-200';
      break;
    case 'pending':
      colorClass = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
      break;
    case 'cancelled':
      colorClass = 'bg-red-100 text-red-700 hover:bg-red-200';
      break;
    default:
  
      break;
  }
   return (
        <Badge className={`text-[18px] px-2 py-0.5 font-medium rounded-full ${colorClass}`}>
          {statusText}
        </Badge>
      );
    }
     
  
 return ( 
     <div className={ ` 
       
        rounded-xl shadow-lg 
        p-2 
        border border-gray-100 dark:border-gray-700
        transition-colors duration-300 
        hover:shadow-xl 
       `}>
      
      {/* Header and Title */}
      <div className="flex flex-col justify-between items-center">
        <h1 className="my-4
            text-2xl font-bold 
            text-gray-500 dark:text-gray-400 
            uppercase tracking-wider
          ">
            {getStatusBadge(title)}
         
        </h1>
        {/* Action Menu Placeholder */}
        <span className="text-gray-300 dark:text-gray-600 hover:text-gray-500 cursor-pointer">...</span>
      </div>

      {/* Main Value and Time Period */}
      <div className="">
        <p className="
            text-4xl font-bold text-center
            text-gray-900 dark:text-white
          ">
          {value}
        </p>
        <p className="
            text-xs 
            text-gray-400 dark:text-gray-500 
            mt-1
          ">
          {timePeriod}
        </p>
        
      </div>

   
    </div>
  
)}

export default StatsCard