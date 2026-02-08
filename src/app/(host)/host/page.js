'use client';

import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { AnimatedList } from '@/components/ui/animated-list';
import { cn } from '@/lib/utils';
import ReviewCard from '@/components/reviewCard';
import StatsCard from '@/components/Statcard/starCard';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { LoaderFour } from '@/components/ui/loader';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

  const Page = ({
userGrowthData = [
    { month: 'Jan', users: 200 },
    { month: 'Feb', users: 300 },
    { month: 'Mar', users: 400 },
    { month: 'Apr', users: 350 },
    { month: 'May', users: 450 },
  ],

  reviewData = [
    { stars: '5 Stars', count: 300, percentage: 60 },
    { stars: '4 Stars', count: 125, percentage: 25 },
    { stars: '3 Stars', count: 50, percentage: 10 },
    { stars: '2 Stars', count: 15, percentage: 3 },
    { stars: '1 Star', count: 10, percentage: 2 },
  ],
  locationData = [
    { location: 'New York, USA', users: 250 },
    { location: 'London, UK', users: 180 },
    { location: 'Tokyo, Japan', users: 150 },
    { location: 'Sydney, Australia', users: 120 },
    { location: 'Paris, France', users: 100 },
  ],
  bookingsData = [
    { id: '#001', guest: 'John Doe', property: 'Cozy Apartment', date: '2025-10-01', amount: 150 },
    { id: '#002', guest: 'Jane Smith', property: 'Luxury Villa', date: '2025-09-28', amount: 300 },
    { id: '#003', guest: 'Mike Johnson', property: 'Beach House', date: '2025-09-25', amount: 200 },
  ],
}) => {

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
  

console.log(allAnalytics)

  // Custom tooltip for consistent styling
  const CustomTooltip = ({ active, payload, label, type }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className={`p-3 rounded-lg shadow-lg ${
          theme === 'dark' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white'
        }`}>
          {type === 'userGrowth' && (
            <>
              <p className="font-semibold">Month: {label}</p>
              <p>Users: {dataPoint.users}</p>
            </>
          )}
          {type === 'earnings' && (
            <>
              <p className="font-semibold">Month: {label}</p>
              <p>Earnings: ${dataPoint.earnings}</p>
            </>
          )}
          {type === 'reviews' && (
            <>
              <p className="font-semibold">{dataPoint.stars}</p>
              <p>{dataPoint.count} reviews</p>
              <p>{dataPoint.percentage}%</p>
            </>
          )}
          {type === 'locations' && (
            <>
              <p className="font-semibold">{dataPoint.location}</p>
              <p>{dataPoint.users} users</p>
              <p>{((dataPoint.users / locationData.reduce((sum, d) => sum + d.users, 0)) * 100).toFixed(1)}%</p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  // Colors for location pie chart
  const locationColors = [
    '#3498db',
    '#2ecc71',
    '#e74c3c',
    '#f1c40f',
    '#9b59b6',
  ];
   if (allAnalyticsLoading){
    return (<div className='flex justify-center items-center'><LoaderFour/></div>)
   }

  return (
    <div className="container mx-auto p-4 font-inter">
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
        <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Growth Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userGrowthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#e0e0e0' : '#2c3e50' }} fontSize={12} />
                  <YAxis tick={{ fill: theme === 'dark' ? '#e0e0e0' : '#2c3e50' }} fontSize={12} />
                  <Tooltip content={<CustomTooltip type="userGrowth" />} />
                  <Bar dataKey="users" fill="#3498db" background={{ fill: theme === 'dark' ? '#1f2937' : '#f3f4f6' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Earnings Line Chart */}
        <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">Earnings Graph</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData?.monthlyRevenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                  <XAxis dataKey="month" tick={{ fill: theme === 'dark' ? '#e0e0e0' : '#2c3e50' }} fontSize={12} />
                  <YAxis tick={{ fill: theme === 'dark' ? '#e0e0e0' : '#2c3e50' }} fontSize={12} />
                    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
    
    </Tooltip>
                  <Line type="monotone" dataKey="totalRevenue" stroke="#2ecc71" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      
     <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
     

       <Card className="shadow-lg transition-shadow duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">User Location Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] max-w-[400px] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allAnalytics?.analytics.locationData}
                  dataKey="users"
                  nameKey="location"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                >
                  {locationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={locationColors[index % locationColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip type="locations" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <ReviewCard/>
     </div>
   
     
    </div>
  );
};

export default Page;

