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

   let query = {}; // upcoming bookings

    if (userId) query.userId = userId;

    // Fetch upcoming bookings sorted by check-in date ascending
    const bookingsQuery = Booking.find(query).sort({createdAt:-1})
    

    ; // most recent first
    if (limit > 0) bookingsQuery.limit(limit);
    if (skip > 0) bookingsQuery.skip(skip);

    const bookings = await bookingsQuery;
    const total = await Booking.countDocuments(query);

    return NextResponse.json({ data: bookings, total }, { status: 200 });
  } catch (error) {
    console.error("GET /bookings/upcoming error:", error);
    return NextResponse.json({ error: "Failed to fetch upcoming bookings" }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    await dbConnect();

    const queries = request.nextUrl.searchParams;
    const bookingId = queries.get("id");

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const deleted = await Booking.findByIdAndDelete(bookingId);

    if (!deleted) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /bookings/upcoming error:", error);
    return NextResponse.json({ error: "Failed to delete booking" }, { status: 500 });
  }
}
