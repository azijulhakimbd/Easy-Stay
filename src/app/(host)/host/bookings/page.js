"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoaderFour } from "@/components/ui/loader";
import { useState } from "react";
import StatsCard from "@/components/Statcard/starCard";
import Container from "@/app/Components/Container/Container";
import { useSession } from "next-auth/react";

// Helper function for status badge
const getStatusBadge = (status) => {
  let colorClass = "bg-gray-100 text-gray-800 hover:bg-gray-200";
  let statusText = status;

  switch (status.toLowerCase()) {
    case "confirmed":
      colorClass = "bg-green-100 text-green-700 hover:bg-green-200";
      break;
    case "pending":
      colorClass = "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
      break;
    case "cancelled":
      colorClass = "bg-red-100 text-red-700 hover:bg-red-200";
      break;
    default:
      break;
  }

  return (
    <Badge className={`text-xs px-2 py-0.5 font-medium rounded-full ${colorClass}`}>
      {statusText}
    </Badge>
  );
};

const DashboardBookingsTable = () => {
  const { data: session, status } = useSession();
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);

  const { data: currentBookings, isLoading, error } = useQuery({
    queryKey: ["bookings", limit, skip, session?.user?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/bookings`, {
        params: { limit, skip, id: session?.user?._id },
      });
      return response.data;
    },
    enabled: !!session?.user?._id, // Only run if session.user.id exists
    placeholderData: keepPreviousData,
  });

  // Log session and pagination for debugging
 
  // Handle loading and error states
  if (status === "loading" || isLoading) {
    return <LoaderFour />;
  }

  if (error) {
    console.error("Error fetching bookings:", error);
    return <div className="text-red-500">Error loading bookings: {error.message}</div>;
  }

  const totalItems = currentBookings?.total;

  // Pagination logic
  const handlePrev = () => {
    setSkip((prevSkip) => Math.max(0, prevSkip - limit));
  };

  const handleNext = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  const isPrevDisabled = skip <= 0;
  const isNextDisabled = skip + limit >= totalItems;

  const buttonClasses = (isDisabled) =>
    `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md transform active:scale-95 ${
      isDisabled
        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-inner"
        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
    }`;

  const headers = ["ID", "User", "Check-in", "Check-out", "Guests", "Total Price", "Status", "Payment"];

  return (
    <Container>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {currentBookings?.statData.map((items, index) => (
          <StatsCard key={index + 1} title={items.status} value={items.count} />
        ))}
      </div>
      <h1 className="text-4xl text-center font-bold uppercase my-15">Booking Table</h1>
      <div className="flex justify-center items-center bg-gray-50">
        <div className="bg-white w-full rounded-xl shadow-lg border border-gray-100 p-6">
          <Table className="w-full text-sm text-gray-600">
            <TableHeader className="bg-white border-b border-gray-200 shadow-sm z-10">
              <TableRow className="text-left hover:bg-white/90">
                {headers.map((header, index) => (
                  <TableHead
                    key={index}
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBookings?.data.map((booking) => (
                <TableRow
                  key={booking._id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                >
                  <TableCell className="px-6 py-4 font-semibold text-gray-800">
                    #{booking._id.slice(-6)}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    {booking.userName || session?.user?.name || "Unknown"}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-500">
                    {new Date(booking.checkInDate).toDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-gray-500">
                    {new Date(booking.checkOutDate).toDateString()}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">{booking.guests}</TableCell>
                  <TableCell className="px-6 py-4 font-bold text-gray-900">
                    ${booking.totalPrice.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="px-6 py-4">{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="px-6 py-4">
                    {booking.payment_status === "success" ? (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200 text-xs px-2 py-0.5 font-medium rounded-full">
                        Paid
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-200 text-xs px-2 py-0.5 font-medium rounded-full">
                        Unpaid
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="my-6">
            <div className="flex justify-center items-center space-x-4 mt-8 p-4 rounded-2xl">
              <button
                disabled={isPrevDisabled}
                onClick={handlePrev}
                className={buttonClasses(isPrevDisabled)}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
              <button
                disabled={isNextDisabled}
                onClick={handleNext}
                className={buttonClasses(isNextDisabled)}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DashboardBookingsTable;