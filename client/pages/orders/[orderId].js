import axios from "axios";
import Router from "next/router";
import { useEffect, useState } from "react";
import useRequest from "../../hooks/use-request";

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest: initPayment, errors: initPaymentError } = useRequest({
    body: { orderId: order.id, receipt: order.ticket.title },
    onSuccess: (ord) => displayRazorpay(ord),
    url: "/api/payments/init",
    method: "post",
  });

  const displayRazorpay = async (result) => {
    if (!result) return;

    let res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) return;

    const options = {
      key: "rzp_test_siNP5udU30MXHk",
      amount: result.amount.toString(),
      currency: result.currency,
      name: "Ticketing Inc.",
      description: "Purchasing Show Ticket",
      order_id: result.id,
      handler: async function (response) {
        try {
          await axios.post("/api/payments/complete", {
            orderId: order.id,
            rp_orderId: response.razorpay_order_id,
            rp_paymentId: response.razorpay_payment_id,
            rp_paymentSignature: response.razorpay_signature,
          });
          Router.push("/orders");
        } catch (err) {}
      },
      prefill: {
        name: "Gourav Gupta",
        email: "gouravgupta@pornhub.gov.in",
        contact: "987654321",
      },
      notes: {
        address: "40, Raisehand Software Private Limited",
      },
      theme: {
        color: "#000",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }

  return (
    <div>
      <p>Time left to pay: {timeLeft} seconds</p>
      {initPaymentError}
      <button className="btn btn-primary" onClick={initPayment}>
        Pay
      </button>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
