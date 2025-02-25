import React, { useState, useEffect } from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBullhorn, FaUsers, FaWallet } from 'react-icons/fa';
import config from '../config';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [pendingPayments, setPendingPayments] = useState([]);

  useEffect(() => {
    checkPendingPayments();
  }, []);

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
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPendingPayments(data);
    } catch (error) {
      console.error('Error checking pending payments:', error);
    }
  };

  const renderPaymentLink = () => {
    const count = pendingPayments.length;
    
    return (
      <OverlayTrigger
        placement="right"
        overlay={
          <Tooltip>
            {count === 0 
              ? 'No pending payments' 
              : `${count} booking${count > 1 ? 's' : ''} pending payment`}
          </Tooltip>
        }
      >
        <Nav.Link 
          as={Link} 
          to="/dashboard/payments" 
          className="text-white position-relative d-flex align-items-center"
        >
          <FaWallet className="me-2" /> 
          <span>Payments</span>
          {count > 0 && (
            <span 
              className="notification-badge"
              style={{
                position: 'absolute',
                right: '10px',
                backgroundColor: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '0.75rem',
                minWidth: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                animation: 'pulse 2s infinite'
              }}
            >
              {count}
            </span>
          )}
        </Nav.Link>
      </OverlayTrigger>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="d-flex">
      <div className="d-flex flex-column p-4 bg-dark text-white" style={{ width: "280px", minHeight: "100vh" }}>
        <h2 className="text-center mb-4">Dashboard</h2>
        <Nav className="flex-column">
          <Nav.Link 
            as={Link} 
            to="/dashboard/campaigns" 
            className="text-white"
          >
            <FaBullhorn className="me-2" /> Campaigns
          </Nav.Link>
          <Nav.Link 
            as={Link} 
            to="/dashboard/influencers" 
            className="text-white"
          >
            <FaUsers className="me-2" /> Influencers
          </Nav.Link>
          {renderPaymentLink()}
          <Nav.Link 
            className="text-white" 
            onClick={handleLogout}
          >
            🚪 Logout
          </Nav.Link>
        </Nav>
      </div>

      <div className="flex-grow-1 p-4">
        {children}
      </div>

      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }
          
          .notification-badge {
            transition: all 0.3s ease;
          }
          
          .nav-link:hover .notification-badge {
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLayout;