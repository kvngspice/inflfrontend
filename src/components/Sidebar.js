import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaBullhorn, FaUsers, FaWallet, FaSignOutAlt, FaHome, FaUser, FaCalendar } from 'react-icons/fa';

const Sidebar = ({ pendingPayments = [], handleLogout, handleLinkClick }) => {
  const influencerMenuItems = [
    { path: '/influencer/dashboard', icon: <FaHome />, label: 'Dashboard' },
    { path: '/influencer/profile', icon: <FaUser />, label: 'My Profile' },
    { path: '/influencer/bookings', icon: <FaCalendar />, label: 'My Bookings' },
  ];

  return (
    <div className="sidebar-wrapper">
      <div className="sidebar-header">
        <h3>Dashboard</h3>
      </div>
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/dashboard/campaigns" 
          className="sidebar-link"
          onClick={handleLinkClick}
        >
          <FaBullhorn className="me-2" /> Campaigns
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/dashboard/influencers" 
          className="sidebar-link"
          onClick={handleLinkClick}
        >
          <FaUsers className="me-2" /> Influencers
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/dashboard/payments" 
          className="sidebar-link position-relative d-flex align-items-center"
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
        <Nav.Link 
          className="sidebar-link d-flex align-items-center" 
          onClick={() => {
            if (handleLogout) handleLogout();
            if (handleLinkClick) handleLinkClick();
          }}
        >
          <FaSignOutAlt className="me-2" /> 
          <span>Logout</span>
        </Nav.Link>
      </Nav>
      <style jsx>{`
        .sidebar-wrapper {
          background-color: #343a40;
          color: white;
          height: 100%;
          padding: 1rem;
        }
        
        .sidebar-header {
          padding-bottom: 1rem;
          margin-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        
        .sidebar-link {
          color: rgba(255,255,255,0.8) !important;
          padding: 0.75rem 1rem;
          border-radius: 0.25rem;
          transition: all 0.2s;
        }
        
        .sidebar-link:hover {
          background-color: rgba(255,255,255,0.1);
          color: white !important;
        }
        
        .notification-badge {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background-color: #dc3545;
          color: white;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: bold;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: translateY(-50%) scale(1); }
          50% { transform: translateY(-50%) scale(1.1); }
          100% { transform: translateY(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Sidebar; 