import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';
import config from '../config';

function DashboardLayout({ children }) {
  const [pendingPayments, setPendingPayments] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkPendingPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_URL}/api/bookings/approved-pending-payment/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPendingPayments(data.length);
      } catch (error) {
        console.error("Error checking pending payments:", error);
        setError("Failed to check pending payments");
      }
    };

    checkPendingPayments();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="px-0">
          <Sidebar pendingPayments={pendingPayments} />
        </Col>
        <Col md={9} className="py-3">
          {error && <div className="alert alert-danger">{error}</div>}
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardLayout;