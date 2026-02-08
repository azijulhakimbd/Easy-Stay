import { NextResponse } from "next/server";
import { StreamChat } from "stream-chat";

import User from "@/models/user.models";
import dbConnect from "@/lib/dbConnect";


const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_API_SECRET
);
console.log(process.env.STREAM_API_KEY,"this is test in vercel")
console.log(process.env.STREAM_API_SECRET,"this is test in vercel for")
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const { userId, ownerId } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 🧠 Fetch users from your MongoDB
    const user = await User.findById(userId);
    const owner = ownerId ? await User.findById(ownerId) : null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🧾 Upsert (create if not exist) users into Stream
    const usersToUpsert = [
      {
        id: userId.toString(),
        name: user.name || `User ${userId}`,
        image: user.image || `https://getstream.io/random_png/?id=${userId}`,
      },
    ];

    if (owner) {
      usersToUpsert.push({
        id: ownerId.toString(),
        name: owner.name || `Host ${ownerId}`,
        image: owner.image || `https://getstream.io/random_png/?id=${ownerId}`,
      });
    }

    await serverClient.upsertUsers(usersToUpsert);

    // 🧾 Create a token for the user logging in
    const token = serverClient.createToken(userId.toString());

    //  Generate a consistent channelId if hostId exists (for user–host chat)
    const channelId = ownerId ? `${userId}_${ownerId}` : null;

    return NextResponse.json({
      token,
      channelId,
    });
  } catch (error) {
    console.error("Stream Token Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
