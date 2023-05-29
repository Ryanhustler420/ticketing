import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { createNewOrderToken, verifyPayment } from "../razorpay";
import express, { Request, Response } from "express";
import { natsWrapper } from "../nats-wrapper";
import { Payment } from "../models/payment";
import { body } from "express-validator";
import { Order } from "../models/order";

import {
  OrderStatus,
  requireAuth,
  NotFoundError,
  BadRequestError,
  validateRequest,
  NotAuthorizedError,
} from "@ticketing-k8s/common";

const router = express.Router();

router.post(
  "/api/payments/init",
  requireAuth,
  [body("orderId").notEmpty(), body("receipt").isString().notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { receipt } = req.body;
    const order = await Order.findById(req.body.orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Cannot pay for an cancelled order");

    const init = await createNewOrderToken(order.price, "INR", receipt, {
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
    });

    if (!init) {
      throw new BadRequestError("You cant pay for this ticket");
    }

    const payment = Payment.build({
      verified: false,
      orderId: order.id,
      razorpayId: init.id,
    });
    await payment.save();

    if (payment) {
      res.send({ ...init, verified: false });
    } else {
      throw new BadRequestError("Error in payment processing");
    }
  }
);

router.post(
  "/api/payments/complete",
  requireAuth,
  [
    body("orderId").isMongoId(),
    body("rp_orderId").notEmpty(),
    body("rp_paymentId").notEmpty(),
    body("rp_paymentSignature").notEmpty(),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, rp_orderId, rp_paymentId, rp_paymentSignature } = req.body;
    const order = await Order.findById(orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError();
    if (order.status === OrderStatus.Cancelled)
      throw new BadRequestError("Cannot pay for an cancelled order");

    const valid = await verifyPayment(
      rp_orderId,
      rp_paymentId,
      rp_paymentSignature,
      {
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID!,
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET!,
      }
    );

    if (!valid) {
      throw new BadRequestError("Payment cant be completed");
    }

    const payment = await Payment.findOne({ orderId: order.id });
    if (!payment) {
      throw new BadRequestError("Payment cant be completed");
    }

    payment.set({ verified: valid });
    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      orderId: order.id,
      razorpayId: payment.id,
    });

    res.send(payment);
  }
);

export { router as createPaymentRouter };
