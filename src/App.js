import React, { useEffect, useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Form, Button, Nav, Alert } from "react-bootstrap";
import { FaUsers, FaBullhorn, FaTrash, FaPlus, FaCheckCircle } from "react-icons/fa";
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate} from "react-router-dom";
import CampaignDetail from "./CampaignDetail"; // Import the new component
import InfluencerDetail from "./InfluencerDetail";
import BookingsPage from "./AdminDashboard";
import LoginPage from "./LoginPage";
import InfluencerDashboard from "./influencer-dashboard/InfluencerDashboard";
import HomePage from './components/HomePage';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import InfluencerList from './components/Influencers/InfluencerList';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import Register from './components/Register';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import CampaignList from './components/Campaigns/CampaignList';
import PaymentSection from './components/PaymentSection';
import RoleBasedRoute from './components/RoleBasedRoute';
import InfluencerProfileSetup from './components/Influencer/InfluencerProfileSetup';
import InfluencerProfile from './components/Influencer/InfluencerProfile';
import ApiTest from './components/ApiTest';
import QuickInfluencerForm from './components/QuickInfluencerForm';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// Define the AdvancedFilterSection component
const AdvancedFilterSection = ({ advancedFilters, setAdvancedFilters }) => {
  return (
    <Card className="shadow-sm mb-4">
      <Card.Body>
        <h4>Advanced Filters</h4>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Engagement Rate</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Min %"
                  value={advancedFilters.engagementRate.min}
                  onChange={(e) => setAdvancedFilters(prev => ({
                    ...prev,
                    engagementRate: { ...prev.engagementRate, min: e.target.value }
                  }))}
                />
                <Form.Control
                  type="number"
                  placeholder="Max %"
                  value={advancedFilters.engagementRate.max}
                  onChange={(e) => setAdvancedFilters(prev => ({
                    ...prev,
                    engagementRate: { ...prev.engagementRate, max: e.target.value }
                  }))}
                />
              </div>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Audience Interests</Form.Label>
              <Form.Select
                multiple
                value={advancedFilters.audienceInterests}
                onChange={(e) => setAdvancedFilters(prev => ({
                  ...prev,
                  audienceInterests: [...e.target.selectedOptions].map(opt => opt.value)
                }))}
              >
                <option value="fashion">Fashion</option>
                <option value="technology">Technology</option>
                <option value="gaming">Gaming</option>
                <option value="fitness">Fitness</option>
                <option value="food">Food</option>
                <option value="travel">Travel</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Price Range</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Min $"
                  value={advancedFilters.priceRange.min}
                  onChange={(e) => setAdvancedFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, min: e.target.value }
                  }))}
                />
                <Form.Control
                  type="number"
                  placeholder="Max $"
                  value={advancedFilters.priceRange.max}
                  onChange={(e) => setAdvancedFilters(prev => ({
                    ...prev,
                    priceRange: { ...prev.priceRange, max: e.target.value }
                  }))}
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Languages</Form.Label>
              <Form.Select
                multiple
                value={advancedFilters.languages}
                onChange={(e) => setAdvancedFilters(prev => ({
                  ...prev,
                  languages: [...e.target.selectedOptions].map(opt => opt.value)
                }))}
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>Post Frequency</Form.Label>
              <Form.Select
                value={advancedFilters.postFrequency}
                onChange={(e) => setAdvancedFilters(prev => ({
                  ...prev,
                  postFrequency: e.target.value
                }))}
              >
                <option value="">Any</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Verified Accounts Only"
                checked={advancedFilters.verificationStatus}
                onChange={(e) => setAdvancedFilters(prev => ({
                  ...prev,
                  verificationStatus: e.target.checked
                }))}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

