"use client";
import { getStreamClient } from "@/lib/streamClient";
import { useEffect, useState } from "react";
import axios from "axios";
import { Chat, Channel, ChannelHeader, MessageList, MessageInput, Window } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";

export default function ChatBox({ apiKey, userId, userName, hostId, hostName }) {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

console.log(userId,'this is userid',hostId,'this is host id')
  useEffect(() => {
    const init = async () => {
      if (!userId || !hostId) return;

      try {
        // 1️⃣ Get Stream token and channelId from backend
        const { data } = await axios.post("/api/stream-token", { userId, ownerId: hostId });
        const { token } = data;
        const channelId=data?.user?.channelId
        console.log(channelId,'this is channnel id')

        // 2️⃣ Initialize Stream client
        const chatClient = getStreamClient(apiKey);
        await chatClient.connectUser(
          { id: userId, name: userName, image: `https://getstream.io/random_png/?id=${userId}&name=${userName}` },
          token
        );

        // 3️⃣ Connect to channel
       const privateChannel = chatClient.channel(
  "messaging",
  channelId || `${userId}_${hostId}`,
  {
    members: [userId, hostId],
  }
);
        await privateChannel.watch();

        setClient(chatClient);
        setChannel(privateChannel);
      } catch (err) {
        console.error("Failed to initialize chat:", err);
      }
    };

    init();

    return () => {
      client?.disconnectUser();
    };
  }, [userId, hostId]);

  if (!client || !channel) return <p>Loading chat...</p>;

  return (
    <div className="h-[500px] w-full border rounded-xl overflow-hidden shadow-md">
      <Chat client={client} theme="str-chat__theme-light">
        <Channel channel={channel}>
          <Window>
            <ChannelHeader title={`Chat with ${hostName}`} />
            <MessageList />
            <MessageInput focus />
          </Window>
        </Channel>
      </Chat>
    </div>
  );
}
