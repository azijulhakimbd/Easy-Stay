import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Review } from "@/models/review.models";


// PATCH: Update a review (used for admin reply or any field)
export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ["rating", "comment", "photos", "verified", "adminReply"];
    const updateData = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    const updatedReview = await Review.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("userId", "fullName email");

    if (!updatedReview)
      return NextResponse.json({ error: "Review not found" }, { status: 404 });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error("PATCH /reviews/:id error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

// DELETE: Remove a review
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } =await params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /reviews/:id error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
