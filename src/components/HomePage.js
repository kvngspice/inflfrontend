import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSignInAlt, FaBullhorn, FaUsers, FaChartLine } from 'react-icons/fa';

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="display-4">Connect with Influencers</h1>
              <p className="lead">
                Find the perfect influencers for your brand and manage your campaigns effectively
              </p>
              <div className="mt-4">
                <Link to="/register">
                  <Button variant="light" size="lg" className="me-3">
                    <FaUserPlus className="me-2" />
                    Register
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-light" size="lg">
                    <FaSignInAlt className="me-2" />
                    Login
                  </Button>
                </Link>
              </div>
            </Col>
            <Col md={6}>
              {/* Add an illustration or image here */}
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <Container className="py-5">
        <h2 className="text-center mb-5">Why Choose Us?</h2>
        <Row>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <FaUsers className="text-primary mb-3" size={40} />
                <Card.Title>Find Influencers</Card.Title>
                <Card.Text>
                  Connect with influencers that match your brand's values and target audience
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <FaBullhorn className="text-primary mb-3" size={40} />
                <Card.Title>Manage Campaigns</Card.Title>
                <Card.Text>
                  Create and manage your influencer marketing campaigns efficiently
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 shadow-sm">
              <Card.Body className="text-center">
                <FaChartLine className="text-primary mb-3" size={40} />
                <Card.Title>Track Performance</Card.Title>
                <Card.Text>
                  Monitor campaign performance and influencer metrics in real-time
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage; 