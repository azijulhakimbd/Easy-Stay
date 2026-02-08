// /app/api/bookings/cancel/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/booking.models";

export async function PATCH(request) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id')
  console.log(id,'this id')

    if (!id) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    // Update the booking status to 'cancelled'
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking cancelled", booking: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
  }
}
