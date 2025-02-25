import React, { useState, useEffect } from 'react';
import { Nav, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBullhorn, FaUsers, FaWallet, FaSignOutAlt } from 'react-icons/fa';
import config from '../config';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

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
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPendingPayments(data);
      setError(null);
    } catch (error) {
      console.error('Error checking pending payments:', error);
      setError('Failed to load payment information');
      if (error.message.includes('401')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
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
            <span className="notification-badge">
              {count}
            </span>
          )}
        </Nav.Link>
      </OverlayTrigger>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
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
            onClick={handleLogout}
            className="text-white mt-auto"
            style={{ cursor: 'pointer' }}
          >
            <FaSignOutAlt className="me-2" /> Logout
          </Nav.Link>
        </Nav>
      </div>

      <div className="flex-grow-1 p-4">
        {error && (
          <div className="alert alert-danger mb-4">
            {error}
            <button 
              className="btn btn-outline-danger btn-sm ms-3"
              onClick={checkPendingPayments}
            >
              Retry
            </button>
          </div>
        )}
        {children}
      </div>

      <style>
        {`
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
          }

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
          
          .nav-link {
            transition: all 0.3s ease;
            border-radius: 8px;
            margin-bottom: 8px;
          }
          
          .nav-link:hover {
            background-color: rgba(255,255,255,0.1);
            transform: translateX(5px);
          }

          .nav-link.active {
            background-color: rgba(255,255,255,0.2);
          }
        `}
      </style>
    </div>
  );
};

export default DashboardLayout;