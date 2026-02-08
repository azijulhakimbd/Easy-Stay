"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";

export default function UserAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/api/allanalytics");
        setData(res.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const totalUsers = data?.totalUser?.[0]?.totalUser || 0;
  const totalProperties = data?.totalProperty?.[0]?.totalProperty || 0;
  const totalBookings = data?.totalBookings?.[0]?.totalBookings || 0;
  const bookingsAnalytics = data?.bookingsAnalytics || [];

  // Find the most active month (highest revenue)
//   const popularMonth = bookingsAnalytics.reduce(
//   (max, current) =>
//     current.totalRevenue > max.totalRevenue ? current : max,
//   { totalRevenue: 0 } // initial fallback value
// );

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {/* Stat Cards */}
      <Card className="shadow-sm border rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-700 text-lg">Total Properties</CardTitle>
        </CardHeader>
        <CardContent className='ml-4'>
          <p className="text-3xl font-bold text-blue-800">{totalProperties}</p>
          <p className="text-sm text-blue-600 mt-1">Available for booking</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border rounded-2xl bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader>
          <CardTitle className="text-green-700 text-lg">Active Users</CardTitle>
        </CardHeader>
        <CardContent className='ml-4'>
          <p className="text-3xl font-bold text-green-800">{totalUsers}</p>
          <p className="text-sm text-green-600 mt-1">Trusted members</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm border rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader>
          <CardTitle className="text-purple-700 text-lg">Total Bookings</CardTitle>
        </CardHeader>
        <CardContent className='ml-4'>
          <p className="text-3xl font-bold text-purple-800">{totalBookings}</p>
          <p className="text-sm text-purple-600 mt-1">Completed so far</p>
        </CardContent>
      </Card>

      {/* Popular Month */}
      <Card className="md:col-span-3 shadow-sm border rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100">
        <CardHeader>
          <CardTitle className="text-yellow-700 text-lg">Most Popular Month</CardTitle>
        </CardHeader>
        <CardContent className='ml-4'>
          {/* <p className="text-2xl font-semibold text-yellow-800">{popularMonth.month}</p> */}
          <p className="text-sm text-yellow-700 mt-1">
            This month had the highest booking activity on our platform.
          </p>
        </CardContent>
      </Card>

      {/* Chart */}
      <Card className="md:col-span-3 border shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Booking Activity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
                labelStyle={{ fontWeight: "bold" }}
              />
              <Bar dataKey="totalRevenue" fill="#8884d8" radius={[8, 8, 0, 0]} name="Activity Level" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-500 mt-2 text-center">
            *Chart represents booking popularity per month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
