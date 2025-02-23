import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";

function InfluencerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const response = await fetch("${process.env.REACT_APP_API_URL}/api/influencers/bookings/");
    const data = await response.json();
    setBookings(data);
  };

  return (
    <Container>
      <h1>Influencer Dashboard</h1>
      <Row>
        {bookings.map((booking) => (
          <Col md={4} key={booking.id}>
            <Card>
              <Card.Body>
                <h5>{booking.campaign_name}</h5>
                <p>Status: {booking.status}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default InfluencerDashboard;
