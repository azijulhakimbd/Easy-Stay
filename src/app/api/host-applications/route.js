import dbConnect from "@/lib/dbConnect";
import { HostApplication } from "@/models/application.models";


import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { userId, fullName, email, phone, propertyType, message } = body;

    if (!userId || !fullName || !email || !phone || !propertyType) {
      return NextResponse.json(
        { success: false, message: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const existingApp = await HostApplication.findOne({ userId });
    if (existingApp) {
      return NextResponse.json(
        { success: false, message: "You already submitted an application." },
        { status: 400 }
      );
    }

    const newApplication = await HostApplication.create(body);

    return NextResponse.json(
      { success: true, message: "Application submitted successfully!", data: newApplication },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server Error", error },
      { status: 500 }
    );
  }
}

export async function GET() {
  await dbConnect();
  try {
    const applications = await HostApplication.find().populate("userId", "email role");
    return NextResponse.json({ success: true, data: applications });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch applications", error },
      { status: 500 }
    );
  }
}
