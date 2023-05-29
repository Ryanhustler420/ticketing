import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from "@ticketing-k8s/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
