import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Nav } from "react-bootstrap";
import { FaBell, FaUser, FaCheck, FaTimes } from "react-icons/fa";

function InfluencerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Fetch influencer bookings when the dashboard loads
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/influencer-bookings/");
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleBookingResponse = async (bookingId, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/influencer-bookings/${bookingId}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: status }),
      });

      if (response.ok) {
        setBookings(bookings.map((booking) => 
          booking.id === bookingId ? { ...booking, status } : booking
        ));
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="d-flex flex-column p-4 bg-dark text-white" style={{ width: "280px", height: "100vh" }}>
        <h2 className="text-center mb-4">Influencer Dashboard</h2>
        <Nav className="flex-column">
          <Nav.Link href="#" className="text-white">
            <FaBell className="me-2" /> Notifications
          </Nav.Link>
          <Nav.Link href="#" className="text-white">
            <FaUser className="me-2" /> Profile Settings
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content */}
      <Container fluid className="p-4">
        <h1 className="mb-4">My Campaign Bookings</h1>

        {/* Bookings List */}
        <Row>
          {bookings.length === 0 ? (
            <p className="text-muted">No bookings yet.</p>
          ) : (
            bookings.map((booking) => (
              <Col md={6} key={booking.id}>
                <Card className="shadow-sm mb-3">
                  <Card.Body>
                    <h5>Campaign: {booking.campaign_name}</h5>
                    <p><strong>Client:</strong> {booking.client_name}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    
                    {/* Accept / Decline Buttons */}
                    {booking.status === "pending" && (
                      <div className="d-flex gap-2">
                        <Button variant="success" onClick={() => handleBookingResponse(booking.id, "accepted")}>
                          <FaCheck /> Accept
                        </Button>
                        <Button variant="danger" onClick={() => handleBookingResponse(booking.id, "declined")}>
                          <FaTimes /> Decline
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
}

export default InfluencerDashboard;
