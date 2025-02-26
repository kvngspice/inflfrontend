import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { FaBullhorn, FaUsers, FaCalendar, FaDollarSign, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import './CampaignList.css';
import config from '../../config';
import { useNavigate } from 'react-router-dom';

// Add an error boundary component
class ChartErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Error loading chart</div>;
    }
    return this.props.children;
  }
}

const INDUSTRIES = [
  'Fashion',
  'Lifestyle',
  'Technology',
  'Health and Fitness',
  'Food',
  'Entertainment',
  'Film',
  'Finance',
  'Agriculture',
  'FMCG',
  'Other'
];

const CAMPAIGN_OBJECTIVES = [
  'Brand Awareness',
  'Product Launch',
  'Lead Generation',
  'Sales Conversion',
  'Community Engagement',
  'Content Creation',
  'Event Promotion',
  'App Downloads',
  'Website Traffic',
  'Market Research'
];

const REGIONS = {
  'Nigeria': [
    'Lagos',
    'Abuja',
    'Port Harcourt',
    'Kano',
    'Ibadan',
    'All Nigeria'
  ],
  'Ghana': [
    'Accra',
    'Kumasi',
    'All Ghana'
  ],
  'Kenya': [
    'Nairobi',
    'Mombasa',
    'All Kenya'
  ],
  'South Africa': [
    'Johannesburg',
    'Cape Town',
    'Durban',
    'All South Africa'
  ]
};

