import { Map, Star } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const ReuseableCard = ({
    property
}) => {
    return (
         <Link href={`/stays/${property._id}`} >
                <div
                  className="border rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full"
                >
                  <img
                    src={property.images?.[0]?.url}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    
                    {/* Review Information */}
                    <div className="flex items-center text-sm mb-1 text-gray-800 ">
                      <Star className="text-yellow-500 mr-1" />
                      <span className="font-semibold dark:text-neutral-300">{property.averageRating}</span>
                      <span className="text-gray-500 dark:text-neutral-300">
                        ({property.reviewCount || 0} reviews)
                      </span>
                    </div>
                    
                    {/* Title with line-clamp for consistent height */}
                    <h3 className="font-semibold text-lg dark:text-neutral-300  line-clamp-2 min-h-[3rem]">
                      {property.title}
                    </h3>
                    
                    {/* Location and Price pushed to bottom */}
                    <div className="mt-auto">
                      <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-neutral-300">
                        <Map className="mr-1" /> {property.city}
                      </div>
                      <p className="font-bold dark:text-neutral-300 mt-2">
                        ${property.pricePerNight}{' '}
                        <span className="font-normal text-gray-600 dark:text-neutral-300">/ night</span>
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
    );
};

export default ReuseableCard;