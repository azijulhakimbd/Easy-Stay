import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.models";

import { NextResponse } from "next/server";

// ✅ GET user by ID
export async function GET(request, { params }) {
     await dbConnect();
 

    try {
    const user = await User.findById(params.id).select("-password"); // exclude password
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ UPDATE user by ID (PATCH)
export async function PATCH(request, { params }) {
  await dbConnect();
  try {
    const body = await request.json();

    // prevent password change here (if you want dedicated endpoint for that)
    if (body.password) delete body.password;

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ✅ DELETE user by ID
export async function DELETE(request, { params }) {
  await dbConnect();
  try {
    const deletedUser = await User.findByIdAndDelete(params.id);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}