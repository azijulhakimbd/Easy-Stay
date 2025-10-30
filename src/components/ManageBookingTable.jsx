'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderThree } from './ui/loader';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Pagination, PaginationContent, PaginationItem } from './ui/pagination';

export default function ManageBookingTable() {

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { data: session, status } = useSession();
    const limit=5;
    const skip=0
 



   const { data: bookings, isLoading:loading, error } = useQuery({
     queryKey: ["bookings", limit, skip, session?.user?.id],
     queryFn: async () => {
       const response = await axios.get(`/api/bookings`, {
         params: { limit, skip, id: session?.user?._id },
       });
       return response.data;
     },
     enabled: !!session?.user?._id,
     staleTime:10000 // Only run if session.user.id exists
     
   });
 

    // Update booking status
    const handleBookingUpdate = async (id, newStatus) => {
        try {
            const confirm = await Swal.fire({
                title: `Change status to ${newStatus}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel',
            });
            if (!confirm.isConfirmed) return;

            const response = await fetch(`/api/bookings/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            const result = await response.json();
            if (response.ok) {
                setBookings((prev) =>
                    prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
                );
                Swal.fire('Updated!', `Booking marked as ${newStatus}.`, 'success');
            } else {
                throw new Error(result.error || 'Update failed');
            }
        } catch (err) {
            Swal.fire('Error!', err.message, 'error');
        }
    };



    // UI states
    if (loading) {
        return (
            <div className=" flex items-center justify-center text-gray-600">
              <LoaderThree/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
                <p className="text-lg text-red-400 font-semibold mb-3">Error: {error?.message}</p>
             
            </div>
        );
    }

    return (
        <div className="  bg-gray-50 py-6 md:py-20">
            <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 uppercase antialiased">Latest Bookings</h1>
                
                </div>

                {/* Search + Filter */}
               

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-2 py-3 text-center">User ID</th>
                                <th className="px-2 py-3 text-center">Property ID</th>
                                <th className="px-2 py-3 text-center">Check-In</th>
                                <th className="px-2 py-3 text-center">Check-Out</th>
                                <th className="px-2 py-3 text-center">Status</th>
                             
                            </tr>
                        </thead>
                        <tbody>
                            {bookings?.data ? (
                                bookings?.data.map((booking) => (
                                    <tr
                                        key={booking._id}
                                        className="border-t hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-center">{booking.userId}</td>
                                        <td className="px-4 py-3 text-center">{booking.propertyId}</td>
                                        <td className="px-4 py-3 text-center">
                                            {new Date(booking.checkInDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {new Date(booking.checkOutDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 capitalize font-medium text-center">{booking.status}</td>
                                       

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-6 text-center text-gray-500 italic">
                                        No bookings found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>

                  

            </div>
        </div>
    );
}
