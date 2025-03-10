import React, { useState, useEffect } from 'react';
import { Nav, OverlayTrigger, Tooltip, Button, Offcanvas, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBullhorn, FaUsers, FaWallet, FaBars, FaSignOutAlt } from 'react-icons/fa';
import Sidebar from './Sidebar';
import InfluencerNavbar from './Influencer/InfluencerNavbar';
import config from '../config';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    if (userRole === 'client') {
      checkPendingPayments();
    }
  }, [userRole]);

  const checkPendingPayments = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/bookings/approved-pending-payment/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingPayments(data);
      }
    } catch (error) {
      console.error('Error checking pending payments:', error);
    }
  };

  const handleLinkClick = () => {
    setShowMobileSidebar(false); // Close sidebar on mobile when a link is clicked
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <Container fluid className="dashboard-container p-0">
      <Row className="g-0">
        <Col lg={2} className="sidebar-col d-none d-lg-block">
          {userRole === 'influencer' ? 
            <InfluencerNavbar /> : 
            <Sidebar 
              pendingPayments={pendingPayments} 
              handleLogout={handleLogout} 
              handleLinkClick={handleLinkClick} 
            />
          }
        </Col>
        <Col lg={10} className="content-col">
          <div className="d-lg-none mobile-header">
            <Button 
              variant="dark" 
              className="menu-button"
              onClick={() => setShowMobileSidebar(true)}
            >
              <FaBars />
            </Button>
          </div>
          <div className="content-wrapper">
            {children}
          </div>
        </Col>
      </Row>

      {/* Mobile Sidebar */}
      <Offcanvas 
        show={showMobileSidebar} 
        onHide={() => setShowMobileSidebar(false)}
        className="mobile-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {userRole === 'influencer' ? 
            <InfluencerNavbar /> : 
            <Sidebar 
              pendingPayments={pendingPayments} 
              handleLogout={handleLogout} 
              handleLinkClick={handleLinkClick} 
            />
          }
        </Offcanvas.Body>
      </Offcanvas>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
        }
        
        .sidebar-col {
          background-color: #343a40;
          min-height: 100vh;
        }
        
        .content-col {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .content-wrapper {
          padding: 1.5rem;
        }
        
        .mobile-header {
          padding: 1rem;
          background-color: #343a40;
          position: sticky;
          top: 0;
          z-index: 1000;
        }
        
        .menu-button {
          padding: 0.5rem;
        }
        
        .mobile-sidebar {
          max-width: 80%;
        }
      `}</style>
    </Container>
  );
};

export default DashboardLayout;