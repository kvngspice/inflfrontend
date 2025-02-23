import React, { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import PaystackPayment from './PaystackPayment';

const PaymentPage = ({ booking_id }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [booking_id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/bookings/${booking_id}/`);
      const data = await response.json();
      setBookingDetails(data);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Handle successful payment
    alert('Payment completed successfully!');
    // Redirect or update UI as needed
  };

  if (loading) return <div>Loading...</div>;
  if (!bookingDetails) return <div>Booking not found</div>;

  return (
    <Container className="py-5">
      <Card>
        <Card.Header>
          <h4>Complete Payment</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Booking Details</h5>
            <p>Campaign: {bookingDetails.campaign.name}</p>
            <p>Influencer: {bookingDetails.influencer.name}</p>
            <p>Amount: NGN {bookingDetails.campaign.budget}</p>
          </div>
          
          <PaystackPayment 
            amount={bookingDetails.campaign.budget}
            email={bookingDetails.user.email}
            booking_id={booking_id}
            onSuccess={handlePaymentSuccess}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentPage; 