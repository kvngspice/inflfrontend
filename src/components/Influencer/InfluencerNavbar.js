import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCalendarAlt, FaMoneyBillWave, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const InfluencerNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="influencer-sidebar">
      <div className="sidebar-header">
        <h3>Influencer Portal</h3>
      </div>
      <Nav className="flex-column">
        <Nav.Link 
          as={Link} 
          to="/influencer/dashboard" 
          className={`sidebar-link ${location.pathname === '/influencer/dashboard' ? 'active' : ''}`}
        >
          <FaHome className="me-2" /> Dashboard
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/influencer/campaigns" 
          className={`sidebar-link ${location.pathname === '/influencer/campaigns' ? 'active' : ''}`}
        >
          <FaCalendarAlt className="me-2" /> My Campaigns
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/influencer/earnings" 
          className={`sidebar-link ${location.pathname === '/influencer/earnings' ? 'active' : ''}`}
        >
          <FaMoneyBillWave className="me-2" /> Earnings
        </Nav.Link>
        <Nav.Link 
          as={Link} 
          to="/influencer/profile" 
          className={`sidebar-link ${location.pathname === '/influencer/profile' ? 'active' : ''}`}
        >
          <FaUserCircle className="me-2" /> My Profile
        </Nav.Link>
        <Nav.Link onClick={handleLogout} className="sidebar-link">
          <FaSignOutAlt className="me-2" /> Logout
        </Nav.Link>
      </Nav>
      <style jsx>{`
        .influencer-sidebar {
          background-color: #2c3e50;
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
        
        .sidebar-link.active {
          background-color: #0d6efd;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default InfluencerNavbar; 