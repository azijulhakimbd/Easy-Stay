import dbConnect from "@/lib/dbConnect";
import { Review } from "@/models/review.models";
import { User } from "@/models/user.models";
import { Property } from "@/models/propertie.models"; 
import { NextResponse } from "next/server";
import { Aggregate } from "mongoose";

// GET: Fetch reviews (all or by propertyId)
export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const propertyId = url.searchParams.get("propertyId");
    const latestReview=url.searchParams.get("latest-review");
    if (latestReview){
      const latestReviews=await Review.find().populate('userId',"username").limit(6)
      const averageReview=await Review.aggregate([
  {
    $group: {
      _id:null,
      averageRating: {
        $avg:"$rating"
      },
       reviewCount:{
        $sum:1
      }
    }
        
  },
  {
    $project: {
      _id:0,  averageRating:1,reviewCount:1
    }
  }
])

      return NextResponse.json({
        reviews:latestReviews,
        reviewCount:averageReview[0].reviewCount,
        averageRating:averageReview[0].averageRating
        
      },{
        status:200
      })
    }

    if (propertyId) {
      // fetch verified reviews for a property
      const reviews = await Review.find({ propertyId, verified: true })
        .populate("userId", "fullName email").sort({ createdAt: -1 }).limit(6);

      const averageRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      const formattedReviews = reviews.map((r) => ({
        _id: r._id,
        propertyId: r.propertyId,
        bookingId: r.bookingId,
        userId: r.userId?._id,
        userName: r.userId?.fullName || "Anonymous",
        rating: r.rating,
        comment: r.comment,
        photos: r.photos || [],
        adminReply: r.adminReply || "",
        createdAt: r.createdAt,
        verified: r.verified,
      }));

      return new Response(
        JSON.stringify({
          reviews: formattedReviews,
          reviewCount: reviews.length,
          averageRating: Number(averageRating.toFixed(1)),
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // fetch all reviews (admin)
    const allReviews = await Review.find()
      .populate("userId", "fullName email")
      .populate("propertyId", "title location")
      .sort({ createdAt: -1 });

    const formattedAllReviews = allReviews.map((r) => ({
      _id: r._id,
      property: {
        _id: r.propertyId?._id,
        title: r.propertyId?.title || "Unknown Property",
        location: r.propertyId?.location || "",
      },
      bookingId: r.bookingId,
      userId: r.userId?._id,
      userName: r.userId?.fullName || "Anonymous",
      email: r.userId?.email || "",
      rating: r.rating,
      comment: r.comment,
      photos: r.photos || [],
      adminReply: r.adminReply || "",
      createdAt: r.createdAt,
      verified: r.verified,
    }));

    return new Response(
      JSON.stringify({
        reviews: formattedAllReviews,
        reviewCount: allReviews.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("GET /reviews error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch reviews" }),
      { status: 500 }
    );
  }
}

// POST: Add a review
export async function POST(req) {
  try {
    await dbConnect();
    const { propertyId, bookingId, userId, rating, comment, photos, verified } =
      await req.json();

    if (!propertyId || !userId || !rating || !comment) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    const review = await Review.create({
      propertyId,
      bookingId,
      userId,
      rating,
      comment,
      photos: photos || [],
      verified: verified || false,
    });

    return new Response(JSON.stringify({ message: "Review added", review }), {
      status: 201,
    });
  } catch (err) {
    console.error("POST /reviews error:", err);
    return new Response(JSON.stringify({ error: "Failed to add review" }), {
      status: 500,
    });
  }
}
