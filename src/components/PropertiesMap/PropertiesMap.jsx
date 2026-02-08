"use client"
import React from 'react';
import MapView from '../MapView/MapView';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const PropertiesMap = () => {
        const {data:properties=[],isLoading}=useQuery({
    queryKey:'properties',
    queryFn:async () => {
      const response=await axios.get('/api/property',{params:{limit:60 }})
      return response.data.data
    },
    staleTime:10*60*1000
  })
  console.log(properties);
    return (
       <div className="h-[550px] w-[650px] rounded-2xl overflow-hidden  border">
       {
        isLoading ? (
          <p className="text-center mt-20">Loading map...</p>
        ) : ( <MapView properties={properties} />)
         
         }
       
      </div>
    );
};

export default PropertiesMap;