import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaChartLine, FaUsers, FaClipboardList, FaRegUserCircle, FaSignOutAlt } from "react-icons/fa";

function Sidebar({ pendingPayments }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column p-3 bg-dark text-white vh-100" style={{ width: "250px" }}>
      <h4 className="text-center mb-4">📊 Influencer Hub</h4>
      <Nav className="flex-column">
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboard/campaigns" className="text-white">
            <FaClipboardList className="me-2" /> Campaigns
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboard/influencers" className="text-white">
            <FaUsers className="me-2" /> Influencers
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/dashboard/analytics" className="text-white">
            <FaChartLine className="me-2" /> Analytics
          </Nav.Link>
        </Nav.Item>
        {pendingPayments > 0 && (
          <Nav.Item>
            <Nav.Link as={Link} to="/dashboard/payments" className="text-white">
              <FaRegUserCircle className="me-2" /> Payments
              <span className="badge bg-danger ms-2">{pendingPayments}</span>
            </Nav.Link>
          </Nav.Item>
        )}
        <Nav.Item>
          <Nav.Link onClick={handleLogout} className="text-white">
            <FaSignOutAlt className="me-2" /> Logout
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default Sidebar; 