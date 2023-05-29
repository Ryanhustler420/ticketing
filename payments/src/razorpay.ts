import Razorpay from "razorpay";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";

interface RAZORPAY_SECRETS {
  RAZORPAY_KEY_ID: string;
  RAZORPAY_KEY_SECRET: string;
}

export const createNewOrderToken = async (
  amount: number,
  currency: string,
  receipt: string,
  secrets: RAZORPAY_SECRETS
) => {
  try {
    const instance = new Razorpay({
      key_id: secrets.RAZORPAY_KEY_ID,
      key_secret: secrets.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100,
      receipt: receipt,
      currency: currency,
    };

    const order = await instance.orders.create(options);
    if (!order) return null;
    return { ...order, reviewed: false };
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const verifyPayment = async (
  order_id: string,
  payment_id: string,
  signature: string,
  secrets: RAZORPAY_SECRETS
) => {
  try {
    const validPayment = validatePaymentVerification(
      { order_id: order_id, payment_id: payment_id },
      signature,
      secrets.RAZORPAY_KEY_SECRET
    );
    return validPayment;
  } catch (err) {
    console.error(err);
    return false;
  }
};
