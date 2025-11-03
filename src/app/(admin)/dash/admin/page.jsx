"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AnalyticsOverview() {
  const [userGrowth, setUserGrowth] = useState([]);
  const [roleData, setRoleData] = useState([]);
  const [bookingsByCity, setBookingsByCity] = useState([]);
  const [loading, setLoading] = useState(true);

  const ROLE_COLORS = ["#2563eb", "#10b981", "#f97316"];

  // Fetch Role Distribution
  useEffect(() => {
    axios
      .get("/api/analytics/role-distribution")
      .then((res) => setRoleData(res.data))
      .catch(() => setRoleData([]));
  }, []);

  // Fetch Bookings by City/Division
  useEffect(() => {
    axios
      .get("/api/analytics/bookings-by-city")
      .then((res) => setBookingsByCity(res.data.data))
      .catch(() => setBookingsByCity([]));
  }, []);

  // Fetch User Growth
  useEffect(() => {
    axios
      .get("/api/analytics/user-growth")
      .then((res) => {
        setUserGrowth(res.data);
        setLoading(false);
      })
      .catch(() => setUserGrowth([]));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">

      {/* 🧠 User Growth Chart */}
      <Card className="shadow-sm border rounded-2xl lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">User Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="newUsers"
                stroke="#4f46e5"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 👥 User Role Distribution */}
      <Card className="shadow-sm border rounded-2xl">
  <CardHeader>
    <CardTitle className="text-lg">User Role Distribution</CardTitle>
  </CardHeader>
  <CardContent className="flex flex-col items-center">
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={roleData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {roleData.map((entry, index) => (
            <Cell
              key={index}
              fill={ROLE_COLORS[index % ROLE_COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>

    {/* Display roles without hover */}
    <div className="mt-4 flex flex-col gap-2 w-full">
      {roleData.map((role, index) => (
        <div key={index} className="flex justify-between px-2">
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: ROLE_COLORS[index % ROLE_COLORS.length] }}
            />
            {role.name || role.label || `Role ${index + 1}`}
          </span>
          <span>{role.value}</span>
        </div>
      ))}
    </div>
  </CardContent>
</Card>


      {/* 📦 Bookings by Division */}
      <Card className="shadow-sm border rounded-2xl lg:col-span-3">
        <CardHeader>
          <CardTitle className="text-lg">Bookings by Division</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingsByCity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="city" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow-md">
                        <p className="font-semibold">{data.city}</p>
                        <p>Bookings: {data.bookings}</p>
                        <p>Revenue: ${data.totalRevenue}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="bookings"
                fill="#6366f1"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    </div>
  );
}
