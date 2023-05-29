import mongoose from "mongoose";

export const createNewOrderToken = jest
  .fn()
  .mockResolvedValue({ id: new mongoose.Types.ObjectId().toHexString() });
export const verifyPayment = jest.fn().mockResolvedValue(false);
