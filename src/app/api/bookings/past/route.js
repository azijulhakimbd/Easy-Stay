// /app/api/bookings/past/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/booking.models";

export async function GET(request) {
  try {
    await dbConnect();

    const queries = request.nextUrl.searchParams;
    const userId = queries.get("userId");
    const limit = parseInt(queries.get("limit")) || 0;
    const skip = parseInt(queries.get("skip")) || 0;

    const today = new Date();

    // Build query
    const query = { checkOutDate: { $lt: today } };
    if (userId) query.userId = userId;

    // Fetch past bookings
    const bookingsQuery = Booking.find(query).sort({ checkOutDate: -1 });

    if (limit > 0) bookingsQuery.limit(limit);
    if (skip > 0) bookingsQuery.skip(skip);

    const bookings = await bookingsQuery;
    const total = await Booking.countDocuments(query);

    return NextResponse.json({ data: bookings, total }, { status: 200 });
  } catch (error) {
    console.error("GET /bookings/past error:", error);
    return NextResponse.json({ error: "Failed to fetch past bookings" }, { status: 500 });
  }
}
