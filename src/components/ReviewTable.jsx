"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LoaderThree } from "./ui/loader";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";
import { useSearchParams,useRouter } from "next/navigation";


export default function ReviewTable({session}) {
   const searchParams=useSearchParams()
  const router=useRouter()

  const limit=Number(searchParams.get('limit') || 4)
  const skip=Number(searchParams.get('skip') || 0 )
  const query=new URLSearchParams(searchParams)
  
  const queryClient = useQueryClient()

  useEffect(()=>{
     
      if (!searchParams.get('limit') || !searchParams.get('skip') ){
        query.set("limit",limit)
        query.set("skip",skip)
        router.replace(`?${query.toString()}`)
      }
  },[])
  
  const [showModal, setShowModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: "", photos: [] });

  const userId = session?.user?._id;

 

  const {data:bookings,isLoading:loading,isError,error:bookingsError}=useQuery({
    queryKey:['reviewBookings', userId,limit,skip, 'list'],
    queryFn:async()=>{
      const response=await axios.get(`/api/bookings/past?userId=${userId}`,{params:{limit,skip}})
      return response.data


    },
    enabled:!!userId
  })


  const openReviewModal = (booking) => {
    setCurrentBooking(booking);
    setReviewData({ rating: 0, comment: "", photos: [] });
    setShowModal(true);
  };

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

   const mutation=useMutation({
    mutationFn:async(data)=>{
      const response=await axios.post('/api/reviews',data)

    },
    onSuccess:()=>{
      toast.success('Review send successfully')
       setShowModal(false);
         

    },
    onError:(error)=>{
       toast.error(data.error || "Failed to add review");

    }
  
    
   })



  const handleAddReview = async () => {
    if (!reviewData.rating || !reviewData.comment) {
      toast.error("Please enter rating and comment");
      return;
    }

    mutation.mutate({
          propertyId: currentBooking.propertyId,
          bookingId: currentBooking._id,
          userId,
          rating: parseFloat(reviewData.rating),
          comment: reviewData.comment,
          photos: reviewData.photos, 
        })

     
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-white text-sm font-medium";
    switch (status) {
      case "confirmed": return <span className={`${baseClasses} bg-green-500`}>Confirmed</span>;
      case "completed": return <span className={`${baseClasses} bg-gray-500`}>Completed</span>;
      case "cancelled": return <span className={`${baseClasses} bg-red-500`}>Cancelled</span>;
      case "pending": return <span className={`${baseClasses} bg-yellow-500`}>Pending</span>;
      default: return <span className={`${baseClasses} bg-blue-500`}>{status}</span>;
    }
  };

  if (loading) return <div className="min-h-screen flex  justify-center items-center ">
<LoaderThree/>
  </div>
  if (bookings?.data.length === 0) return <p className="text-center  font-bold py-4">No past bookings found.</p>;

  return (
    <>
      <Card className="w-full shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">Past Stays</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead className="text-left">Property ID</TableHead>
                  <TableHead className="text-left">Check-In</TableHead>
                  <TableHead className="text-left">Check-Out</TableHead>
                  <TableHead className="text-center">Guests</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Total Price</TableHead>
                  <TableHead className="text-center">Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings && bookings?.data.map((booking) => (
                  <TableRow key={booking._id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{booking.propertyId}</TableCell>
                    <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-center">{booking.guests}</TableCell>
                    <TableCell className="text-center">{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right font-semibold">${booking.totalPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Button disabled={booking.status !=="completed"} size="sm" className={ booking.status !=="completed" ? 'cursor-not-allowed opacity-50':"cursor-pointer"} onClick={() => openReviewModal(booking)}>Review</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter>
           <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button  className={`${skip !==0 ?"cursor-pointer" :"cursor-not-allowed opacity-45"}  `} disabled={skip===0} onClick={()=>{
            query.set('skip', Math.max(0,skip-limit) )
            router.push(`?${query.toString()}`)

          }}>
Prev
          </Button>
        </PaginationItem>

      
        <PaginationItem>
          <Button variant={'default'} disabled={bookings?.total <= skip+limit}   className="cursor-pointer" onClick={()=>{
            if (bookings?.total <= skip+limit) return
        
            query.set('skip', skip+limit )
            router.push(`?${query.toString()}`)

          }} >
             Next
            </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
        </CardFooter>
      </Card>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Add Review</h2>
            <div className="space-y-3">
              <Input
                type="number"
                min={1}
                max={5}
                step={0.5}
                name="rating"
                placeholder="Rating (1-5)"
                value={reviewData.rating}
                onChange={handleReviewChange}
              />
              <Textarea
                name="comment"
                placeholder="Write your comment..."
                value={reviewData.comment}
                onChange={handleReviewChange}
              />
              <Input
                name="photos"
                placeholder="Photo URLs (comma separated)"
                value={reviewData.photos.join(",")}
                onChange={(e) => setReviewData(prev => ({ ...prev, photos: e.target.value.split(",") }))}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={handleAddReview}>Submit</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
