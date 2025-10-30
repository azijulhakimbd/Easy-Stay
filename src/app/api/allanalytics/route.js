
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/booking.models";
import { Property } from "@/models/propertie.models";
import User from "@/models/user.models";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import { Review } from "@/models/review.models";

export async function GET() {
  const session=await getServerSession(authOptions)
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



const monthlyEarings=await Booking.aggregate([
  {
    $group: {
      _id: { $month: "$createdAt" }, // extract month number (1-12)
      totalUSD: { $sum: "$totalPrice" } // sum of totalPrice for each month
    }
  },
  {
    $addFields: {
      month: {
        $arrayElemAt: [
          [
            "", // 0 index placeholder (because months start from 1)
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ],
          "$_id"
        ]
      }
    }
  },
  {
    $project: {
      _id: 1,       // remove _id
      month: 1,     // keep month name
      totalUSD: 1   // keep total amount
    }
  },
  {
    $sort: { _id: 1 } 
  }
]);
   const monthWiseStatus=await Booking.aggregate(
    [
  // Optional: filter by current year
  {
    $match: {
      createdAt: {
        $gte: new Date(new Date().getFullYear(), 0, 1),
        $lt: new Date(new Date().getFullYear() + 1, 0, 1),
      },
    },
  },

  // Group by month + status
  {
    $group: {
      _id: {
        month: { $month: "$createdAt" },
        status: "$status",
      },
      count: { $sum: 1 },
    },
  },

  // Regroup by month
  {
    $group: {
      _id: "$_id.month",
      statuses: {
        $push: {
          status: "$_id.status",
          count: "$count",
        },
      },
    },
  },

  // Build each month object with counts per status
  {
    $project: {
      _id: 1, // Keep month number for sorting later
      month: {
        $arrayElemAt: [
          [
            "",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          "$_id",
        ],
      },
      completed: {
        $ifNull: [
          {
            $first: {
              $filter: {
                input: "$statuses",
                as: "s",
                cond: { $eq: ["$$s.status", "completed"] },
              },
            },
          },
          { count: 50 },
        ],
      },
      pending: {
        $ifNull: [
          {
            $first: {
              $filter: {
                input: "$statuses",
                as: "s",
                cond: { $eq: ["$$s.status", "pending"] },
              },
            },
          },
          { count: 26 },
        ],
      },
      rejected: {
        $ifNull: [
          {
            $first: {
              $filter: {
                input: "$statuses",
                as: "s",
                cond: { $eq: ["$$s.status", "rejected"] },
              },
            },
          },
          { count: 17 },
        ],
      },
      approved: {
        $ifNull: [
          {
            $first: {
              $filter: {
                input: "$statuses",
                as: "s",
                cond: { $eq: ["$$s.status", "approved"] },
              },
            },
          },
          { count: 30 },
        ],
      },
      cancelled: {
        $ifNull: [
          {
            $first: {
              $filter: {
                input: "$statuses",
                as: "s",
                cond: { $eq: ["$$s.status", "cancelled"] },
              },
            },
          },
          { count: 20 },
        ],
      },
    },
  },

  // Flatten out count objects
  {
    $project: {
      _id: 1,
      month: 1,
      completed: "$completed.count",
      pending: "$pending.count",
      rejected: "$rejected.count",
      approved: "$approved.count",
      cancelled: "$cancelled.count",
    },
  },

  // ✅ Sort months correctly (January → December)
  {
    $sort: { _id: 1 },
  },

   ])
console.log(session?.user?._id)
   const reviewData=await Review.aggregate([
    // 1️⃣ Filter reviews for this property
    {
      $match: {userId:new mongoose.Types.ObjectId(session?.user?._id) }
    },

    // 2️⃣ Group by rating value and count how many reviews per rating
    {
      $group: {
        _id: "$rating",
        count: { $sum: 1 },
      },
    },

    // 3️⃣ Add total count and weighted sum to compute average later
    {
      $group: {
        _id: null,
        totalReviews: { $sum: "$count" },
        weightedSum: {
          $sum: { $multiply: ["$_id", "$count"] },
        },
        ratings: {
          $push: {
            k: { $toString: "$_id" },
            v: "$count",
          },
        },
      },
    },

    // 4️⃣ Shape the final object (convert array to key-value)
    {
      $project: {
        _id: 0,
        averageRating: {
          $cond: [
            { $eq: ["$totalReviews", 0] },
            0,
            { $divide: ["$weightedSum", "$totalReviews"] },
          ],
        },
        totalReviews: 1,
        ratings: { $arrayToObject: "$ratings" },
      },
    },
  ])

   
    const analytics = {
    //   userGrowthData,
      locationData,
      bookingsAnalytics,
      totalUser,
      totalBookings,
      totalEarnings,
      totalProperty,
      monthlyEarings,
      monthWiseStatus,
      reviewData
      // externalStats, // uncomment if using external API
    };

    return NextResponse.json({analytics}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}