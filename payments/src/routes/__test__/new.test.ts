import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { signin } from "../../test/auth-helper";
import { OrderStatus } from "@ticketing-k8s/common";
import { createNewOrderToken, verifyPayment } from "../../razorpay";

it("returns a 404 when purchasing an order that does not exists", async () => {
  await request(app)
    .post("/api/payments/init")
    .set("Cookie", signin())
    .send({
      orderId: new mongoose.Types.ObjectId().toHexString(),
      receipt: "Something useless",
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that doesnt belong to the user", async () => {
  const order = Order.build({
    userId: new mongoose.Types.ObjectId().toHexString(),
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments/init")
    .set("Cookie", signin())
    .send({
      orderId: order.id,
      receipt: "Something useless",
    })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Cancelled,
    userId: userId,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments/init")
    .set("Cookie", signin(userId))
    .send({
      orderId: order.id,
      receipt: "Something useless",
    })
    .expect(400);
});

it("Returns payment failed if payment signature not matched", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: userId,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments/init")
    .set("Cookie", signin(userId))
    .send({
      orderId: order.id,
      receipt: "Something useless",
    });

  await request(app)
    .post("/api/payments/complete")
    .set("Cookie", signin(userId))
    .send({
      orderId: order.id,
      rp_orderId: "asdf",
      rp_paymentId: "asdf",
      rp_paymentSignature: "asdf",
    })
    .expect(400);
});

it("Returns a valid payment token", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: userId,
    version: 0,
    price: 20,
  });
  await order.save();

  await request(app)
    .post("/api/payments/init")
    .set("Cookie", signin(userId))
    .send({
      orderId: order.id,
      receipt: "Something useless",
    })
    .expect(200);

  expect(createNewOrderToken).toHaveBeenCalled();
  const tokenOptions = (createNewOrderToken as jest.Mock).mock.calls[0];
  expect(tokenOptions[0]).toEqual(20);
  expect(tokenOptions[2]).toEqual("Something useless");
});
