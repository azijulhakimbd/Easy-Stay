"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation"; // Next.js 13 app router
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoaderOne } from "@/components/ui/loader";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, BadgeDollarSignIcon } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";


export default function PaymentStatusTable({session}) {
  
  const queryClient = useQueryClient();
  const searchParams=useSearchParams()
  const router=useRouter()
  const params= new URLSearchParams(searchParams)
  const limit=parseInt(searchParams.get("limit") || 5)
  const skip=parseInt(searchParams.get('skip') || 0)


 
 
useEffect(()=>{
   if (!searchParams.get('limit') || !searchParams.get('skip') ){
        params.set("limit",limit)
      params.set("skip",skip)
        router.replace(`?${params.toString()}`)
      }
},[])

const {data:bookings,isLoading:bookingsLoading,isError}=useQuery({
  queryKey:['bookings',session?.user?._id,limit,skip],
  queryFn:async()=>{
    const res=await axios.get(`/api/bookings/upcoming?userId=${session.user._id}`,{params:{
      limit,skip
    }});
     return res.data || [];
  },
  enabled:!!session?.user?._id,
  staleTime:1000*60*10,
  cacheTime:1000*60*10,
  keepPreviousData : true
  })


const handleInvoice = (booking) => {
  // Redirect to invoice page with query params
  router.push(`/dashboard/guest/invoice/${booking}`);
};

  const handleCheckout = async (propertyId,amount,bookingId) => {

    
    try {
      const response = await axios.post('/api/checkout', {
        bookingId,
        amount: parseFloat(amount),
        userId:session?.user?._id,
        email:session?.user?.email,
        propertyId
      });
      const { url } = response.data;
      console.log(response.data, 'Checkout URL:', url);
      if (url) window.location.href = url;
    } catch (error) {
      console.log(error)
      console.error('Checkout error:', error.response?.data?.error || error.message);
      toast.error('Failed to initiate payment. Please try again.');
  }
  }
 const { mutate: deleteBooking, isPending: isDeleting } = useMutation({
  mutationFn: async (bookingId) => {
    const res = await axios.delete(`/api/bookings/upcoming?id=${bookingId}`);
    return res.data;
  },
  onSuccess: () => {
    toast.success('Booking deleted successfully.');
    // Refetch bookings after delete
    queryClient.invalidateQueries(['bookings']);
  },
  onError: (error) => {
    console.error(error);
    toast.error('Failed to delete booking.');
  },
});
 console.log(bookings?.data)

  if (isError) return <div> <p className="p-6 text-red-700 text-center text-4xl">Failed to load bookings. Please try again later.</p></div>;
  
  if (bookingsLoading) {
  return (<div className="flex items-center justify-center min-h-[50vh]">
      <LoaderOne />
    </div>)}
  return (
    
     <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Upcoming Stays</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Property ID</th>
            <th className="px-4 py-2 border">Check-in</th>
            <th className="px-4 py-2 border">Check-out</th>
            <th className="px-4 py-2 border">Guests</th>
            <th className="px-4 py-2 border">Total Price</th>
            <th className="px-4 py-2 border">Payment Status</th>
            <th className="px-4 py-2 border">Action</th>
            <th className="px-4 py-2 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {bookings?.data && bookings?.data.map((b) => (
            <tr key={b._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">{b.propertyId}</td>
              <td className="px-4 py-2 border">{new Date(b.checkInDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 border">{new Date(b.checkOutDate).toLocaleDateString()}</td>
              <td className="px-4 py-2 border text-center">{b.guests}</td>
              <td className="px-4 py-2 border text-center">${b.totalPrice}</td>
              <td className={`px-4 py-2 border text-center font-semibold `}>
                {
                 b.payment_status ==="success" ?   <Badge
                          variant="secondary"
                          className="bg-green-800 text-white dark:bg-green-800"
                        >
                          <BadgeCheckIcon />
                          Paid
                        </Badge> :  <Badge
                          variant="secondary"
                          className="bg-red-800 text-white dark:bg-red-800"
                        >
                          <BadgeDollarSignIcon/>
                          Unpaid
                        </Badge>
                 
                }
              </td>
              <td className="px-4 py-2 border text-center">
                {b.payment_status === "success" ? (
                  <Button className="cursor-pointer" onClick={() => handleInvoice(b._id)}>Invoice</Button>
                ) : (
                  <Button className='bg-green-600 cursor-pointer hover:bg-green-600' onClick={() => handleCheckout(b?.propertyId,b.totalPrice,b._id)}>Pay</Button>
                )}
              </td>
              <td className="px-4 py-2 border text-center"><Button
  className="cursor-pointer"
  variant="destructive"
  onClick={() => deleteBooking(b._id)}
>
  Delete
</Button>   </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="my-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <Button  className={`${skip !==0 ?"cursor-pointer" :"cursor-not-allowed opacity-45"}  `} disabled={skip===0} onClick={()=>{
                    params.set('skip', Math.max(0,skip-limit) )
                    router.push(`?${params.toString()}`)
        
                  }}>
        Prev
                  </Button>
                </PaginationItem>
        
              
                <PaginationItem>
                  <Button variant={'default'} disabled={bookings?.total <= skip+limit}   className="cursor-pointer" onClick={()=>{
                    if (bookings?.total <= skip+limit) return
                
                    params.set('skip', skip+limit )
                    router.push(`?${params.toString()}`)
        
                  }} >
                     Next
                    </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
      </div>
    </div>
  );
}