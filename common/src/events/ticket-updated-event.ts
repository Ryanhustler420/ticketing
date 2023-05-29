import { Subjects } from "./subjects";
import { LEvent } from "./base-listener";

export interface TicketUpdatedEvent extends LEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
    orderId?: string;
  };
}
