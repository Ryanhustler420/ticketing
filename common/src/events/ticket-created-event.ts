import { Subjects } from "./subjects";
import { LEvent } from "./base-listener";

export interface TicketCreatedEvent extends LEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
