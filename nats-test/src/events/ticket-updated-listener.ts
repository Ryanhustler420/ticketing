import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { TicketUpdatedEvent } from "./ticket-updated-event";
import { Subjects } from "./subjects";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = "payments-service";

  onMessage(data: TicketUpdatedEvent["data"], msg: Message): void {
    console.log(msg.getData());
    msg.ack();
  }
}
