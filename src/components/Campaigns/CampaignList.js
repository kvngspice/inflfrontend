import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal, Form, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { FaBullhorn, FaUsers, FaCalendar, FaDollarSign, FaPlus, FaTrash, FaCheckCircle, FaInstagram, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import './CampaignList.css';
import config from '../../config';

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
  'Market Research',
  'Music Promotion'
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
    demography: '',
    demographics: [],
    gender: 'Male',
    region: '',
    industry: '',
    brief: ''
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

  // Add new state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add this state for form errors
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Validate required fields
      const requiredFields = [
        { field: 'name', message: 'Campaign name is required' },
        { field: 'objective', message: 'Campaign objective is required' },
        { field: 'industry', message: 'Industry is required' },
        { field: 'budget', message: 'Budget is required' },
        { field: 'region', message: 'Region is required' }
      ];
      
      for (const { field, message } of requiredFields) {
        if (!newCampaign[field]) {
          setFormError(message);
          setIsSubmitting(false);
          return;
        }
      }
      
      // Make sure platforms is not empty
      if (!newCampaign.platforms || newCampaign.platforms.length === 0) {
        setFormError("Please select at least one platform");
        setIsSubmitting(false);
        return;
      }
      
      // Create a formatted platforms_text string
      const platformsText = Array.isArray(newCampaign.platforms) ? newCampaign.platforms.join(', ') : '';
      
      // Fix gender value - convert "Both" to a valid value accepted by the backend
      let genderValue = newCampaign.gender;
      if (genderValue === 'Both') {
        genderValue = 'All';
      }
      
      // Prepare campaign data with all required fields
      const campaignData = {
        name: newCampaign.name,
        objective: newCampaign.objective,
        platforms: newCampaign.platforms,
        platforms_text: platformsText,
        budget: parseFloat(newCampaign.budget) || 0,
        demography: newCampaign.demographics?.length > 0 ? newCampaign.demographics[0] : "18-24",
        gender: genderValue,
        region: newCampaign.region,
        industry: newCampaign.industry,
        duration: "30",
        content_requirements: newCampaign.brief || "",
        target_metrics: {
          engagement_rate: 0,
          followers_range: {
            min: 1000,
            max: 100000
          }
        },
        deliverables: []
      };
      
      console.log("Sending campaign data:", campaignData);
      
      const response = await fetch(`${config.API_URL}/api/campaigns/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const data = await response.json();
      console.log("Created campaign:", data);
      
      await fetchCampaigns();
      setShowCreateModal(false);
      setNewCampaign({
        name: '',
        objective: '',
        platforms: [],
        budget: '',
        demography: '',
        demographics: [],
        gender: 'Male',
        region: '',
        industry: '',
        brief: ''
      });
      
    } catch (err) {
      console.error("Error creating campaign:", err);
      setFormError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
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
    try {
      setSelectedCampaign(campaign);
      const response = await fetch(`${config.API_URL}/api/influencers/`);
      const influencers = await response.json();

      // Filter and sort influencers by match percentage
      const matchedInfluencers = influencers
        .map(influencer => ({
          ...influencer,
          matchPercentage: calculateMatchPercentage(influencer, campaign)
        }))
        // Only include influencers with a match percentage > 0 (meaning platform matches)
        .filter(influencer => influencer.matchPercentage > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

      setMatchedInfluencers(matchedInfluencers);
      setShowMatchModal(true);
    } catch (error) {
      console.error('Error finding influencers:', error);
      alert('Failed to find matching influencers');
    } finally {
      setIsMatching(false);
    }
  };

  // Update the handleBookInfluencer function
  const handleBookInfluencer = async (influencer, campaign) => {
    try {
      if (!campaign || !influencer) {
        throw new Error('Missing campaign or influencer data');
      }

      // First check if influencer's base fee exceeds campaign budget
      if (campaign.budget && influencer.base_fee) {
        if (parseFloat(influencer.base_fee) > parseFloat(campaign.budget)) {
          const willProceed = window.confirm(
            `Warning: This influencer's base fee ($${influencer.base_fee}) is above the campaign budget ($${campaign.budget}). Would you like to proceed anyway?`
          );
          
          if (!willProceed) {
            return;
          }
        }
      }

      const bookingData = {
        influencer_id: influencer.id,
        campaign_id: campaign.id
      };

      console.log("Sending booking data:", bookingData);

      const response = await fetch(`${config.API_URL}/api/bookings/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      console.log("Booking response:", data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create booking');
      }

      alert('Booking created successfully! Waiting for admin approval.');
      await fetchCampaigns();
      setShowMatchModal(false);

    } catch (err) {
      console.error('Error booking influencer:', err);
      alert(err.message || 'Failed to create booking. Please try again.');
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
    <Modal show={showMatchModal} onHide={() => setShowMatchModal(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Matching Influencers for {campaign?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isMatching ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Finding influencers...</span>
            </div>
          </div>
        ) : matchedInfluencers.length > 0 ? (
          <Row>
            {matchedInfluencers.map(influencer => (
              <Col md={6} key={influencer.id} className="mb-3">
                <Card>
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Card.Title>{influencer.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
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
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <div className="d-flex align-items-center">
              <FaPlus className="text-primary me-2" />
              Create New Campaign
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form onSubmit={handleCreateCampaign}>
            {/* Campaign Basic Info Section */}
            <div className="mb-4">
              <h5 className="mb-3 text-primary">Basic Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Campaign Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                      required
                      placeholder="Enter campaign name"
                      className="py-2"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Industry</Form.Label>
                    <Form.Select
                      value={newCampaign.industry}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewCampaign({
                          ...newCampaign, 
                          industry: value,
                          otherIndustry: value === 'Other' ? otherIndustry : ''
                        });
                      }}
                      required
                      className="py-2"
                    >
                      <option value="">Select an industry</option>
                      {INDUSTRIES.map(industry => (
                        <option key={industry} value={industry}>{industry}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Campaign Objective</Form.Label>
                <Form.Select
                  value={newCampaign.objective}
                  onChange={(e) => setNewCampaign({...newCampaign, objective: e.target.value})}
                  required
                  className="py-2"
                >
                  <option value="">Select an objective</option>
                  {CAMPAIGN_OBJECTIVES.map(objective => (
                    <option key={objective} value={objective}>{objective}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Campaign Brief</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={newCampaign.brief || ''}
                  onChange={(e) => setNewCampaign({...newCampaign, brief: e.target.value})}
                  placeholder="Provide additional context about your campaign, specific requirements, or any other details that would help influencers understand your goals."
                  className="py-2"
                />
                <Form.Text className="text-muted">
                  This information will be shared with influencers to help them create better content for your campaign.
                </Form.Text>
              </Form.Group>
            </div>

            {/* Target Audience Section */}
            <div className="mb-4">
              <h5 className="mb-3 text-primary">Target Audience</h5>
              <Row>
              
                  <Form.Group className="mb-3">
                    <Form.Label>Target Demographics</Form.Label>
                    <div className="demographics-selector p-3 border rounded bg-light">
                      {["13-17", "18-24", "25-34", "35-44", "45+"].map(age => (
                        <Form.Check
                          key={age}
                          type="checkbox"
                          id={`age-${age}`}
                          label={`${age} years`}
                          className="mb-2"
                          checked={newCampaign.demographics?.includes(age)}
                          onChange={(e) => {
                            const updatedDemographics = e.target.checked
                              ? [...(newCampaign.demographics || []), age]
                              : (newCampaign.demographics || []).filter(d => d !== age);
                            setNewCampaign({...newCampaign, demographics: updatedDemographics});
                          }}
                        />
                      ))}
                    </div>
                  </Form.Group>
                
                
              </Row>
            </div>

            {/* Campaign Details Section */}
            <div className="mb-4">
              <h5 className="mb-3 text-primary">Campaign Details</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Platforms</Form.Label>
                    <div className="platforms-selector p-3 border rounded bg-light">
                      <div className="d-grid gap-2">
                        {[
                          { id: "Instagram", icon: <FaInstagram className="me-2" />, color: "#E1306C" },
                          { id: "TikTok", icon: <FaTiktok className="me-2" />, color: "#000000" },
                          { id: "YouTube", icon: <FaYoutube className="me-2" />, color: "#FF0000" },
                          { id: "Twitter", icon: <FaTwitter className="me-2" />, color: "#1DA1F2" }
                        ].map(platform => (
                          <Button
                            key={platform.id}
                            variant={newCampaign.platforms.includes(platform.id) ? "primary" : "outline-primary"}
                            className="text-start d-flex align-items-center"
                            style={{
                              backgroundColor: newCampaign.platforms.includes(platform.id) ? platform.color : 'white',
                              borderColor: platform.color,
                              color: newCampaign.platforms.includes(platform.id) ? 'white' : platform.color
                            }}
                            onClick={() => {
                              const updatedPlatforms = newCampaign.platforms.includes(platform.id)
                                ? newCampaign.platforms.filter(p => p !== platform.id)
                                : [...newCampaign.platforms, platform.id];
                              setNewCampaign({...newCampaign, platforms: updatedPlatforms});
                            }}
                          >
                            {platform.icon} {platform.id}
                            {newCampaign.platforms.includes(platform.id) && (
                              <FaCheckCircle className="ms-auto" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <Form.Text className="text-muted mt-2">
                      Select one or more platforms for your campaign
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Campaign Budget</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>$</InputGroup.Text>
                      <Form.Control
                        type="number"
                        value={newCampaign.budget}
                        onChange={(e) => setNewCampaign({...newCampaign, budget: e.target.value})}
                        required
                        placeholder="Enter campaign budget"
                        className="py-2"
                      />
                    </InputGroup>
                    <Form.Text className="text-muted">
                      Enter your total budget for this campaign
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Target Region</Form.Label>
                    <Row>
                      <Col md={6}>
                        <Form.Select
                          value={selectedCountry}
                          onChange={(e) => {
                            setSelectedCountry(e.target.value);
                            setNewCampaign({...newCampaign, region: ''});
                          }}
                          required
                          className="mb-2 py-2"
                        >
                          <option value="">Select Country</option>
                          {Object.keys(REGIONS).map(country => (
                            <option key={country} value={country}>{country}</option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={6}>
                        <Form.Select
                          value={newCampaign.region}
                          onChange={(e) => setNewCampaign({...newCampaign, region: e.target.value})}
                          required
                          className="py-2"
                          disabled={!selectedCountry}
                        >
                          <option value="">Select Region</option>
                          {selectedCountry && REGIONS[selectedCountry].map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </Form.Select>
                      </Col>
                    </Row>
                    <Form.Text className="text-muted">
                      Select the target country and region for your campaign
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
            </div>

            {formError && (
              <Alert variant="danger" className="mt-3">
                <strong>Error:</strong> 
                {formError.includes('\n') ? (
                  <ul className="mb-0 mt-2">
                    {formError.split('\n').map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <span> {formError}</span>
                )}
              </Alert>
            )}

            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="outline-secondary" 
                className="me-2" 
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" className="me-2" />
                    Creating Campaign...
                  </>
                ) : (
                  'Create Campaign'
                )}
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