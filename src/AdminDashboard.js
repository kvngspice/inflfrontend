import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/bookings/")
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      });
  }, []);

  const handleConfirmBooking = (bookingId) => {
    fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/confirm/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then(() => {
        alert("Booking Confirmed!");
        setBookings(
          bookings.map((booking) =>
            booking.id === bookingId ? { ...booking, status: "confirmed" } : booking
          )
        );
      })
      .catch((error) => {
        console.error("Error confirming booking:", error);
        alert("Failed to confirm booking.");
      });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading bookings...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mt-4 mb-4">Influencer Bookings</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Campaign Name</th>
            <th>Influencer</th>
            <th>Budget</th>
            <th>Date</th>
            <th>Status</th>
            <th>Confirm</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.campaign_name}</td>
              <td>{booking.influencer_name}</td>
              <td>${booking.budget}</td>
              <td>{booking.date}</td>
              <td>
                <span className={booking.status === "confirmed" ? "text-success" : "text-warning"}>
                  {booking.status}
                </span>
              </td>
              <td>
                {booking.status === "pending" ? (
                  <Button variant="success" size="sm" onClick={() => handleConfirmBooking(booking.id)}>
                    Confirm
                  </Button>
                ) : (
                  <span className="text-muted">Confirmed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default BookingsPage;
