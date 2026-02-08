import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.models";
import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic"; // disable caching

export async function GET() {
  await dbConnect();

  try {
    const users = await User.find({}, "-password -verifyCode -verifyCodeExpiry"); 
    // Exclude sensitive fields

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
