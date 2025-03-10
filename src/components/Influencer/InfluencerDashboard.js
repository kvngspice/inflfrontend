import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Table, Spinner, Alert, Modal } from 'react-bootstrap';
import { 
  FaChartLine, FaCalendar, FaDollarSign, FaBell, 
  FaCheckCircle, FaClock, FaExclamationTriangle, FaCalendarCheck, FaArrowRight
} from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import './InfluencerDashboard.css';
import InfluencerProfileSetup from './InfluencerProfileSetup';

const InfluencerDashboard = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeBookings: 0,
    earnings: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    pendingPayments: 0,
    activeCampaigns: 0,
    completedCampaigns: 0
  });
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(true); // Start with modal visible
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  useEffect(() => {
    console.log("InfluencerDashboard mounted, modal should be visible:", showProfileModal);
    // We'll fetch data when the modal is closed
    if (!showProfileModal) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [showProfileModal]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Fetch dashboard stats
      const statsResponse = await fetch('http://127.0.0.1:8000/api/influencer/dashboard/stats/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Fetch recent campaigns (using bookings endpoint for now)
      const campaignsResponse = await fetch('http://127.0.0.1:8000/api/influencer/bookings/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!campaignsResponse.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      
      const campaignsData = await campaignsResponse.json();
      
      // Get the most recent 3 campaigns
      const sortedCampaigns = campaignsData.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ).slice(0, 3);
      
      setRecentCampaigns(sortedCampaigns);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = () => {
    console.log("Profile completed, closing modal");
    setShowProfileModal(false);
  };

  console.log("Rendering dashboard, showProfileModal:", showProfileModal);

  return (
    <Container fluid>
      {/* Profile Setup Modal */}
      <Modal 
        show={showProfileModal} 
        backdrop="static" 
        keyboard={false} 
        size="lg"
        centered
        style={{ zIndex: 9999 }} // Ensure it's on top
      >
        <Modal.Header>
          <Modal.Title>Complete Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info" className="text-center mb-4">
            <h4>Complete your profile and let clients know about you</h4>
            <p>You need to complete your profile before accessing the dashboard</p>
          </Alert>
          <InfluencerProfileSetup onComplete={handleProfileComplete} />
        </Modal.Body>
      </Modal>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger" className="my-3">
          {error}
        </Alert>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Influencer Dashboard</h2>
            <Button variant="primary" onClick={() => setShowProfileModal(true)}>
              Update Profile
            </Button>
          </div>

          {/* Stats Cards */}
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card className="dashboard-stat-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Total Campaigns</h6>
                      <h3>{stats.totalCampaigns}</h3>
                    </div>
                    <FaChartLine className="stat-icon text-primary" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="dashboard-stat-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Active Bookings</h6>
                      <h3>{stats.activeBookings}</h3>
                    </div>
                    <FaCalendar className="stat-icon text-success" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="dashboard-stat-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Total Earnings</h6>
                      <h3>${stats.earnings}</h3>
                    </div>
                    <FaDollarSign className="stat-icon text-warning" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={3}>
              <Card className="dashboard-stat-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="text-muted">Pending Requests</h6>
                      <h3>{stats.pendingRequests}</h3>
                    </div>
                    <FaBell className="stat-icon text-danger" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* My Campaigns Section */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">My Campaigns</h5>
              <Link to="/influencer/campaigns" className="btn btn-sm btn-primary">
                View All <FaArrowRight className="ms-1" />
              </Link>
            </Card.Header>
            <Card.Body>
              {recentCampaigns.length === 0 ? (
                <Alert variant="info">
                  You don't have any campaigns yet.
                </Alert>
              ) : (
                <Row>
                  {recentCampaigns.map(campaign => (
                    <Col md={4} key={campaign.id} className="mb-3">
                      <Card className="h-100 campaign-card">
                        <Card.Body>
                          <div className="d-flex justify-content-between mb-2">
                            <h6 className="mb-0">{campaign.name}</h6>
                            <Badge 
                              bg={
                                campaign.status === 'active' ? 'success' : 
                                campaign.status === 'pending' ? 'warning' : 
                                campaign.status === 'completed' ? 'secondary' : 'primary'
                              }
                            >
                              {campaign.status === 'active' ? 'Active' : 
                               campaign.status === 'pending' ? 'Pending' : 
                               campaign.status === 'completed' ? 'Completed' : campaign.status}
                            </Badge>
                          </div>
                          <p className="text-muted small mb-2">
                            Brand: {campaign.brand_name}
                          </p>
                          <p className="small mb-2">
                            {campaign.description?.substring(0, 80)}
                            {campaign.description?.length > 80 ? '...' : ''}
                          </p>
                          <div className="d-flex justify-content-between align-items-center mt-3">
                            <span className="text-primary fw-bold">${campaign.budget}</span>
                            <Link to={`/influencer/campaigns`} className="btn btn-sm btn-outline-primary">
                              Details
                            </Link>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Card.Body>
          </Card>

          <Row className="mb-4">
            {/* Campaign Performance Chart */}
            <Col lg={8}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Campaign Performance</h5>
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={campaigns}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="created_at" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>

            {/* Recent Activity */}
            <Col lg={4}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Recent Activity</h5>
                </Card.Header>
                <Card.Body>
                  <div className="activity-timeline">
                    {campaigns.map(campaign => (
                      <div key={campaign.id} className="activity-item">
                        <div className="activity-content">
                          <h6>{campaign.name}</h6>
                          <p className="text-muted mb-0">
                            {campaign.brand} - ${campaign.budget}
                          </p>
                          <Badge bg={campaign.status === 'pending' ? 'warning' : 'success'}>
                            {campaign.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Campaign Requests Table */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Campaign Requests</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Campaign</th>
                    <th>Brand</th>
                    <th>Budget</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map(campaign => (
                    <tr key={campaign.id}>
                      <td>{campaign.name}</td>
                      <td>{campaign.brand}</td>
                      <td>${campaign.budget}</td>
                      <td>
                        <Badge bg={
                          campaign.status === 'pending' ? 'warning' :
                          campaign.status === 'active' ? 'success' :
                          'secondary'
                        }>
                          {campaign.status}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm">
                          View Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </Container>
  );
};

export default InfluencerDashboard; 