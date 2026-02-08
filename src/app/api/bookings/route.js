import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Booking } from "../../../models/booking.models";
import { Property } from "@/models/propertie.models";
import { getSession } from "next-auth/react";

export async function GET(request,{params}) {
  try {
    await dbConnect();
     const queries=request.nextUrl.searchParams
     const limit=parseInt(queries.get('limit'))
     const skip=parseInt(queries.get('skip') )
     const analytics=queries.get('analytics')
    const  id=queries.get('id')

   
 
   
    const statusCount=await Booking.aggregate([
      
  {
    $group: {
      _id:"$status",
      count: {
     $sum:1
      }
    }
  },
  {
    $project: {
      status:"$_id",
     count:1,
      _id:0
    }
  }

    ])
    const monthlyRevenue=await Booking.aggregate([
  {
    $match: {
      status: { $in: ["completed", "confirmed"] }
    }
  },
  {
    $addFields: {
      monthNumber: { $month: "$createdAt" }, // numeric month
      monthName: {
        $dateToString: { format: "%B", date: "$createdAt" } // e.g. January, February
      }
    }
  },
  {
    $group: {
      _id: {
        monthNumber: "$monthNumber",
        monthName: "$monthName"
      },
      totalRevenue: { $sum: "$totalPrice" }
    }
  },
  {
    $project: {
      _id: 0,
      month: "$_id.monthName",
      monthNumber: "$_id.monthNumber",
      totalRevenue: 1
    }
  },
  {
    $sort: {
      monthNumber: 1 
    }
  }
])

    if ( limit || skip){
    
    
           const statusCountByID=await Booking.aggregate([
             { $match: { userId: id } },
      
  {
    $group: {
      _id:"$status",
      count: {
     $sum:1
      }
    }
  },
  {
    $project: {
      status:"$_id",
     count:1,
      _id:0
    }
  }

    ])

      

      const bookings=await Booking.find({hostId:id}).sort({createdAt:-1}).skip(skip).limit(limit)
        const total=await Booking.countDocuments({hostId:id})
      return NextResponse.json({data:bookings,total:total,statData:statusCountByID}, { status: 200 });
    }

  if (analytics){
      const total=await Booking.countDocuments()
      const bookings=await Booking.find().sort({createdAt:-1})
        
      return NextResponse.json({total:total,statData:statusCount,monthlyRevenueData:monthlyRevenue}, { status: 200 });
    }


    const bookings = await Booking.find().sort({ createdAt: -1 }); // latest first
    return NextResponse.json({data:bookings}, { status: 200 });
  } catch (error) {
    console.error("GET /bookings error:", error);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req) {
  
  try {
    const body = await req.json(); // <-- parse JSON body
    const { propertyId, userId, checkInDate, checkOutDate, guests, totalPrice,payment_status } = body;

    // Validate required fields manually (optional)
    if (!propertyId || !userId || !checkInDate || !checkOutDate || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const properties=await Property.findById(propertyId)
    if (!properties) {
      return NextResponse.json({ error: "Property not found In our system" }, { status: 404 });
    }
    const newBooking = await Booking.create({
      propertyId,
      userId,
      hostId:properties?.hostId,
      checkInDate,
      checkOutDate,
      guests: guests || 1,
      totalPrice,
      status: "pending",
      payment_status :payment_status ||"unpaid"
    });

    return NextResponse.json(
      { message: "Booking created", booking: newBooking },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /bookings error:", error);
    return NextResponse.json(
      { error: "Failed to create booking", details: error.message },
      { status: 500 }
    );
  }
}


