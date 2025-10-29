import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/booking.models";
import { Property } from "@/models/propertie.models";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Aggregate bookings grouped by property.state
    const result = await Booking.aggregate([
      {
        $lookup: {
          from: "properties",       // properties collection
          localField: "propertyId", // Booking's propertyId
          foreignField: "_id",      // Property's _id
          as: "property",
        },
      },
      { $unwind: "$property" }, // flatten the joined array
      {
        $group: {
          _id: "$property.state",  // group by state
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { totalBookings: -1 } }, // most bookings first
    ]);

    const formatted = result.map((item) => ({
      city: item._id || "Unknown",         // rename _id to city
      bookings: item.totalBookings,        // rename totalBookings to bookings
      totalRevenue: item.totalRevenue.toFixed(2),
    }));

    return NextResponse.json({ status: "success", data: formatted });
  } catch (error) {
    console.error("Error in /api/analytics/bookings-by-state:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings by state", details: error.message },
      { status: 500 }
    );
  }
}
