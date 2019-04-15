import { Message } from "./message";


export class Conversation {
  id: string;
  createUsername: string;
  participants: [string];
  messages: [Message];
}