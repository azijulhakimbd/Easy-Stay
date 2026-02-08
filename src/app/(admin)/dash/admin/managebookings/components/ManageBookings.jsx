'use client';

import { useEffect, useState } from 'react';
import { Loader2, Search, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export default function ManageBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { data: session, status } = useSession();
    const userId = session?.user?._id;
    console.log(session);
    console.log(userId);


    const fetchBookings = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await fetch(`/api/bookings?userId=${userId}`);
            if (!response.ok) throw new Error('Failed to fetch bookings');
            const result = await response.json();
            setBookings(result.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchBookings();
    }, [userId]);

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

    const filteredBookings = bookings.filter((booking) => {
        const matchesSearch =
            booking.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.propertyId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || booking.status === statusFilter;
        return matchesSearch && matchesStatus;
    });


    // UI states
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                <Loader2 className="animate-spin mr-2" /> Loading bookings...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
                <p className="text-lg font-semibold mb-3">Error: {error}</p>
                <button
                    onClick={fetchBookings}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-6">
            <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Bookings</h1>
                    <p className="text-gray-500">Approve or reject user bookings</p>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-6">
                    <div className="relative w-full sm:w-1/2">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by user or property..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div className="relative w-full sm:w-1/4">
                        <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="px-2 py-3">User ID</th>
                                <th className="px-2 py-3">Property ID</th>
                                <th className="px-2 py-3">Check-In</th>
                                <th className="px-2 py-3">Check-Out</th>
                                <th className="px-2 py-3">Status</th>
                                <th className="px-2 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length > 0 ? (
                                filteredBookings.map((booking) => (
                                    <tr
                                        key={booking._id}
                                        className="border-t hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-4 py-3">{booking.userId}</td>
                                        <td className="px-4 py-3">{booking.propertyId}</td>
                                        <td className="px-4 py-3">
                                            {new Date(booking.checkInDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(booking.checkOutDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 capitalize font-medium">{booking.status}</td>
                                        <td className="px-4 py-3 text-right space-x-2">
                                            {booking.status === 'pending' ? (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleBookingUpdate(booking._id, 'approved')}
                                                        className="bg-green-500 hover:bg-green-600"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleBookingUpdate(booking._id, 'rejected')}
                                                    >
                                                        Reject
                                                    </Button>
                                                </>
                                            ) : (
                                                <span
                                                    className={`px-2 py-1 rounded-lg text-white ${booking.status === 'rejected'
                                                            ? 'bg-red-500'
                                                            : booking.status === 'approved'
                                                                ? 'bg-green-500'
                                                                : 'bg-gray-400'
                                                        }`}
                                                >
                                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                </span>
                                            )}
                                        </td>

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
