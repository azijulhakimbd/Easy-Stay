
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/booking.models";
import { Property } from "@/models/propertie.models";
import User from "@/models/user.models";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // --- User Growth Data ---
    const userGrowthData = await User.aggregate([
      {
        $addFields: {
          createdAtDate: {
            $cond: [
              { $or: [{ $eq: ["$createdAt", null] }, { $eq: ["$createdAt", ""] }] },
              null,
              { $toDate: "$createdAt" }
            ]
          }
        }
      },
      { $match: { createdAtDate: { $ne: null } } },
      {
        $group: {
          _id: { month: { $month: "$createdAtDate" } },
          users: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          monthNumber: "$_id.month",
          users: 1,
          month: {
            $arrayElemAt: [
              ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              "$_id.month"
            ]
          }
        }
      },
      { $sort: { monthNumber: 1 } }
    ]);

    // --- Location Data ---
    const locationData = await User.aggregate([
      { $match: { currentCity: { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$currentCity",
          users: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          location: "$_id",
          users: 1
        }
      },
      { $sort: { users: -1 } },
      { $limit: 5 }
    ]);

    const totalUser=await User.aggregate([
  {
    $group: {
      _id:null,
      totalUser: {
        $sum: 1
      }
    }
  },
  {
    $project: {
      _id:0,
      totalUser:1
    }
  }
])

const totalBookings=await Booking.aggregate(
    [
  {
    $match: {
      status:{
        $in:['completed','confirmed']
      }
    }
  },
  {
    $group: {
      _id:null,
      totalBookings: {
        $sum:1
      }
    }
  },
  {
    $project: {
      _id:0
    }
  }
]
)

      const bookingsAnalytics = await Booking.aggregate([
      {
        $match: { status: { $in: ["confirmed", "completed"] } }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      {
        $project: {
          _id: 0,
          monthNumber: "$_id.month",
          totalRevenue: 1,
          month: {
            $arrayElemAt: [
              ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
              "$_id.month"
            ]
          }
        }
      },
      { $sort: { monthNumber: 1 } }
    ]);
    const totalEarnings=await Booking.aggregate([
  {
    $match: {
      status:{
        $in:['completed','confirmed']
      }
    }
  },
  {
    $group: {
      _id:null,
      totalEarnings: {
        $sum:"$totalPrice"
      }
    }
  },
  {
    $project: {
      _id:0
    }
  }
])

const totalProperty=await Property.aggregate([
  
  {
    $group: {
      _id:null,
      totalProperty: {
        $sum:1
      }
    }
  },
  {
    $project: {
      _id:0
    }
  }
])


   
    const analytics = {
    //   userGrowthData,
      locationData,
      bookingsAnalytics,
      totalUser,
      totalBookings,
      totalEarnings,
      totalProperty
      // externalStats, // uncomment if using external API
    };

    return NextResponse.json({analytics}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}