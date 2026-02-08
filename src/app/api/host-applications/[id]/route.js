import dbConnect from "@/lib/dbConnect";
import { HostApplication } from "@/models/application.models";
import User from "@/models/user.models";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    const application = await HostApplication.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("userId");

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    // ✅ Only update user role if approved
    if (status === "approved") {
      await User.findByIdAndUpdate(application.userId._id, { role: "host" });
    }

    return NextResponse.json({
      success: true,
      message: `Host application ${status} successfully`,
      data: application,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}


// ❌ Delete Application (DELETE)
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  try {
    const deleted = await HostApplication.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}