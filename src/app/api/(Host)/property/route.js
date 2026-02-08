
import { Property } from '@/models/propertie.models';
import '@/models/index';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { findDimensionValueType } from 'framer-motion';
import dbConnect from '@/lib/dbConnect';

// ✅ POST: Create Property
export async function POST(request) {
  await dbConnect();
  try {
    const reqBody = await request.json();
    const user = await Property.create(reqBody);
    return NextResponse.json(
      { status: 'success', message: 'Property created successfully', user },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Error:", error.message);
    return NextResponse.json(
      { status: 'error', message: error.message },
      { status: 400 }
    );
  }
}

// ✅ GET: Fetch Properties (with filters + location + pagination)
export async function GET(request) {
  await dbConnect();
    await Property.syncIndexes();

  const { searchParams } = new URL(request.url);

  // --- 1. Extract All Parameters ---
  const search = searchParams.get("search") || "";
  const roomType = searchParams.get("roomType");
  const mostReviewed = searchParams.get("mostReviewed");
  const latitude = parseFloat(searchParams.get("latitude"));
  const longitude = parseFloat(searchParams.get("longitude"));

  // Pagination
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "8", 10);
  const skip = parseInt(searchParams.get("skip") || "0", 10);
  
 
  const skipValue = (page - 1) * limit;
  const hostId=searchParams.get('host')

  const radiusInMeters = 50000; // 5 km radius (adjust as needed)

  // --- 2. Handle 'mostReviewed' logic (unchanged) ---
  if (mostReviewed) {
   


    const properties = await Property.find({ _id: { $type: "objectId"}})
      .populate("hostId", "email")
      .populate("amenities")
      .sort({ reviews: -1 })
      .limit(8).lean()

    const total = await Property.countDocuments();
    return NextResponse.json({ status: "success", data: properties, total });
  }

  // --- 3. Build Dynamic Query ---
  let findCriteria = {};
  findCriteria._id = { $type: "objectId" };
  if (hostId){

    findCriteria.hostId=hostId
  }

  // 🔍 Text search
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    findCriteria.$or = [
      { city: searchRegex },
      { address: searchRegex },
      { title: searchRegex }
    ];
  }

  // 🏠 Room type filter
  if (roomType) {
    findCriteria.roomType = roomType;
  }

  // 📍 Geolocation search (if latitude & longitude provided)
  if (!isNaN(latitude) && !isNaN(longitude)) {
    findCriteria.location = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radiusInMeters, // within radius
      },
    };
  }


    const hostDocCount={}
    if (hostId){
      hostDocCount.hostId=hostId
    }
  // --- 4. Fetch Data with Pagination ---
  const totalCount = await Property.countDocuments(hostDocCount);
// todo write findDimensionValueType
let query = Property.find(findCriteria);

if (!findCriteria.location) {
  // Only sort by date when NOT using $near
  query = query.sort({ createdAt: -1 });
}

const properties = await query
  .skip(skip ? skip : skipValue)
  .limit(limit)
  .populate("hostId", "email")
  .populate("amenities").lean()

  return NextResponse.json({
    status: "success",
    data: properties,
  
    total: totalCount,
    page,
    limit,
  });
}