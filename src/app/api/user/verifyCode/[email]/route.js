import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.models";

import mongoose from "mongoose";

import { NextResponse } from "next/server";


export const POST = async (request) => {
  
  try {
    await dbConnect()
    const reqBody = await request.json();
    const { email, pin } = reqBody;
   

    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User does not exist" },
        { status: 400 }
      );
    }

    const isCodeCorrect = user.verifyCode === pin;
    
    const isDateValid = user.verifyCodeExpiry > Date.now();

    if (!isCodeCorrect) {
      return NextResponse.json(
        { success: false, message: "Verification code is not correct" },
        { status: 400 }
      );
    }

    if (!isDateValid) {
      return NextResponse.json(
        { success: false, message: "Verification code has expired. Please signup again to get a new code" },
        { status: 400 }
      );
    }

    // If code is correct and valid
    user.isVerified = true;
    await user.save();
   

    return NextResponse.json(
      { success: true, message: "Verification success" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};