import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

// Replace the actual import with this fake one inside all files which uses actual nats-wrapper import
jest.mock("../nats-wrapper");
jest.mock("../razorpay");

let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = "raisehand";
  process.env.RAZORPAY_KEY_ID = "rzp_test_siNP5udU30MXHk";
  process.env.RAZORPAY_KEY_SECRET = "Ke9duwDyuCSKDQIRFDtBn5EN";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks(); // clears the times mock function gets called
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany();
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});
