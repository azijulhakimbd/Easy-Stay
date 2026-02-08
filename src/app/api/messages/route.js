import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";
import Conversation from "@/models/Conversation";

export async function POST(req) {
  try {
    await dbConnect();
    const { sender, receiver, text } = await req.json();

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        lastMessage: text,
      });
    } else {
      conversation.lastMessage = text;
      conversation.lastMessageAt = new Date();
      await conversation.save();
    }

    const message = await Message.create({
      conversationId: conversation._id,
      sender,
      receiver,
      text,
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
