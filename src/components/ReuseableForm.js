






 "use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import axios from "axios"
import { Checkbox } from "@/components/ui/checkbox"

import { useSession } from "next-auth/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { LoaderOne } from "@/components/ui/loader"
import { toast, Toaster } from "sonner"
import propertySchema from "@/zodSchema/propertySchema"
import { LocateFixed } from "lucide-react"

 





export default function ReuseableForm({ propertyId }) {



  const { data: Session } = useSession()
  const queryClient = useQueryClient()


  const [userLocation, setUserLocation] = useState({  longitude: null,latitude: null });
    const [isLocating, setIsLocating] = useState(false);
    const [locationError, setLocationError] = useState(null);

  const defaultValue = {
    hostId: "",
    title: "Stylish Automated Vacation House in Uttara",
    description: "Have fun with the whole family at this stylish place. It's an automated house, all appliances are wifi controlled. Open the main door with a password and relax. Enjoy Bangladeshi rural views from wide windows. This house was constructed in 2021 for my own use as a vacation house",
    address: "Uttara Sector-12, Dhaka",
    city: "Dhaka",
    state: "Dhaka Division",
    country: "Bangladesh",
    latitude: 0, // Add these
    longitude: 0, // Add these
    pricePerNight: 1200,
    roomType: "private_room",
    maxGuests: 1,
    bedrooms: 3,
    beds: 3,
    bathrooms: 4,
    checkInTime: "12.00",
    checkOutTime: "8.00",
    amenities: [],
    images: [{ url: "", isPrimary: true }],
    isActive: true,
    cleaningFee:0,
    extraGuestFee:0,
    guestsIncluded:0,
    serviceCharge:0,
    discount:0

  }


// for collecting live location data
   

const fetchUserLocation = () => {
  if (isLocating) return; // prevent multiple requests

  setLocationError(null);
  setIsLocating(true);

  if (!navigator.geolocation) {
    setLocationError("Geolocation is not supported by your browser.");
    setUserLocation({ latitude: null, longitude: null });
    setIsLocating(false);
    return;
  }

  let errorTimeout;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      clearTimeout(errorTimeout);
      const { latitude, longitude } = position.coords;
      console.log("✅ Location fetched:", latitude, longitude);

      if (latitude && longitude) {
        setUserLocation({ latitude, longitude });
      
        setLocationError(null);
      } else {
        setLocationError("Could not determine valid coordinates. Please try again.");
        setUserLocation({ latitude: null, longitude: null });
      }

      setIsLocating(false);
    },
    (error) => {
      console.error(" Geolocation failed:", error);

      // Delay showing error for 1 second to give success callback a chance to override it
      errorTimeout = setTimeout(() => {
        let errorMessage = "Failed to get location. Check browser settings.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please allow access in browser settings.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
        }

        // Only show error if success didn't already run
        setLocationError((prev) =>
          userLocation.latitude && userLocation.longitude ? prev : errorMessage
        );
        setIsLocating(false);
      }, 1000);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};
  
 useEffect(() => {
    if (userLocation.latitude !== null && userLocation.longitude !== null) {
      // Round to 6 decimal places for precision/cleanliness
     
      form.setValue("longitude", parseFloat(userLocation.longitude.toFixed(6)), { shouldValidate: true });
       form.setValue("latitude", parseFloat(userLocation.latitude.toFixed(6)), { shouldValidate: true });
     ;
      toast.success("Location detected and updated.");
    }
  }, [userLocation]);

 











  // Form setup - uncomment resolver once schema matches your transformed data
  const form = useForm({
    resolver: zodResolver(propertySchema), // Uncomment this
    defaultValues: defaultValue,
    mode: "onChange",
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  })

  // Fetch property for EDIT mode
  const { data: propertyData, isLoading: propertyLoading } = useQuery({
    queryKey: ["property", propertyId,'single'],
    queryFn: async () => {
      if (!propertyId) return null
      const res = await axios.get(`/api/property/${propertyId}`)
      return res.data.data
    },
    enabled: !!propertyId,
  })
    

  // Reset for CREATE mode only (hostId from Session) - moved condition to avoid overriding edit
  useEffect(() => {
    if (Session && !propertyId) { // Add !propertyId to skip in edit mode
      form.reset({ ...defaultValue, hostId: Session.user._id })
    }
  }, [Session, propertyId])
  

  // Reset for EDIT mode: Transform data to match form structure
  useEffect(() => {
    if (propertyId && propertyData) {
      const transformedData = {
        ...propertyData,
         hostId: propertyData.hostId?._id || "", // Extract string ID from object
        amenities: propertyData.amenities?.map(a => a._id) || [], // Extract array of string IDs
       // Map from location object
          longitude: propertyData.location?.coordinates?.[0] || 0, // Map from location object
          latitude: propertyData.location?.coordinates?.[1] || 0,
        // Add type conversions if needed, e.g., parseFloat for numbers
      }
      form.reset(transformedData)
    }
  }, [propertyId, propertyData,userLocation])

  const {data: amenitiesArray, isLoading: amenitiesArrayLoading, isError: amenitiesArrayError} = useQuery({ 
    queryKey: ['amenities'],
    queryFn: async () => {
      const response = await axios.get('/api/amenity')
      return response.data.amenities
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true, // Add this to ensure fresh data
  })

  // Create or Update Mutation
  const mutation = useMutation({
    mutationFn: async (data) => {
      if (propertyId) {
        return axios.put(`/api/property/${propertyId}`, data)
      }
      return axios.post("/api/property", data)
    },
    onSuccess: (response) => { // Get response for updated data
      toast.success(propertyId ? "Property updated successfully" : "Property created successfully")
      if (propertyId) {
        // In edit mode, reset to updated data instead of defaults to avoid "refresh without changes"
        form.reset(response.data.data) // Assume API returns updated property; transform if needed
      } else {
          form.reset({
      ...defaultValue,
      hostId: Session?.user?._id || "",
    })
      }
      queryClient.invalidateQueries({ queryKey: ["property", Session?.user._id,'list'] }) // Fix key to match fetch
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`)
    },
  })

  // Transform values before submit to match backend (e.g., build location object)
  const handleSubmitForm = (values) => {
 
    const transformedValues = {
      ...values,
      location: {
        type: "Point",
        coordinates: [parseFloat(values.longitude || 0), parseFloat(values.latitude || 0)],
      },
    }
    // Remove temp fields
    delete transformedValues.latitude
    delete transformedValues.longitude
    mutation.mutate(transformedValues)
  }
  return (
    <div className="shadow-input mx-auto  max-w-4xl rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black my-10">
       <h2 className="text-2xl font-bold text-center">
        {propertyId ? "Edit Property" : "Create Property"}
      </h2>
            <Button
                      onClick={fetchUserLocation}
                      variant="outline"
                      className="rounded-xl flex items-center gap-2"
                      disabled={isLocating}
                    >
                      <LocateFixed className="w-4 h-4" />
                      {isLocating ? "Locating..." : "Detect Location"}
                    </Button>
            {locationError && (
              <p className="mt-2 text-sm text-red-500">
                {locationError}
              </p>
            )}
            {userLocation.latitude && !locationError && (
               <p className="mt-2 text-sm text-green-500">
                Detection successful!
              </p>
            )}
         
       
            {propertyId && propertyLoading ? (
        <p className="text-center text-gray-500">Loading property data...</p>
      ) : ( <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitForm)} className="my-8">
<div className=" grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-10">
 
       {[{
        name:"hostId",
        text:'Host Id',
        isDisable:true
       },
       {
        name:"title",
        text:'Title',
        isDisable:false
       }
      ].map((items,index)=>(  <LabelInputContainer key={index+1} ><FormField
         control={form.control}
          name={items.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{items.text}</FormLabel>
              <FormControl>
                <Input placeholder={items.title} {...field} disabled={items.isDisable} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
      </LabelInputContainer>
        )) }
        </div>
        <div className="my-4 md:my-10 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
         <LabelInputContainer className="mb-4">
          <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
               <Textarea
                 {...field}
                  placeholder="Write a detailed description..."
                 rows={4}       />
              </FormControl>
              
              <FormMessage />
            </FormItem>)}
           />
          </LabelInputContainer>
        </div>
         <div className="mb-4 grid grid-cols-1 gap-5 md:gap-10 md:grid-cols-5 overflow-x-hidden">
          {
            [{name:"address",text:"Address",placeholder:'12 sector Uttora',type:'text'},{name:"city",text:"City",placeholder:'Dhaka',type:'text'},{name:"state",text:"State",placeholder:'Dhaka',type:'text'},{name:"country",text:"Country",placeholder:'Usa',type:'text'},{name:"longitude",text:"Longitude",placeholder:50,type:'number'},{name:"latitude",text:"Latitude",placeholder:60,type:'number'},{ name: "pricePerNight", text: "Price Per Night", placeholder: 0 ,type:'number'},{ name: "bathrooms", text: "Bathrooms", placeholder: 1,type:'number' },
  { name: "beds", text: "Beds", placeholder: 1,type:'number' },
  { name: "bedrooms", text: "Bedrooms", placeholder: 1 ,type:'number'},
  
   {name: "checkInTime", text: "CheckIn Time", placeholder: '' ,type:'time'},
  {name: "checkOutTime", text: "CheckOut Time", placeholder: '' ,type:'time'},
  {name: "serviceCharge", text: "Service Charge", placeholder: '' ,type:'number'},
  {name: "cleaningFee", text: "Cleaning Fee", placeholder: '' ,type:'number'},
  { name: "maxGuests", text: "Max Guests", placeholder: 1 ,type:'number'},
    {name: "guestsIncluded", text: "Guests Included", placeholder: '' ,type:'number'},
      {name: "extraGuestFee", text: "Extra GuestFee", placeholder: '' ,type:'number'},
      {name:"discount",text:"Discount",type:"number"}
].map((items,index)=>(  <LabelInputContainer key={index+1} ><FormField
         control={form.control}
          name={items.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{items.text}</FormLabel>
              <FormControl>
                <Input     className="min-w-0"  placeholder={items.placeholder} {...field}  type={items.type} />
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />
      </LabelInputContainer>
        ))
          }
          <LabelInputContainer className="md:col-span-1" >
                 <FormField
          control={form.control}
          name="roomType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Your room Type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {
                  [{name:'entire_place',text:"Entire Place"},{name:'private_room',text:'Private Room'},{name:'shared_room',text:'Shared Room'}].map((items,index)=> <SelectItem key={index+1} value={items.name}>{items.text}</SelectItem>)
                  
                   }
                 
                  
                </SelectContent>
              </Select>
             
              <FormMessage />
            </FormItem>
          )}
        />
      </LabelInputContainer>

     
         </div>
         
         <div className="my-5 ">
           <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value} // Add this
                        onCheckedChange={field.onChange} // Add this
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      IsActive
                    </FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
         < h1 className="text-xl font-bold uppercase text-center my-10">Provide the amenities</h1>
      {
        amenitiesArrayLoading && <div className="flex justify-center items-center"> <LoaderOne  /></div>
      }
      {
        amenitiesArrayError && <h1 className="text-xl text-red-700 font-bold">Something on wrong on connecting the database</h1>
      }  

  {amenitiesArray && (
             <div >
              

            {amenitiesArray && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
                  {amenitiesArray.map((item) => (
                    
                   <div key={item._id}> <FormField
                      
                      control={form.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item._id)} // Now works with string array
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item._id])
                                  : field.onChange(field.value?.filter((value) => value !== item._id))
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {item.name}
                          </FormLabel>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                  ))}
                </div>
              )}
          </div>
  )}
</div> 

<div>
             <h2 className="text-xl uppercase font-semibold text-gray-900  dark:text-white text-center my-10">Images</h2>
             <div className="space-y-4">
               { form.watch("images") && form.watch("images").map((img, idx) => (
                 <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                   <div className="col-span-3">
                     <Input
                       placeholder="Image URL"
                       value={img.url}
                       onChange={(e) => {
                         const updated = [...form.getValues("images")]
                         updated[idx].url = e.target.value
                         form.setValue("images", updated)
                       }} />
                     {form.formState.errors.images?.[idx]?.url && (
                       <p className="mt-1 text-sm text-red-600">{form.formState.errors.images[idx].url.message}</p>
                     )}
                   </div>
                   <div className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       checked={img.isPrimary}
                       onChange={(e) => {
                         const updated = form.getValues("images").map((i, iIdx) => ({
                           ...i,
                           isPrimary: iIdx === idx ? e.target.checked : false,
                         }))
                         form.setValue("images", updated)
                       }}
                       className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                     />
                     <span className="text-sm text-gray-700 dark:text-gray-200">Primary</span>
                     <button
                       type="button"
                       onClick={() => {
                         const updated = form.getValues("images").filter((_, i) => i !== idx)
                         form.setValue("images", updated.length > 0 ? updated : [{ url: "", isPrimary: true }])
                       }}
                       className="text-red-600 hover:text-red-800 text-sm"
                     >
                       Remove
                     </button>
                   </div>
                 </div>
               ))}
              <div className="flex justify-center  items-center">
                <button
                 type="button"
                 onClick={() => {
                   const updated = [...form.getValues("images"), { url: "", isPrimary: false }]
                   form.setValue("images", updated)
                 }}
             className="h-10 w-[150px] mb-4 text-center rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] "  >
                 + Add Image
               </button>
              </div>
               {form.formState.errors.images && (
                 <p className="mt-1 text-sm text-red-600">{form.formState.errors.images.message}</p>
               )}
             </div>
           </div>
          
       <div className="flex justify-center items-center my-10"><button
              type="submit"
            
              className="group/btn shadow-input relative flex h-10 w-2xs items-center justify-center space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
            >
                    <span className="text-sm text-neutral-700 text-center dark:text-neutral-300">
              {mutation.isLoading
                ? propertyId
                  ? "Updating..."
                  : "Creating..."
                : propertyId
                ? "Update Property"
                : "Create Property"}
                </span>
            </button>   </div>
      </form>
    </Form>)}
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
 
const LabelInputContainer = ({
  children,
  className,
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  )}