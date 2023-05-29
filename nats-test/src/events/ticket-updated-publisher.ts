import { TicketUpdatedEvent } from "./ticket-updated-event";
import { Publisher } from "./base-publisher";
import { Subjects } from "./subjects";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
