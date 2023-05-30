import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

export interface LEvent {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends LEvent> {
  protected ackWait = 5 * 1000;
  abstract onMessage(data: T["data"], msg: Message): void;
  abstract queueGroupName: string;
  abstract subject: T["subject"];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`👂 ${this.subject} >> 🪹  [${this.queueGroupName}]`);
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
}
