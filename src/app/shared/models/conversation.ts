import { Message } from "./message";


export class Conversation {
  id: string;
  title: string;
  createUserId: string;
  createUsername: string;
  createName: string;
  participants: [string];
  messages: [Message];
  otherUsername: string;
  otherName: string;
  createdDate: string;
}