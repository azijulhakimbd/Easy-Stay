"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chat,
  ChannelList,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
} from "stream-chat-react";
import { getStreamClient } from "@/lib/streamClient";
import "stream-chat-react/dist/css/v2/index.css";

export default function HostChatBox({ apiKey, hostId, hostName }) {
  const [client, setClient] = useState(null);
  const [activeChannel, setActiveChannel] = useState(null); // This state tracks the currently selected chat

  useEffect(() => {
    if (!hostId) return;
    let chatClient;

    const init = async () => {
      try {
        // 1️⃣ Get token for host
        const { data } = await axios.post("/api/stream-token", { userId: hostId });
        const { token } = data;

        // 2️⃣ Connect to Stream
        chatClient = getStreamClient(apiKey);

        await chatClient.connectUser(
          {
            id: hostId,
            name: hostName || `Host ${hostId}`,
            image: `https://getstream.io/random_png/?id=${hostId}`,
          },
          token
        );

        setClient(chatClient);
      } catch (error) {
        console.error("Host chat init error:", error);
      }
    };

    init();

    return () => {
      // 3️⃣ Properly cleanup
      if (chatClient) chatClient.disconnectUser();
    };
  }, [hostId, apiKey, hostName]);

  if (!client) return <p>Loading chats...</p>;

  // 4️⃣ Filters for host’s conversations
  const filters = { type: "messaging", members: { $in: [hostId] } };
  const sort = { last_message_at: -1 };

  return (
    <div className="h-[600px] flex border rounded-xl overflow-hidden shadow-md">
      <Chat client={client} theme="str-chat__theme-light">
        <div className="flex w-full">
          {/* Channel List */}
          <div className="w-1/3 border-r overflow-y-auto">
            <ChannelList
              filters={filters}
              sort={sort}
              options={{ state: true, watch: true }}
              // ⭐️ FIX: Use onSelect to update your local activeChannel state
              onSelect={setActiveChannel} 
              // ⚠️ The 'setActiveChannel' prop below is no longer necessary but is kept for context
              Preview={({ channel }) => { // ⭐️ FIX: Removed 'setActiveChannel' from destructuring
                // Find the other member in the conversation
                const members = Object.values(channel.state.members || {}).filter(
                  (m) => m.user?.id !== hostId
                );
                const user = members[0]?.user;
                const lastMessage =
                  channel.state.messages?.[channel.state.messages.length - 1]?.text ||
                  "No messages yet";

                return (
                  <div
                    className="p-3 border-b hover:bg-gray-100 cursor-pointer"
                    // ⭐️ FIX: Call your component's setActiveChannel state setter
                    onClick={() => setActiveChannel(channel)} 
                  >
                    <p className="font-semibold">{user?.name || "Guest"}</p>
                    <p className="text-sm text-gray-500 truncate">{lastMessage}</p>
                  </div>
                );
              }}
            />
          </div>

          {/* Active Chat Window */}
          <div className="flex-1">
            {activeChannel ? (
              // The Channel component will render only when activeChannel is set
              <Channel channel={activeChannel}>
                <Window>
                  <ChannelHeader />
                  <MessageList />
                  <MessageInput focus />
                </Window>
                <Thread />
              </Channel>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </Chat>
    </div>
  );
}