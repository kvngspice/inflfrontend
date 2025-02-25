import React, { useState, useEffect } from 'react';
import { Nav, OverlayTrigger, Tooltip, Button, Offcanvas } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBullhorn, FaUsers, FaWallet, FaBars, FaSignOutAlt } from 'react-icons/fa';
import config from '../config';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    checkPendingPayments();
  }, [navigate]);

  const checkPendingPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_URL}/api/bookings/approved-pending-payment/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('Failed to fetch pending payments');
      }

      const data = await response.json();
      setPendingPayments(data);
      setError(null);
    } catch (err) {
      console.error('Error checking pending payments:', err);
      setError('Failed to load payment information');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleLinkClick = () => {
    setShowMobileSidebar(false);
  };

  const SidebarContent = () => (
    <Nav className="flex-column">
      <Nav.Link 
        as={Link} 
        to="/dashboard/campaigns" 
        className="text-white"
        onClick={handleLinkClick}
      >
        <FaBullhorn className="me-2" /> Campaigns
      </Nav.Link>
      <Nav.Link 
        as={Link} 
        to="/dashboard/influencers" 
        className="text-white"
        onClick={handleLinkClick}
      >
        <FaUsers className="me-2" /> Influencers
      </Nav.Link>
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip>
            {pendingPayments.length === 0 
              ? 'No pending payments' 
              : `${pendingPayments.length} booking${pendingPayments.length > 1 ? 's' : ''} pending payment`}
          </Tooltip>
        }
      >
        <Nav.Link 
          as={Link} 
          to="/dashboard/payments" 
          className="text-white position-relative d-flex align-items-center"
          onClick={handleLinkClick}
        >
          <FaWallet className="me-2" /> 
          <span>Payments</span>
          {pendingPayments.length > 0 && (
            <span className="notification-badge">
              {pendingPayments.length}
            </span>
          )}
        </Nav.Link>
      </OverlayTrigger>
      <Nav.Link 
        className="text-white d-flex align-items-center" 
        onClick={() => {
          handleLogout();
          handleLinkClick();
        }}
      >
        <FaSignOutAlt className="me-2" /> 
        <span>Logout</span>
      </Nav.Link>
    </Nav>
  );

  return (
    <div className="d-flex">
      {/* Mobile Toggle Button */}
      <Button
        variant="dark"
        className="d-lg-none position-fixed"
        style={{ top: '1rem', left: '1rem', zIndex: 1030 }}
        onClick={() => setShowMobileSidebar(true)}
      >
        <FaBars />
      </Button>

      {/* Mobile Sidebar */}
      <Offcanvas 
        show={showMobileSidebar} 
        onHide={() => setShowMobileSidebar(false)}
        className="d-lg-none bg-dark"
      >
        <Offcanvas.Header closeButton className="text-white">
          <Offcanvas.Title>Dashboard</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <SidebarContent />
        </Offcanvas.Body>
      </Offcanvas>

      {/* Desktop Sidebar */}
      <div className="d-none d-lg-flex flex-column p-4 bg-dark text-white" style={{ width: "280px", minHeight: "100vh" }}>
        <h2 className="text-center mb-4">Dashboard</h2>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {children}
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          
          .notification-badge {
            position: absolute;
            right: 10px;
            background-color: #ff4444;
            color: white;
            border-radius: 50%;
            padding: 2px 6px;
            font-size: 0.75rem;
            min-width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            animation: pulse 2s infinite;
            transition: all 0.3s ease;
          }
          
          .nav-link:hover .notification-badge {
            transform: scale(1.1);
          }

          /* Mobile Adjustments */
          @media (max-width: 991.98px) {
            .flex-grow-1 {
              padding-top: 4rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLayout;