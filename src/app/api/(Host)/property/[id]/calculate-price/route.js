
import { Property } from "@/models/propertie.models"
import { differenceInDays } from "date-fns"
import { NextResponse } from "next/server"


export const POST=async(request,{params})=>{
    const {id}=await params
    const body=await request.json()
   const {checkIn,checkOut,guest=0}=body
    if (!checkIn || !checkOut){
        return NextResponse.json({
            message: "Check-in and check-out dates are required." 
        },{
            status:400
        })
    }
    
   
    const property=await Property.findById(id)
    if(!property){
    return NextResponse.json({message:'property not fount'},{status:404})
    }
    const night=differenceInDays(checkOut,checkIn)
    if (night<=0){
        return NextResponse.json({message:"invalid date range"})
    }
    let basePrice=property.pricePerNight*night
     basePrice += property.cleaningFee + property.serviceCharge;

     if (guest>property.guestsIncluded){
        const extraGuest=guest-property.guestsIncluded
        const extraGuestCost=property.extraGuestFee *extraGuest *night
        basePrice+=extraGuestCost
     }
     if(property.discount>0){
           const discountAmount = (basePrice * property.discount) / 100;
           basePrice-=discountAmount
     }
     return NextResponse.json({
      success: true,
      propertyId: property._id,
      title: property.title,
      night,
      freeGuest:property.guestsIncluded,

      cleaningFee: property.cleaningFee,
      serviceCharge: property.serviceCharge,
      discount: property.discount,
      totalPrice: Number(basePrice.toFixed(2)),
      },
      {status:201}
)
}