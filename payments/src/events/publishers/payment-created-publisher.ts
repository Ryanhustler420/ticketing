import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from "@ticketing-k8s/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
