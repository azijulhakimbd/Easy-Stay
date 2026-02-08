"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "./ui/button"
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { LoaderFour } from "./ui/loader"
import axios from "axios"
import { useSession } from "next-auth/react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,SelectGroup, SelectLabel } from "./ui/select"
import Link from "next/link"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"

export default function HostTable() {
    const {data:session}=useSession()
    const [skip,setSkip]=React.useState(0)
    const [limit,setLimit]=React.useState(5)
 
     // Replace with actual total items from your data source
    
   
const queryClient = useQueryClient()
     const {data:properties,isLoading:propertiesLoading,isError:propertiesError} = useQuery({ 
        queryKey: ["property",session?.user._id,'list',skip,limit],
        queryFn: async()=> {
             const response=await axios.get('/api/property',{
                params:{
                    host:session?.user._id,skip,limit
                }
             })
          
             return response.data
         },
         enabled:!!session?.user._id 
        
      
          })
           
const mutation=useMutation({
    mutationFn:async(id)=>axios.delete(`/api/property/${id}`),
    onSuccess:(data)=>{
        console.log(data)
        toast.success('Data has been deleted')
        queryClient.invalidateQueries({ queryKey: ['property',session?.user._id,'list'] })
    },
    onError:(error)=>{
     console.log(error.message)
     toast.error(error?.message)
    }
})

 // Pagination logic
  const handlePrev = () => {
    setSkip((prevSkip) => Math.max(0, prevSkip - limit));
  };

  const handleNext = () => {
    setSkip((prevSkip) => prevSkip + limit);
  };

  const isPrevDisabled = skip <= 0;
  const isNextDisabled = skip + limit >=properties?.total ||  0;

  const buttonClasses = (isDisabled) =>
    `flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-md transform active:scale-95 ${
      isDisabled
        ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-inner"
        : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
    }`;

  return (
  <div>
  {propertiesLoading && (
    <div className="flex justify-center items-center">
      <LoaderFour />
    </div>
  )}

  {propertiesError && (
    <div>
      <h1>Error on data loading</h1>
    </div>
  )}

  {/* Table wrapper for scroll */}
  <div className="max-h-[500px] overflow-y-auto dark:bg-black dark:text-neutral-300  border rounded-md">
    <Table >
      <TableHeader className={'p-10 '}>
        <TableRow className="text-center ">
          <TableHead className="w-[100px] dark:text-neutral-300">ID</TableHead>
          <TableHead className="dark:text-neutral-300">Title</TableHead>
          <TableHead className="dark:text-neutral-300">IsActive</TableHead>
         
          <TableHead className="dark:text-neutral-300">Edit</TableHead>
          <TableHead className="dark:text-neutral-300">Delete</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {properties?.data && properties?.data.map((items) => (
            <TableRow key={items._id}>
              <TableCell className="font-medium">{items._id}</TableCell>
              <TableCell className="font-medium">{items.title}</TableCell>
              <TableCell>{items.isActive ? "Yes" : "No"}</TableCell>
           
            
              <TableCell>
                <Button variant="secondary"> <Link href={`/host/property/${items._id}/edit`}>
                
                  Edit </Link>
                  </Button>
              </TableCell>
              <TableCell>
                <Button onClick={()=>mutation.mutate(items._id)} variant="destructive">Delete</Button>
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

  )
}