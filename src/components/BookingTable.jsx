"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, BadgeDollarSign, BadgeDollarSignIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination, PaginationContent, PaginationNext, PaginationPrevious,PaginationItem } from "@/components/ui/pagination";
import {  LoaderThree } from "@/components/ui/loader";

export default function BookingTable({session}) {

  const searchParams=useSearchParams()
  const router=useRouter()

  const limit=Number(searchParams.get('limit') || 5)
  const skip=Number(searchParams.get('skip') || 0 )
  const query=new URLSearchParams(searchParams)
     const [cancelId,setCancelId]=useState(null)
  const queryClient = useQueryClient()

  useEffect(()=>{
     
      if (!searchParams.get('limit') || !searchParams.get('skip') ){
        query.set("limit",limit)
        query.set("skip",skip)
        router.replace(`?${query.toString()}`)
      }
  },[])
  

  const userId = session?.user?._id;

 

   
  const {data:bookings,isLoading:loading}=useQuery({
    queryKey:['bookings',session?.user,limit,skip,'list'],
    queryFn:async()=>{
      const res = await axios.get(`/api/bookings/upcoming?userId=${userId}`,{params:{
        limit,skip
      }})
      return res.data

    },
    enabled:!!userId,
    staleTime:10000
  })






  // Update booking


 const mutation=useMutation({
  mutationFn:async(id)=>{
    setCancelId(id)
 
    const response=await axios.patch(`/api/bookings/cancel?id=${id}`)
    return response.data
    
  },
  onSuccess:(data)=>{
  toast.warning("Booking cancelled!");
       queryClient.invalidateQueries({ queryKey: ['bookings'] })
    
  },
  onError:()=>{
    toast.error("Booking is not cancel due to server error")
  }
 })



  
 if (loading){
  return <div className="min-h-screen flex justify-center items-center">
    <LoaderThree/>
  </div>
 }

  return (
    

   <Card className="w-full shadow-lg border border-gray-200">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-gray-800">Bookings</CardTitle>
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
                 <TableHead className="text-right">Payment Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.data && bookings?.data.map((b) => (
                <TableRow key={b._id} className="hover:bg-gray-50">
                  <TableCell className={'font-semibold '}>{b.propertyId}</TableCell>

                  {/* Editable dates */}
                  <TableCell className={'font-semibold '}>
                    <input
                      type="date"
                      readOnly
                      value={b.checkInDate.slice(0, 10)}
                 
                      className="border px-2 py-1 rounded"
                    />
                  </TableCell>
                  <TableCell className={'font-semibold '}>
                    <input
                      type="date"
                      value={b.checkOutDate.slice(0, 10)}

             readOnly
                      className="border px-2 py-1 rounded"
                    />
                  </TableCell>

                  <TableCell className="text-center font-semibold">{b.guests}</TableCell>
                  <TableCell className="text-center">  <Badge className={b.status ==='completed' ?'bg-green-700' : b.status==='cancelled' ? 'bg-red-500':'bg-blue-700'}>{b.status.toUpperCase()}</Badge></TableCell>
                  <TableCell className="text-center font-semibold">${b.totalPrice}</TableCell>
 <TableCell className="text-center">{
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
 
}</TableCell>
                  <TableCell className="flex justify-center gap-2">
                 
                    <Button
                      size="sm"
                      className="bg-red-500 cursor-pointer text-white hover:bg-red-600 hover:scale-105 transform transition-all"
                      onClick={() =>mutation.mutate(b._id)}
                      disabled={b.status === "cancelled"}
                    >
                   {cancelId === b._id && (mutation.isPending) ? "Cancelling..." : "Cancel"}
                    </Button>
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
    
  );
}
