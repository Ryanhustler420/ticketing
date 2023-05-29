import { Subjects } from "./subjects";
import { Event } from "./base-listener";

export interface TicketUpdatedEvent extends Event {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}
