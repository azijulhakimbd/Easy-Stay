'use client';

import { useTheme } from 'next-themes';


import ReviewCard from '@/components/reviewCard';
import StatsCard from '@/components/Statcard/starCard';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { LoaderFour } from '@/components/ui/loader';

import { LocationPieChart } from '@/components/LocationPieChart';
import { PingingDotChart } from '@/components/PingingDotChart';

import { MonthlyStatusLineChart } from '@/components/MonthlyStatusLineChart';
import ManageBookingTable from '@/components/ManageBookingTable';

  const Page = () => {

  const {data:session}=useSession()
  const { theme } = useTheme();

   const {data:earningsData,isLoading:earningsDataLoading}=useQuery({
    
  queryKey:['analytic',session?.user._id],
  queryFn:async () => {
    const response=await axios.get("/api/bookings",{
      params:{
        analytics:true
      }
    })
    return response.data
    
  },
  enabled: !!session?.user?._id,
    
  
  })
    const {data:allAnalytics,isLoading:allAnalyticsLoading}=useQuery({
    
  queryKey:['allAnalytic',session?.user._id],
  queryFn:async () => {
    const response=await axios.get("/api/allanalytics")
    return response.data
    
  },
  enabled: !!session?.user?._id,
    
  
  })
  



  // Custom tooltip for consistent styling
 

  // Colors for location pie chart
  
   if (allAnalyticsLoading){
    return (<div className='flex justify-center items-center'><LoaderFour/></div>)
   }

  return (
    <div className="  container  mx-auto p-4 font-inter dark:bg-black">
      {/* Header */}
      <header className="text-center mb-8 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Host Dashboard - Analytics</h1>
      </header>
      {/* Stat Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 my-10'>
 
      
           <StatsCard title='Total Earnings' value={`$ ${  allAnalytics?.analytics.totalEarnings[0].totalEarnings || 0}`} timePeriod="" />
          <StatsCard title='Total User' value={allAnalytics?.analytics.totalUser[0].totalUser || 0} timePeriod="" /> 
        <StatsCard title='Total Property' value={allAnalytics?.analytics.totalProperty[0].totalProperty || 0} timePeriod="" />
        <StatsCard title='Total Bookings' value={allAnalytics?.analytics.totalBookings[0].totalBookings || 0} timePeriod="" /> 
      
      
       
      
      

      
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* User Growth Bar Chart */}
        <PingingDotChart monthlyEarings={allAnalytics?.analytics?.monthlyEarings}/>
 <LocationPieChart locationData={allAnalytics?.analytics.locationData}/>
       
      </div>

      
     <div className='grid grid-cols-1 gap-5 md:grid-cols-4 '>
     

   
     <div className='col-span-3 '>
       <MonthlyStatusLineChart monthlyStatusData={allAnalytics?.analytics?.monthWiseStatus}/>
     </div>
      <div className='col-span-1'>
          {/* <ReviewCard reviewData={allAnalytics?.analytics?.reviewData} />  */}
      </div>
     
      
     </div>
       <div className='grid grid-cols-1  gap-5 '>
    
      <ManageBookingTable/>
        
     
      
     </div>
   
     
    </div>
  );
};

export default Page;

