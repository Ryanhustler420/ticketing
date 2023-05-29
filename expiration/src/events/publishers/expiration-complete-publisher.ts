import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@ticketing-k8s/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
