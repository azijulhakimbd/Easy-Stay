// /app/api/property/all/route.js
import dbConnect from "@/lib/dbConnect";
import { Property } from "@/models/propertie.models";
import { NextResponse } from "next/server";


export async function GET() {
  try {
    await dbConnect();
// todo make propery page pagination and test
    const {searchParams} = new URL(request.nextUrl.searchParams)
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const hostId=searchParams.get('hostId')
    
    const skipValue = (page - 1) * limit;
    let filter={}
    if (hostId){
      filter.hostId=hostId
    }
    // Fetch all properties without filters
      const allProperties = await Property.find(filter)
      .skip(skipValue)
      .limit(limit)
      .sort({ createdAt: -1 }) // newest first
      .populate("hostId", "name email") // optional: populate host info
                // optional: populate amenities

                // total by host id
                const total=await Property.countDocuments(filter)
    return NextResponse.json({
      status: "success",
      total: total,
      data: allProperties,
    }, { status: 200 });

  } catch (error) {
    console.error("GET /api/properties/all error:", error);
    return NextResponse.json({
      status: "error",
      message: "Failed to fetch properties",
    }, { status: 500 });
  }
}
