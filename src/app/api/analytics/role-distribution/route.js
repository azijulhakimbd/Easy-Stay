import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.models";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Count users by role
    const roleCounts = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Format data for Recharts PieChart
    const formattedData = roleCounts.map((item) => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching role distribution:", error);
    return NextResponse.json({ error: "Failed to fetch role data" }, { status: 500 });
  }
}
