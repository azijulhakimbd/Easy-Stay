// /app/api/bookings/[id]/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/booking.models";


export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json(); // data to update
    const updatedBooking = await Booking.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("PATCH /bookings/:id error:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}




