import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Conversation from "@/models/Conversation";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { userId } = params;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name email profileImage")
      .sort({ lastMessageAt: -1 });

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
