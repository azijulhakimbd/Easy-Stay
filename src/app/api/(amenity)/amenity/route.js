import dbConnect from "@/lib/dbConnect";
import { Amenity } from "@/models/amenities.models";

import { NextResponse } from "next/server";

// POST: Create a new amenity (admin only)
export async function POST(request) {
 

  const body = await request.json();
 


  await dbConnect();
  try {
    const amenity = await Amenity.create(body)
    
    return NextResponse.json({ success:true,message:'Amenity create successfully',responseValue:amenity,  }, { status: 201 });
  } catch (error) {
    if (error) {
        console.log(error)
      return NextResponse.json({ error: 'Amenity name already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
export async function GET() {
  await dbConnect();

  try {
    const amenities = await Amenity.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, amenities },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching amenities:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch amenities" },
      { status: 500 }
    );
  }
}