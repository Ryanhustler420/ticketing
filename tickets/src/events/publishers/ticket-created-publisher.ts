import { Publisher, Subjects, TicketCreatedEvent } from "@ticketing-k8s/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
