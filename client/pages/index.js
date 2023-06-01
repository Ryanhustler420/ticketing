import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket, idx) => {
    return (
      <tr key={idx}>
        <td>{ticket?.title}</td>
        <td>Rs. {ticket?.price}</td>
        <td>
          <Link
            href={`/tickets/[ticketId]`}
            as={`/tickets/${ticket?.id}`}
            legacyBehavior
          >
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};

export default LandingPage;
