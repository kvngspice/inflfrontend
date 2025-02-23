import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Table, Badge, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { FaCreditCard, FaHistory, FaFileInvoice, FaWallet, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PaymentSection = () => {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingPayments();
    // TODO: Fetch transactions from backend
    // For now using mock data
    setTransactions([
      {
        id: 1,
        date: '2024-03-15',
        description: 'Campaign Payment - Fashion Influencer',
        amount: 500.00,
        status: 'completed'
      },
      {
        id: 2,
        date: '2024-03-14',
        description: 'Booking Fee - Tech Review',
        amount: 250.00,
        status: 'pending'
      }
    ]);
    setBalance(1500.00);
    setLoading(false);
  }, []);

  const fetchPendingPayments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      console.log('Fetching approved bookings...');  // Debug log
      
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/bookings/approved-pending-payment/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized access');  // Debug log
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch approved bookings');
      }
      
      const data = await response.json();
      console.log('Received bookings:', data);  // Debug log
      setPendingBookings(data);
    } catch (error) {
      console.error('Error fetching approved bookings:', error);
      setError('Failed to load approved bookings. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitiatePayment = async (booking) => {
    setSelectedBooking(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/payments/initiate/${selectedBooking.id}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to initiate payment');
      const paymentData = await response.json();

      // Here you would typically integrate with a payment gateway
      // For now, we'll simulate a successful payment
      await completePayment(paymentData.payment_id);

      setShowPaymentModal(false);
      fetchPendingPayments(); // Refresh the list

    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  const completePayment = async (paymentId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/payments/complete/${paymentId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to complete payment');
      return await response.json();
    } catch (error) {
      console.error('Error completing payment:', error);
      throw error;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      pending: 'warning',
      failed: 'danger'
    };
    return <Badge bg={variants[status] || 'secondary'}>{status}</Badge>;
  };

  // Add notification alert
  const renderNotificationAlert = () => {
    if (pendingBookings.length > 0) {
      return (
        <Alert variant="warning" className="mb-4">
          <div className="d-flex align-items-center">
            <FaBell className="me-2" />
            <div>
              <strong>Payment Required!</strong>
              <p className="mb-0">
                You have {pendingBookings.length} approved booking{pendingBookings.length > 1 ? 's' : ''} pending payment.
                Please complete the payment{pendingBookings.length > 1 ? 's' : ''} to start your campaign{pendingBookings.length > 1 ? 's' : ''}.
              </p>
            </div>
          </div>
        </Alert>
      );
    }
    return null;
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Payments & Transactions</h2>

      {/* Add notification alert at the top */}
      {renderNotificationAlert()}

      {isLoading ? (
        <div className="text-center py-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Row className="mb-4">
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaWallet className="text-primary me-2" size={24} />
                  <h5 className="mb-0">Available Balance</h5>
                </div>
                <h3 className="mb-0">${balance.toFixed(2)}</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaCreditCard className="text-success me-2" size={24} />
                  <h5 className="mb-0">Payment Methods</h5>
                </div>
                <Button variant="outline-primary">Add Payment Method</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <FaFileInvoice className="text-info me-2" size={24} />
                  <h5 className="mb-0">Invoices</h5>
                </div>
                <Button variant="outline-secondary">View All Invoices</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      <Card>
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <FaHistory className="text-primary me-2" size={24} />
            <h5 className="mb-0">Recent Transactions</h5>
          </div>
          <Table responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{getStatusBadge(transaction.status)}</td>
                  <td>
                    <Button variant="link" size="sm">View Details</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mt-4">
        <Card.Body>
          <h5 className="mb-4">Approved Bookings Pending Payment</h5>
          <Table responsive>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Influencer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingBookings.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No approved bookings pending payment</td>
                </tr>
              ) : (
                pendingBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>{booking.campaign.name}</td>
                    <td>
                      {booking.influencer.name}
                      <br />
                      <small className="text-muted">{booking.influencer.platform}</small>
                    </td>
                    <td>${booking.campaign.budget}</td>
                    <td>
                      <Badge bg="success">Approved</Badge>
                    </td>
                    <td>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleInitiatePayment(booking)}
                      >
                        Pay Now
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Complete Payment for Approved Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <div className="mb-4">
                <h6>Campaign Details</h6>
                <p><strong>Name:</strong> {selectedBooking.campaign.name}</p>
                <p><strong>Amount:</strong> ${selectedBooking.campaign.budget}</p>
              </div>
              
              <div className="mb-4">
                <h6>Influencer Details</h6>
                <p><strong>Name:</strong> {selectedBooking.influencer.name}</p>
                <p><strong>Platform:</strong> {selectedBooking.influencer.platform}</p>
              </div>

              <div className="alert alert-info">
                <small>
                  By clicking "Complete Payment", you agree to pay the full amount for this campaign.
                  The influencer will be notified once the payment is processed.
                </small>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handlePaymentSubmit}
            disabled={!selectedBooking}
          >
            Complete Payment (${selectedBooking?.campaign.budget})
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PaymentSection; 