// app/api/analytics/user-growth/route.js
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.models";
import { NextResponse } from "next/server";

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export async function GET() {
  try {
    await dbConnect();

    const raw = await User.aggregate([
      {
        $addFields: {
          createdAtDate: {
            $cond: [
              { $ne: [{ $type: "$createdAt" }, "date"] },
              { $toDate: "$createdAt" }, // convert string to date if needed
              "$createdAt"
            ]
          }
        }
      },
      {
        $match: { createdAtDate: { $exists: true } }
      },
      {
        $group: {
          _id: { $month: "$createdAtDate" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const counts = {};
    raw.forEach(item => { counts[item._id] = item.count; });

    const formatted = MONTH_NAMES.map((m, idx) => ({
      month: m,
      newUsers: counts[idx + 1] || 0
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("GET /api/analytics/user-growth error:", err);
    return NextResponse.json(
      { error: "Failed to fetch user growth data", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
