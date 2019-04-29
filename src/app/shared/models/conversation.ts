import { Message } from "./message";


export class Conversation {
  id: string;
  title: string;
  createUsername: string;
  participants: [string];
  messages: [Message];
  other_participant: string;

}