// Add this component to display campaign details with analytics
const CampaignDetailsWithAnalytics = ({ campaign, matchedInfluencers, analyticsData }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!campaign) return null;

  return (
    <div className="campaign-details">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h3>{campaign.name}</h3>
          
          <Nav variant="tabs" className="mb-3">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
              >
                Campaign Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'analytics'}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'influencers'}
                onClick={() => setActiveTab('influencers')}
              >
                Matched Influencers
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {activeTab === 'overview' && (
            <div className="campaign-overview">
              <p><strong>Objective:</strong> {campaign.objective}</p>
              <p><strong>Budget:</strong> ${campaign.budget}</p>
              <p><strong>Platforms:</strong> {campaign.platforms?.join(", ")}</p>
              <p><strong>Status:</strong> 
                <span className={campaign.active ? "text-success" : "text-danger"}>
                  {campaign.active ? " Active" : " Inactive"}
                </span>
              </p>
            </div>
          )}

          {activeTab === 'analytics' && analyticsData && (
            <div style={{ minHeight: "400px" }}>
              <AnalyticsDashboard analyticsData={analyticsData} />
            </div>
          )}

          {activeTab === 'influencers' && (
            <div className="matched-influencers">
              <h4 className="mb-3">Matched Influencers</h4>
              <Row>
                {matchedInfluencers.map((influencer) => (
                  <Col md={4} key={influencer.id}>
                    <Card className="mb-3">
                      <Card.Body>
                        <h5>{influencer.name}</h5>
                        <p><strong>Platform:</strong> {influencer.platform}</p>
                        <p><strong>Followers:</strong> {influencer.followers_count}</p>
                        <p><strong>Engagement Rate:</strong> {influencer.engagement_rate}%</p>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleBookInfluencer(influencer)}
                        >
                          Book Influencer
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [influencers, setInfluencers] = useState([]);
  const [view, setView] = useState("campaigns");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [matchedInfluencers, setMatchedInfluencers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [minFollowers, setMinFollowers] = useState("");
  const [campaignDuration, setCampaignDuration] = useState("");
  const [contentRequirements, setContentRequirements] = useState("");
  const [deliverables, setDeliverables] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    influencerId: null,
    campaignId: null,
    startDate: "",
    endDate: "",
    budget: "",
    requirements: "",
    status: "pending"
  });

  const [advancedFilters, setAdvancedFilters] = useState({
    engagementRate: { min: "", max: "" },
    audienceInterests: [],
    contentCategories: [],
    postFrequency: "",
    priceRange: { min: "", max: "" },
    languages: [],
    verificationStatus: false
  });

  // Add this analytics state
  const [analyticsData, setAnalyticsData] = useState({
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
    campaignMetrics: {
      performance: [
        { name: 'Week 1', reach: 5000, engagement: 3000, conversions: 150 },
        { name: 'Week 2', reach: 7000, engagement: 4200, conversions: 210 },
        { name: 'Week 3', reach: 9000, engagement: 5400, conversions: 270 },
      ]
    },
    conversionData: {
      roi: [
        { date: 'Jan', spend: 1000, revenue: 2000 },
        { date: 'Feb', spend: 1500, revenue: 3000 },
        { date: 'Mar', spend: 2000, revenue: 4500 },
      ]
    },
    keyMetrics: {
      'Total Reach': '21,000',
      'Avg. Engagement': '42%',
      'Total Conversions': '630',
      'ROI': '225%'
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingInfluencers, setIsLoadingInfluencers] = useState(true);
  const [influencerError, setInfluencerError] = useState(null);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  function ProtectedPage() {
    const navigate = useNavigate();

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if no token
      }
    }, []);

    return <div>Protected Content</div>;
  }

  // Campaign Form States
  const [campaignName, setCampaignName] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("");
  const [campaignBudget, setCampaignBudget] = useState("");
  const [campaignDemography, setCampaignDemography] = useState("");
  const [campaignGender, setCampaignGender] = useState("");
  const [campaignRegion, setCampaignRegion] = useState("");
  const [campaignIndustry, setCampaignIndustry] = useState("");
  const [campaignPlatforms, setCampaignPlatforms] = useState([]);

  // Filter influencers based on search and filters
  const filteredInfluencers = influencers.filter((influencer) => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          influencer.niche.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = selectedPlatform === "" || influencer.platform === selectedPlatform;

    const matchesFollowers = minFollowers === "" || influencer.followers_count >= Number(minFollowers);

    return matchesSearch && matchesPlatform && matchesFollowers;
  });

  // Influencer Form States
  const [influencerName, setInfluencerName] = useState("");
  const [influencerPlatform, setInfluencerPlatform] = useState("");
  const [influencerNiche, setInfluencerNiche] = useState("");
  const [influencerFollowers, setInfluencerFollowers] = useState("");

  // Fetch campaigns and influencers when the app loads
  useEffect(() => {
    fetchCampaigns();
    fetchInfluencers();
  }, []);

  const fetchCampaigns = () => {
    fetch("http://127.0.0.1:8000/api/campaigns/")
      .then((response) => response.json())
      .then((data) => setCampaigns(data))
      .catch((error) => console.error("Error fetching campaigns:", error));
  };

  const fetchInfluencers = async () => {
    try {
      setIsLoadingInfluencers(true);
      const response = await fetch('http://127.0.0.1:8000/api/influencers/');
      if (!response.ok) {
        throw new Error('Failed to fetch influencers');
      }
      const data = await response.json();
      setInfluencers(data);
      setInfluencerError(null);
    } catch (error) {
      console.error('Error fetching influencers:', error);
      setInfluencerError('Failed to load influencers');
    } finally {
      setIsLoadingInfluencers(false);
    }
  };

  // Add this analytics fetch function
  const fetchAnalyticsData = async (campaignId) => {
    try {
      // For now, using mock data
      // In production, uncomment the fetch call below
      /*
      const response = await fetch(`http://127.0.0.1:8000/api/analytics/dashboard/${campaignId}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      setAnalyticsData(data);
      */

      // Using mock data for testing
      setAnalyticsData({
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
        campaignMetrics: {
          performance: [
            { name: 'Week 1', reach: 5000, engagement: 3000, conversions: 150 },
            { name: 'Week 2', reach: 7000, engagement: 4200, conversions: 210 },
            { name: 'Week 3', reach: 9000, engagement: 5400, conversions: 270 },
          ]
        },
        conversionData: {
          roi: [
            { date: 'Jan', spend: 1000, revenue: 2000 },
            { date: 'Feb', spend: 1500, revenue: 3000 },
            { date: 'Mar', spend: 2000, revenue: 4500 },
          ]
        },
        keyMetrics: {
          'Total Reach': '21,000',
          'Avg. Engagement': '42%',
          'Total Conversions': '630',
          'ROI': '225%'
        }
      });
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  // Add booking function
  const handleBookInfluencer = async (influencer) => {
    if (!selectedCampaign) {
      alert("Please select a campaign first");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/bookings/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          campaign_id: selectedCampaign.id,
          influencer_id: influencer.id,
          status: "pending",
          budget: selectedCampaign.budget,
          requirements: selectedCampaign.requirements
        })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      const data = await response.json();
      alert("Booking request sent successfully!");
      
      // Refresh matched influencers list
      handleCampaignClick(selectedCampaign)({});
    } catch (error) {
      console.error("Error booking influencer:", error);
      alert("Failed to book influencer. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    window.location.href = "/"; // Redirect to HomePage after logout
  };

  // Handle Campaign Submission
  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const newCampaign = {
      name: campaignName,
      objective: campaignObjective,
      platforms: campaignPlatforms,
      budget: parseFloat(campaignBudget),
      demography: campaignDemography,
      gender: campaignGender,
      region: campaignRegion,
      industry: campaignIndustry,
      duration: campaignDuration,
      content_requirements: contentRequirements,
      deliverables: deliverables,
      target_metrics: {
        engagement_rate: minFollowers,
        followers_range: {
          min: minFollowers,
          max: minFollowers
        }
      }
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/campaigns/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(newCampaign),
      });
      
      const data = await response.json();
      console.log('Response:', data); // Debug log
      
      if (response.ok) {
      // Clear form
        setCampaignName('');
        setCampaignObjective('');
        setCampaignBudget('');
        setCampaignDemography('18-24');
        setCampaignGender('Male');
        setCampaignRegion('Nigeria');
        setCampaignIndustry('General');
        setCampaignPlatforms([]);
        setCampaignDuration('');
        setContentRequirements('');
        setDeliverables([]);
        setMinFollowers('');
        
        // Fetch updated campaigns list
        const campaignsResponse = await fetch("http://127.0.0.1:8000/api/campaigns/");
        if (campaignsResponse.ok) {
          const campaignsData = await campaignsResponse.json();
          setCampaigns(campaignsData);
        }
      
      // Show success message
      alert("Campaign created successfully!");
        
        // Reset other states
        setSelectedPlatform('');
        setSelectedCampaign(null);
        setMatchedInfluencers([]);
        setAnalyticsData({
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
          campaignMetrics: {
            performance: [
              { name: 'Week 1', reach: 5000, engagement: 3000, conversions: 150 },
              { name: 'Week 2', reach: 7000, engagement: 4200, conversions: 210 },
              { name: 'Week 3', reach: 9000, engagement: 5400, conversions: 270 },
            ]
          },
          conversionData: {
            roi: [
              { date: 'Jan', spend: 1000, revenue: 2000 },
              { date: 'Feb', spend: 1500, revenue: 3000 },
              { date: 'Mar', spend: 2000, revenue: 4500 },
            ]
          },
          keyMetrics: {
            'Total Reach': '21,000',
            'Avg. Engagement': '42%',
            'Total Conversions': '630',
            'ROI': '225%'
          }
        });
        
        // Navigate to campaigns view
        setView("campaigns");
      } else {
        // Handle error from backend
        const errorMessage = data.error || data.details || 'Failed to create campaign';
        console.error('Error from backend:', errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error or server is not responding');
    } finally {
      setIsLoading(false);
    }
  };

  // Define searchInfluencers inside App component
  const searchInfluencers = async (campaignId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/match-influencers/`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Matched influencers data:", data);
      setMatchedInfluencers(data);
    } catch (error) {
      console.error("Error fetching matched influencers:", error);
      setMatchedInfluencers([]);
    }
  };

  // Define handleCampaignClick inside App component
  const handleCampaignClick = useCallback((campaign) => {
    console.log("Campaign clicked:", campaign);
    setSelectedCampaign(campaign);
    searchInfluencers(campaign.id);
    
    // Set mock analytics data
    setAnalyticsData({
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
      campaignMetrics: {
        performance: [
          { name: 'Week 1', reach: 5000, engagement: 3000, conversions: 150 },
          { name: 'Week 2', reach: 7000, engagement: 4200, conversions: 210 },
          { name: 'Week 3', reach: 9000, engagement: 5400, conversions: 270 },
        ]
      },
      conversionData: {
        roi: [
          { date: 'Jan', spend: 1000, revenue: 2000 },
          { date: 'Feb', spend: 1500, revenue: 3000 },
          { date: 'Mar', spend: 2000, revenue: 4500 },
        ]
      },
      keyMetrics: {
        'Total Reach': '21,000',
        'Avg. Engagement': '42%',
        'Total Conversions': '630',
        'ROI': '225%'
      }
    });
  }, []);

  return (
    <BrowserRouter>
          <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route 
          path="/login" 
          element={<Login setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route path="/register" element={<Register />} />

        {/* Client/Brand routes */}
        <Route
          path="/dashboard/*"
          element={
            <RoleBasedRoute allowedRole="client">
              <DashboardLayout>
                <Routes>
                  <Route path="campaigns" element={<CampaignList />} />
                  <Route path="influencers" element={<InfluencerList />} />
                  <Route path="payments" element={<PaymentSection />} />
                </Routes>
              </DashboardLayout>
            </RoleBasedRoute>
          }
        />

        {/* Influencer routes */}
        <Route
          path="/influencer/*"
          element={
            <RoleBasedRoute allowedRole="influencer">
              <DashboardLayout>
                <Routes>
                  <Route path="dashboard" element={<InfluencerDashboard />} />
                  <Route path="profile" element={<InfluencerProfile />} />
                  <Route path="complete-profile" element={<InfluencerProfileSetup standalone={true} />} />
                </Routes>
              </DashboardLayout>
            </RoleBasedRoute>
          }
        />

        {/* New route */}
        <Route path="/api-test" element={<ApiTest />} />
        <Route path="/quick-register" element={<QuickInfluencerForm />} />
          </Routes>
    </BrowserRouter>
  );
}

export default App;