// Add this status badge component
const StatusBadge = ({ campaign }) => {
  if (campaign.is_assigned) {
    return (
      <Badge bg="success" className="me-2">
        <FaCheckCircle className="me-1" /> Active
      </Badge>
    );
  }
  return (
    <Badge bg="warning" className="me-2">
      Pending Assignment
    </Badge>
  );
};

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add state for modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    objective: '',
    platforms: [],
    budget: '',
    demography: '18-24',
    gender: 'Male',
    region: 'Nigeria',
    industry: ''
  });
  const [otherIndustry, setOtherIndustry] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  // Add new state for delete confirmation
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState(null);

  // Add new state for analytics modal
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  // Add state for influencer matching
  const [matchedInfluencers, setMatchedInfluencers] = useState([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.API_URL}/api/campaigns/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCampaign)
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      // Refresh campaigns list
      await fetchCampaigns();
      
      // Close modal and reset form
      setShowCreateModal(false);
      setNewCampaign({
        name: '',
        objective: '',
        platforms: [],
        budget: '',
        demography: '18-24',
        gender: 'Male',
        region: 'Nigeria',
        industry: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/api/campaigns/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();
      console.log('Fetched campaigns:', data); // Debug log
      setCampaigns(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add delete handler
  const handleDeleteCampaign = async () => {
    try {
      const response = await fetch(`${config.API_URL}/api/campaigns/${campaignToDelete.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      // Refresh campaigns list
      await fetchCampaigns();
      
      // Close modal and reset state
      setShowDeleteModal(false);
      setCampaignToDelete(null);
    } catch (err) {
      setError(err.message);
      console.error('Error deleting campaign:', err);
    }
  };

  // Add function to fetch analytics data
  const fetchCampaignAnalytics = async (campaignId) => {
    try {
      // In production, replace with actual API call
      // const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/analytics/`);
      // const data = await response.json();
      
      // Mock data for now
      const data = {
        engagementStats: {
          timeline: [
            { date: '2024-01', likes: 1200, comments: 300, shares: 150 },
            { date: '2024-02', likes: 1500, comments: 400, shares: 200 },
            { date: '2024-03', likes: 1800, comments: 450, shares: 250 },
          ]
        },
        audienceDemographics: [
          { name: '18-24', value: 30 },
          { name: '25-34', value: 40 },
          { name: '35-44', value: 20 },
          { name: '45+', value: 10 },
        ],
        performanceMetrics: [
          { name: 'Week 1', reach: 5000, engagement: 3000, conversions: 150 },
          { name: 'Week 2', reach: 7000, engagement: 4200, conversions: 210 },
          { name: 'Week 3', reach: 9000, engagement: 5400, conversions: 270 },
        ],
        keyMetrics: {
          totalReach: '21,000',
          avgEngagement: '42%',
          totalConversions: '630',
          roi: '225%'
        }
      };
      
      setAnalyticsData(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    }
  };

  // Update the calculateMatchPercentage function
  const calculateMatchPercentage = (influencer, campaign) => {
    // First check if platforms match - this is non-negotiable
    if (!campaign.platforms || !influencer.platform) return 0;
    
    // Convert campaign platforms to lowercase for comparison
    const campaignPlatforms = campaign.platforms.map(p => p.toLowerCase());
    const influencerPlatform = influencer.platform.toLowerCase();
    
    // If platform doesn't match, return 0 immediately
    if (!campaignPlatforms.includes(influencerPlatform)) {
      return 0;
    }

    // If we get here, platforms match, now calculate other criteria
    let matchPoints = 30; // Start with 30 points for platform match
    let totalPoints = 30;

    // Budget match (25 points)
    if (campaign.budget && influencer.base_fee) {
      totalPoints += 25;
      if (parseFloat(influencer.base_fee) <= parseFloat(campaign.budget)) {
        matchPoints += 25;
      }
    }

    // Region match (20 points)
    if (campaign.region && influencer.region) {
      totalPoints += 20;
      if (influencer.region.toLowerCase().includes(campaign.region.toLowerCase())) {
        matchPoints += 20;
      }
    }

    // Demographics match (15 points)
    if (campaign.demography && influencer.demography) {
      totalPoints += 15;
      if (influencer.demography.toLowerCase().includes(campaign.demography.toLowerCase())) {
        matchPoints += 15;
      }
    }

    // Industry/Niche match (10 points)
    if (campaign.industry && influencer.niche) {
      totalPoints += 10;
      if (influencer.niche.toLowerCase().includes(campaign.industry.toLowerCase())) {
        matchPoints += 10;
      }
    }

    return Math.round((matchPoints / totalPoints) * 100);
  };

  // Update handleFindInfluencers to use stricter filtering
  const handleFindInfluencers = async (campaign) => {
    setIsMatching(true);
    setSelectedCampaign(campaign);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_URL}/api/campaigns/${campaign.id}/match-influencers/`, {
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
        throw new Error('Failed to find matching influencers');
      }

      const data = await response.json();
      setMatchedInfluencers(data);
      setShowMatchModal(true);
    } catch (err) {
      console.error('Error finding influencers:', err);
      setError('Failed to find matching influencers. Please try again.');
    } finally {
      setIsMatching(false);
    }
  };

  // Update the handleBookInfluencer function
  const handleBookInfluencer = async (influencer, campaign) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_URL}/api/bookings/create/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          influencer_id: influencer.id,
          campaign_id: campaign.id
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to create booking');
      }

      // Refresh campaigns list after successful booking
      await fetchCampaigns();
      setShowMatchModal(false);
      alert('Booking created successfully!');
    } catch (err) {
      console.error('Error booking influencer:', err);
      setError('Failed to book influencer. Please try again.');
    }
  };

  // Update the AnalyticsModal component
  const AnalyticsModal = ({ campaign, show, onHide, analyticsData }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    
    return (
      <Modal show={show} onHide={onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Campaign Details - {campaign?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Existing Analytics Section */}
          <div className="mb-4">
            <h5>Campaign Analytics</h5>
            {analyticsData && analyticsData.keyMetrics ? (
              <>
                {/* Keep existing analytics content */}
                <Row className="mb-4">
                  <Col md={3}>
                    <div className="text-center">
                      <h6>Total Reach</h6>
                      <div className="h4">{analyticsData.keyMetrics.totalReach}</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h6>Avg. Engagement</h6>
                      <div className="h4">{analyticsData.keyMetrics.avgEngagement}</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h6>Conversions</h6>
                      <div className="h4">{analyticsData.keyMetrics.totalConversions}</div>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h6>ROI</h6>
                      <div className="h4">{analyticsData.keyMetrics.roi}</div>
                    </div>
                  </Col>
                </Row>

                {/* Only show charts if we have the data */}
                {analyticsData.engagementStats && (
                  <Card className="mb-4">
                    <Card.Body>
                      <h5>Engagement Timeline</h5>
                      <ChartErrorBoundary>
                        <div style={{ width: '100%', height: 300 }}>
                          <ResponsiveContainer>
                            <LineChart data={analyticsData.engagementStats.timeline}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="likes" stroke="#8884d8" />
                              <Line type="monotone" dataKey="comments" stroke="#82ca9d" />
                              <Line type="monotone" dataKey="shares" stroke="#ffc658" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </ChartErrorBoundary>
                    </Card.Body>
                  </Card>
                )}

                <Row>
                  {analyticsData.audienceDemographics && (
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <h5>Audience Demographics</h5>
                          <ChartErrorBoundary>
                            <div style={{ width: '100%', height: 300 }}>
                              <ResponsiveContainer>
                                <PieChart>
                                  <Pie
                                    data={analyticsData.audienceDemographics}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                  >
                                    {analyticsData.audienceDemographics.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                  <Legend />
                                </PieChart>
                              </ResponsiveContainer>
                            </div>
                          </ChartErrorBoundary>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}

                  {analyticsData.performanceMetrics && (
                    <Col md={6}>
                      <Card>
                        <Card.Body>
                          <h5>Performance Metrics</h5>
                          <ChartErrorBoundary>
                            <div style={{ width: '100%', height: 300 }}>
                              <ResponsiveContainer>
                                <BarChart data={analyticsData.performanceMetrics}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="reach" fill="#8884d8" />
                                  <Bar dataKey="engagement" fill="#82ca9d" />
                                  <Bar dataKey="conversions" fill="#ffc658" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </ChartErrorBoundary>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              </>
            ) : (
              <p className="text-muted">Analytics data not available yet</p>
            )}
          </div>

          {/* Influencers Section */}
          <div className="mt-4">
            <h5>Assigned Influencers</h5>
            {campaign?.bookings && campaign.bookings.length > 0 ? (
              <div className="influencer-list">
                {campaign.bookings.map(booking => (
                  <Card key={booking.id} className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6>{booking.influencer?.name}</h6>
                          <div className="text-muted small">
                            <span className="me-3">
                              <i className="fas fa-hashtag"></i> {booking.influencer?.platform}
                            </span>
                            <span className="me-3">
                              <i className="fas fa-users"></i> {booking.influencer?.followers_count?.toLocaleString()} followers
                            </span>
                          </div>
                        </div>
                        <div>
                          <Badge 
                            bg={
                              booking.status === 'paid' ? 'success' :
                              booking.status === 'approved' ? 'info' :
                              booking.status === 'pending' ? 'warning' : 'secondary'
                            }
                          >
                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      {booking.payment_status && (
                        <div className="mt-2 small">
                          <strong>Payment Status:</strong>{' '}
                          <span className={`text-${booking.payment_status === 'completed' ? 'success' : 'warning'}`}>
                            {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                          </span>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <Alert variant="info">
                No influencers are currently assigned to this campaign.
              </Alert>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Add the Matching Modal component
  const MatchingModal = ({ campaign }) => (
    <Modal 
      show={showMatchModal} 
      onHide={() => setShowMatchModal(false)}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Matching Influencers for {campaign?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isMatching ? (
          <div className="text-center py-4">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Finding influencers...</span>
            </Spinner>
          </div>
        ) : matchedInfluencers.length > 0 ? (
          <Row>
            {matchedInfluencers.map(influencer => (
              <Col md={6} key={influencer.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <Card.Title className="mb-0">{influencer.name}</Card.Title>
                        <Card.Subtitle className="text-muted">
                          {influencer.platform} • {influencer.followers_count.toLocaleString()} followers
                        </Card.Subtitle>
                      </div>
                      <Badge 
                        bg={influencer.matchPercentage >= 80 ? 'success' : 
                           influencer.matchPercentage >= 60 ? 'warning' : 'danger'}
                      >
                        {influencer.matchPercentage}% Match
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <small className="text-muted">
                        <strong>Region:</strong> {influencer.region}<br/>
                        <strong>Niche:</strong> {influencer.niche}<br/>
                        <strong>Base Fee:</strong> ${influencer.base_fee}
                      </small>
                    </div>
                    <div className="mt-3">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleBookInfluencer(influencer, campaign)}
                      >
                        Book Now
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">
            No matching influencers found for this campaign's requirements.
          </Alert>
        )}
      </Modal.Body>
    </Modal>
  );

  // Update the getCampaignStatus function
  const getCampaignStatus = (campaign) => {
    if (campaign.bookings && campaign.bookings.length > 0) {
      // Check if any booking is paid
      const hasPaidBooking = campaign.bookings.some(booking => booking.status === 'paid');
      if (hasPaidBooking) {
        return { text: 'Active', variant: 'success' };
      }
      
      // Check if any booking is approved
      const hasApprovedBooking = campaign.bookings.some(booking => booking.status === 'approved');
      if (hasApprovedBooking) {
        return { text: 'Pending Payment', variant: 'info' };
      }
      
      // Check if any booking is pending approval
      const hasPendingBooking = campaign.bookings.some(booking => booking.status === 'pending');
      if (hasPendingBooking) {
        return { text: 'Pending Approval', variant: 'warning' };
      }

      // Check if all bookings are rejected
      const allRejected = campaign.bookings.every(booking => booking.status === 'rejected');
      if (allRejected) {
        return { text: 'Pending Assignment', variant: 'secondary' };
      }
    }
    
    // Default status for campaigns without bookings
    return { text: 'Pending Assignment', variant: 'secondary' };
  };

  // Add function to handle view details click
  const handleViewDetails = async (campaign) => {
    setSelectedCampaign(campaign);
    fetchCampaignAnalytics(campaign.id);
    setShowAnalyticsModal(true);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading campaigns...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Campaigns</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <FaPlus className="me-2" />
          Create New Campaign
        </Button>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {!loading && campaigns.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <FaBullhorn size={50} className="text-muted" />
          </div>
          <h3>No Campaigns Yet</h3>
          <p className="text-muted">
            You haven't created any campaigns yet. Start by creating your first campaign!
          </p>
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => setShowCreateModal(true)}
          >
            <FaPlus className="me-2" />
            Create Your First Campaign
          </Button>
        </div>
      ) : (
        <Row>
          {campaigns.map(campaign => (
            <Col md={4} key={campaign.id} className="mb-4">
              <Card className="h-100 shadow-sm hover-card">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <Card.Title>{campaign.name}</Card.Title>
                      <div className="mb-2">
                        <Badge bg={getCampaignStatus(campaign).variant} className="me-2">
                          {getCampaignStatus(campaign).text}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="text-danger p-0" 
                      onClick={() => {
                        setCampaignToDelete(campaign);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>

                  <Card.Text className="text-muted mb-3">
                    {campaign.objective}
                  </Card.Text>

                  <div className="mb-3">
                    <Badge bg="primary" className="me-2">
                      {campaign.industry}
                    </Badge>
                    {campaign.is_assigned && (
                      <div className="mt-2 small text-success">
                        <FaUsers className="me-1" />
                        {campaign.assigned_influencers_count || 1} Influencer(s) Assigned
                      </div>
                    )}
                  </div>

                  <div className="campaign-stats">
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <FaUsers className="me-2 text-primary" />
                        {campaign.demography}
                      </div>
                      <div>
                        <FaDollarSign className="me-2 text-success" />
                        ${campaign.budget}
                      </div>
                    </div>
                    
                    <div className="d-flex justify-content-between">
                      <div>
                        <FaCalendar className="me-2 text-info" />
                        {campaign.region}
                      </div>
                      <div>
                        Platforms: {campaign.platforms?.join(', ')}
                      </div>
                    </div>

                    {campaign.is_assigned && (
                      <div className="mt-2 progress" style={{ height: '5px' }}>
                        <div 
                          className="progress-bar bg-success" 
                          role="progressbar" 
                          style={{ width: `${campaign.progress || 0}%` }}
                          aria-valuenow={campaign.progress || 0} 
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => handleViewDetails(campaign)}
                    >
                      View Details
                    </Button>
                    {!campaign.is_assigned && (
                      <Button 
                        variant="outline-success" 
                        size="sm"
                        onClick={() => handleFindInfluencers(campaign)}
                      >
                        Find Influencers
                      </Button>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Campaign Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateCampaign}>
            <Form.Group className="mb-3">
              <Form.Label>Campaign Name</Form.Label>
              <Form.Control
                type="text"
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                required
                placeholder="Enter campaign name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Campaign Objective</Form.Label>
              <Form.Select
                value={newCampaign.objective}
                onChange={(e) => setNewCampaign({...newCampaign, objective: e.target.value})}
                required
              >
                <option value="">Select an objective</option>
                {CAMPAIGN_OBJECTIVES.map(objective => (
                  <option key={objective} value={objective}>
                    {objective}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Industry</Form.Label>
              <Form.Select
                value={newCampaign.industry}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewCampaign({
                    ...newCampaign, 
                    industry: value,
                    // Clear otherIndustry if not "Other"
                    otherIndustry: value === 'Other' ? otherIndustry : ''
                  });
                }}
                required
              >
                <option value="">Select an industry</option>
                {INDUSTRIES.map(industry => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* Show text input if "Other" is selected */}
            {newCampaign.industry === 'Other' && (
              <Form.Group className="mb-3">
                <Form.Label>Specify Industry</Form.Label>
                <Form.Control
                  type="text"
                  value={otherIndustry}
                  onChange={(e) => {
                    const value = e.target.value;
                    setOtherIndustry(value);
                    setNewCampaign({
                      ...newCampaign,
                      industry: `Other - ${value}`
                    });
                  }}
                  required
                  placeholder="Please specify your industry"
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Platforms</Form.Label>
              <Form.Select
                multiple
                value={newCampaign.platforms}
                onChange={(e) => setNewCampaign({
                  ...newCampaign, 
                  platforms: Array.from(e.target.selectedOptions, option => option.value)
                })}
                required
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter">Twitter</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type="number"
                value={newCampaign.budget}
                onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Demographics</Form.Label>
              <Form.Select
                value={newCampaign.demography}
                onChange={(e) => setNewCampaign({...newCampaign, demography: e.target.value})}
                required
              >
                <option value="13-17">13-17</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45+">45+</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Target Region</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Select
                    className="mb-2"
                    value={selectedCountry}
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setNewCampaign({
                        ...newCampaign,
                        region: e.target.value ? `All ${e.target.value}` : ''
                      });
                    }}
                    required
                  >
                    <option value="">Select Country</option>
                    {Object.keys(REGIONS).map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={6}>
                  <Form.Select
                    value={newCampaign.region}
                    onChange={(e) => setNewCampaign({...newCampaign, region: e.target.value})}
                    disabled={!selectedCountry}
                    required
                  >
                    <option value="">Select Region</option>
                    {selectedCountry && REGIONS[selectedCountry].map(region => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Campaign
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Campaign</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the campaign "{campaignToDelete?.name}"?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCampaign}>
            Delete Campaign
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Analytics Modal */}
      <AnalyticsModal campaign={selectedCampaign} show={showAnalyticsModal} onHide={() => setShowAnalyticsModal(false)} analyticsData={analyticsData} />

      {/* Add the MatchingModal component */}
      <MatchingModal campaign={selectedCampaign} />
    </Container>
  );
};

export default CampaignList; 