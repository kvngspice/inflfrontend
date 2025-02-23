import React from "react";
import { Link } from "react-router-dom";
import { FaChartLine, FaUsers, FaClipboardList, FaRegUserCircle } from "react-icons/fa";

function Sidebar() {
  return (
    <div className="d-flex flex-column p-3 bg-dark text-white vh-100" style={{ width: "250px" }}>
      <h4 className="text-center mb-4">📊 Influencer Hub</h4>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link className="nav-link text-white" to="/campaigns">
            <FaClipboardList /> Campaigns
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/influencers">
            <FaUsers /> Influencers
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/reports">
            <FaChartLine /> Reports
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/register-influencer">
            <FaRegUserCircle /> Register Influencer
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
