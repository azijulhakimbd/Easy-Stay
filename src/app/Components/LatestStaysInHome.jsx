'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoLocation } from 'react-icons/go';
import { Skeleton } from '@/components/ui/skeleton';
import Container from './Container/Container';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Map, Star } from 'lucide-react';
import ReuseableCard from '@/components/reuseableCard/ReuseableCard';

const LatestStaysInHome = () => {

 
  const {data:latestProperties,isLoading}=useQuery({
    queryKey:['latestProperties'],
    queryFn:async()=>{
      const res=await fetch('/api/property?mostReviewed=true');
      const data=await res.json();
      return data.data;
    },
    staleTime:10*60*1000
})
  



  return (
    <Container>
    <div className=" py-24">
      <h2 className="text-4xl dark:text-neutral-300 font-bold mb-6 text-center p-5">
        Latest <span className="text-blue-500">Stays</span>
      </h2>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
            >
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {latestProperties && latestProperties.map((property) => {
 
    return (
     <ReuseableCard property={property} key={property._id}  />
    );
  })}
</div>
      )}
    </div>
    </Container>
  );
};

export default LatestStaysInHome;
