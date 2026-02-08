import { StreamChat } from "stream-chat";

let client;

export function getStreamClient(apiKey) {
  if (!client) {
    client = StreamChat.getInstance(apiKey);
  }
  return client;
}