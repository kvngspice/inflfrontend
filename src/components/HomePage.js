import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaUserPlus, FaSignInAlt, FaBullhorn, FaUsers, 
  FaChartLine, FaRocket, FaHandshake, FaGlobe 
} from 'react-icons/fa';
import viraloop from '../components/VIRALOOP.svg';
import preview from '../preview.svg'
import social from '../social media.svg'
const HomePage = () => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <div className="hero-section text-white py-5">
        <Container>
          <Row className="align-items-center min-vh-75">
            <Col lg={6} className="mb-5 mb-lg-0">
            <img 
       src={viraloop} 
       alt="Platform Preview" 
        style={{ width: "250px", height: "auto" }}/>

              <h1 className="display-4 fw-bold mb-4 animate-in">
                Connect with Top Influencers
              </h1>
              <p className="lead mb-4 opacity-90">
                Launch impactful campaigns with Africa's most engaging content creators. 
                Our AI-powered platform matches you with influencers that align perfectly with your brand.
              </p>
              <div className="d-flex gap-3 mb-4">
                <Link to="/register">
                  <Button variant="light" size="lg" className="rounded-pill px-4 hover-scale">
                    <FaUserPlus className="me-2" />
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline-light" size="lg" className="rounded-pill px-4 hover-scale">
                    <FaSignInAlt className="me-2" />
                    Login
                  </Button>
                </Link>
              </div>
              <div className="stats-row d-flex gap-4">
                <div className="stat-item">
                  <h3 className="mb-0">10K+</h3>
                  <p className="mb-0 opacity-75">Influencers</p>
                </div>
                <div className="stat-item">
                  <h3 className="mb-0">500+</h3>
                  <p className="mb-0 opacity-75">Brands</p>
                </div>
                <div className="stat-item">
                  <h3 className="mb-0">98%</h3>
                  <p className="mb-0 opacity-75">Success Rate</p>
                </div>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block">
              <div className="stacked-images-container">
                <img 
                  src={social} 
                  alt="Social Media" 
                  className="stacked-image social-image animate-social"
                  style={{ width: "400px", height: "auto" }}
                />
                <img 
                  src={preview} 
                  alt="Platform Preview" 
                  className="stacked-image preview-image"
                  style={{ width: "400px", height: "auto" }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <h2 className="text-center mb-2">Why Choose Our Platform?</h2>
          <p className="text-center text-muted mb-5">
            Everything you need to run successful influencer campaigns
          </p>
          <Row className="g-4">
            <Col md={3}>
              <Card className="feature-card h-100 border-0 shadow-sm hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper mb-3">
                    <FaUsers className="text-primary" size={40} />
                  </div>
                  <Card.Title>Smart Matching</Card.Title>
                  <Card.Text>
                    AI-powered algorithm finds the perfect influencers for your brand and campaign goals
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="feature-card h-100 border-0 shadow-sm hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper mb-3">
                    <FaRocket className="text-success" size={40} />
                  </div>
                  <Card.Title>Quick Launch</Card.Title>
                  <Card.Text>
                    Set up and launch your campaign in minutes with our streamlined process
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="feature-card h-100 border-0 shadow-sm hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper mb-3">
                    <FaChartLine className="text-info" size={40} />
                  </div>
                  <Card.Title>Real-time Analytics</Card.Title>
                  <Card.Text>
                    Track campaign performance and ROI with detailed analytics dashboard
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="feature-card h-100 border-0 shadow-sm hover-lift">
                <Card.Body className="text-center p-4">
                  <div className="icon-wrapper mb-3">
                    <FaHandshake className="text-warning" size={40} />
                  </div>
                  <Card.Title>Secure Payments</Card.Title>
                  <Card.Text>
                    Safe and transparent payment system with escrow protection
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">How It Works</h2>
          <Row className="g-4">
            <Col md={4}>
              <div className="step-card text-center">
                <div className="step-number mb-3">1</div>
                <h4>Create Campaign</h4>
                <p>Define your campaign goals, budget, and target audience</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-card text-center">
                <div className="step-number mb-3">2</div>
                <h4>Match Influencers</h4>
                <p>Get matched with relevant influencers for your campaign</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-card text-center">
                <div className="step-number mb-3">3</div>
                <h4>Track Results</h4>
                <p>Monitor campaign performance and measure ROI</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section text-center py-5">
        <Container>
          <h2 className="mb-4">Ready to Start Your Campaign?</h2>
          <Link to="/register">
            <Button variant="primary" size="lg" className="rounded-pill px-5 hover-scale">
              Get Started Now
            </Button>
          </Link>
        </Container>
      </section>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
          min-height: 80vh;
          display: flex;
          align-items: center;
        }

        .stacked-images-container {
          position: relative;
          width: 450px;
          height: 450px;
          margin: 0 auto;
        }

        .stacked-image {
          position: absolute;
          transition: transform 0.3s ease;
          box-shadow: 0 10px 20px rgba(0,0,0,0);
          border-radius: 10px;
        }

        .social-image {
          top: 0;
          left: 0;
          z-index: 2;
          transform: rotate(-3deg);
        }

        .preview-image {
          top: 20px;
          left: 0px;
          z-index: 1;
          transform: rotate(5deg);
        }

        .stacked-images-container:hover .social-image {
          transform: rotate(-8deg) translateY(-10px);
        }

        .stacked-images-container:hover .preview-image {
          transform: rotate(8deg) translateY(10px);
        }

        .animate-in {
          animation: fadeIn 1s ease-out;
        }

        .hover-scale {
          transition: transform 0.2s;
        }

        .hover-scale:hover {
          transform: scale(1.05);
        }

        .hover-lift {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }

        .stat-item {
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .step-number {
          width: 40px;
          height: 40px;
          background: #4158D0;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          margin: 0 auto;
        }

        .icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(13, 110, 253, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-social {
          animation: socialEntrance 1s ease-out forwards;
        }

        @keyframes socialEntrance {
          from { 
            opacity: 0; 
            transform: translateY(-30px) rotate(0deg); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) rotate(-3deg); 
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;