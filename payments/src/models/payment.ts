import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PaymentAttrs {
  orderId: string;
  verified: boolean;
  razorpayId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  verified: boolean;
  razorpayId: string;
  version: number;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    razorpayId: {
      required: true,
      type: String,
    },
    verified: {
      required: true,
      type: Boolean,
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

paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return Payment.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  "Payment",
  paymentSchema
);
export { Payment };
