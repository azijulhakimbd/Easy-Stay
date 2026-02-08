import { NextResponse } from "next/server";
import  dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { conversationId } = params;
    const messages = await Message.find({ conversationId })
      .populate("sender receiver", "name email profileImage")
      .sort({ createdAt: 1 });

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
