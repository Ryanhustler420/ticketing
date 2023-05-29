const OrderIndex = ({ orders }) => {
  return (
    <div>
      <h2>Your order history</h2>
      <ul>
        {orders.map((el, idx) => (
          <li key={idx}>{el.ticket.title}</li>
        ))}
      </ul>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default OrderIndex;
