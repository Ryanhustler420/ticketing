import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketing-k8s/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
