import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@ticketing-k8s/common";
import { TicketDoc } from "./ticket";
import mongoose from "mongoose";

export { OrderStatus };

interface OrderAttrs {
  userId: string;
  ticket: TicketDoc;
  status: OrderStatus;
  expiresAt: Date;
}

interface OrderDoc extends mongoose.Document {
  userId: string;
  version: number;
  ticket: TicketDoc;
  status: OrderStatus;
  expiresAt: Date;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: OrderStatus.Created,
      enum: Object.values(OrderStatus),
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);
export { Order };
