import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from "@ticketing-k8s/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.id);

    if (!order) {
      // throw new Error("Order not found");
      return;
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();

    msg.ack();
  }
}
