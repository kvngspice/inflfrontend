import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, Button, Badge, Pagination, Dropdown, Modal, Collapse } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaFilter, FaSort, FaStar, FaChartLine, FaExternalLinkAlt, FaUsers } from 'react-icons/fa';
import InfluencerProfile from './InfluencerProfile';
import './InfluencerList.css';
import config from '../../config';

const InfluencerList = () => {
  const navigate = useNavigate();
  const [influencers, setInfluencers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [minFollowers, setMinFollowers] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState({
    engagementRate: '',
    location: '',
  });
  const [sortField, setSortField] = useState('followers_count');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [maxBudget, setMaxBudget] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchInfluencers();
    fetchCampaigns();
  }, [navigate]);

  const fetchInfluencers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_URL}/api/influencers/`, {
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
        throw new Error('Failed to fetch influencers');
      }

      const data = await response.json();
      setInfluencers(data);
    } catch (err) {
      console.error('Error fetching influencers:', err);
      setError('Failed to load influencers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(`${config.API_URL}/api/campaigns/`, {
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
        throw new Error('Failed to fetch campaigns');
      }

      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns. Please try again.');
    }
  };

  const getPlatformIcon = (platform) => {
    if (!platform) return null;
    switch (platform.toLowerCase()) {
      case 'instagram': return <FaInstagram className="text-danger" />;
      case 'tiktok': return <FaTiktok className="text-dark" />;
      case 'youtube': return <FaYoutube className="text-danger" />;
      case 'twitter': return <FaTwitter className="text-primary" />;
      default: return null;
    }
  };

  const getProfileImage = (imageUrl, name) => {
    console.log('Raw image URL received:', imageUrl); // Debug log

    if (!imageUrl) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200`;
    }

    // Handle both relative and absolute URLs
    const fullUrl = imageUrl.startsWith('http') 
        ? imageUrl 
        : `${config.API_URL}${imageUrl}`;
    
    console.log('Constructed image URL:', fullUrl); // Debug log
    return fullUrl;
  };

  const filterInfluencers = useCallback(() => {
    let results = [...influencers];

    // Search by name, handle, or niche
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      results = results.filter(influencer => 
        influencer.name.toLowerCase().includes(query) ||
        influencer.social_media_handle.toLowerCase().includes(query) ||
        influencer.niche.toLowerCase().includes(query)
      );
    }

    // Filter by platform
    if (selectedPlatform) {
      results = results.filter(influencer => 
        influencer.platform.toLowerCase() === selectedPlatform.toLowerCase()
      );
    }

    // Filter by minimum followers
    if (minFollowers) {
      results = results.filter(influencer => 
        influencer.followers_count >= parseInt(minFollowers)
      );
    }

    // Advanced filters
    if (advancedFilters.location) {
      results = results.filter(influencer => 
        influencer.region.toLowerCase().includes(advancedFilters.location.toLowerCase())
      );
    }

    if (advancedFilters.engagementRate) {
      const minEngagement = parseFloat(advancedFilters.engagementRate);
      results = results.filter(influencer => 
        (influencer.engagement_rate || 0) >= minEngagement
      );
    }

    // Filter by maximum budget
    if (maxBudget) {
      results = results.filter(influencer => 
        parseFloat(influencer.base_fee) <= parseFloat(maxBudget)
      );
    }

    // Sort results
    if (sortField) {
      results.sort((a, b) => {
        let aValue = a[sortField] || 0;
        let bValue = b[sortField] || 0;

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }

    return results;
  }, [influencers, searchQuery, selectedPlatform, minFollowers, advancedFilters, sortField, sortDirection, maxBudget]);

  const filteredAndSortedInfluencers = useMemo(() => {
    let filtered = filterInfluencers();
    let totalPages = Math.ceil(filtered.length / itemsPerPage);
    let currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    return { currentItems, totalPages };
  }, [filterInfluencers, itemsPerPage, currentPage]);

  const handleViewProfile = (influencer) => {
    setSelectedInfluencer(influencer);
    setShowProfile(true);
  };

  const handleBookNow = (influencer) => {
    console.log("Starting booking process for influencer:", influencer);  // Debug log
    setSelectedInfluencer(influencer);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async () => {
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
          influencer_id: selectedInfluencer.id,
          campaign_id: selectedCampaign
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to create booking');
      }

      const data = await response.json();
      setShowBookingModal(false);
      // Optionally show success message
      alert('Booking created successfully!');
      
      // Refresh the campaigns list
      await fetchCampaigns();
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to create booking. Please try again.');
    }
  };

  const renderSocialMediaLinks = (influencer) => {
    const socialLinks = [
      {
        url: influencer.instagram_url,
        icon: <FaInstagram className="text-danger" size={20} />,
        platform: 'Instagram'
      },
      {
        url: influencer.tiktok_url,
        icon: <FaTiktok className="text-dark" size={20} />,
        platform: 'TikTok'
      },
      {
        url: influencer.youtube_url,
        icon: <FaYoutube className="text-danger" size={20} />,
        platform: 'YouTube'
      },
      {
        url: influencer.twitter_url,
        icon: <FaTwitter className="text-primary" size={20} />,
        platform: 'Twitter'
      }
    ];

    return (
      <div className="d-flex gap-2 align-items-center">
        {socialLinks.map((social, index) => (
          social.url && (
            <a 
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon-link"
              title={`Visit ${social.platform} profile`}
            >
              {social.icon}
            </a>
          )
        ))}
      </div>
    );
  };

  if (loading) return <div>Loading influencers...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!influencers?.length) return <div>No influencers found.</div>;

  return (
    <div className="influencer-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2><FaUsers className="me-2" />Influencers</h2>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <div className="flex-grow-1 me-2">
          <Form.Control
            type="search"
            placeholder="Search influencers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="d-none d-lg-flex gap-2">
          <Form.Select 
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            style={{ width: '100px' }}
            className="filter-input"
          >
            <option value="">Platform</option>
            <option value="Instagram">IG</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YT</option>
            <option value="Twitter">Twitter</option>
          </Form.Select>

          <Form.Control
            type="number"
            placeholder="Followers"
            value={minFollowers}
            onChange={(e) => setMinFollowers(e.target.value)}
            style={{ width: '90px' }}
            className="filter-input"
          />

          <Form.Select
            value={advancedFilters.location}
            onChange={(e) => setAdvancedFilters(prev => ({ ...prev, location: e.target.value }))}
            style={{ width: '90px' }}
            className="filter-input"
          >
            <option value="">Region</option>
            <option value="Nigeria">NG</option>
            <option value="Kenya">KE</option>
            <option value="Ghana">GH</option>
            <option value="South Africa">SA</option>
          </Form.Select>

          <Form.Control
            type="number"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="Budget"
            style={{ width: '80px' }}
            className="filter-input"
          />
        </div>

        <Button 
          variant="outline-secondary"
          onClick={() => setShowFilters(!showFilters)}
          className="d-lg-none"
          aria-expanded={showFilters}
        >
          <FaFilter /> Filters
        </Button>
      </div>

      <div className="d-lg-none">
        <Collapse in={showFilters}>
          <div className="p-3 border rounded mb-3">
            <Form.Group className="mb-2">
              <Form.Label>Platform</Form.Label>
              <Form.Select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
              >
                <option value="">All Platforms</option>
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter">Twitter</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Minimum Followers</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter minimum followers"
                value={minFollowers}
                onChange={(e) => setMinFollowers(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Region</Form.Label>
              <Form.Select
                value={advancedFilters.location}
                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, location: e.target.value }))}
              >
                <option value="">All Regions</option>
                <option value="Nigeria">Nigeria</option>
                <option value="Kenya">Kenya</option>
                <option value="Ghana">Ghana</option>
                <option value="South Africa">South Africa</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Maximum Budget</Form.Label>
              <Form.Control
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                placeholder="Enter maximum budget"
              />
            </Form.Group>
          </div>
        </Collapse>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          Showing {filteredAndSortedInfluencers.currentItems.length} of {filteredAndSortedInfluencers.totalPages * itemsPerPage} influencers
        </div>
        <Form.Select
          style={{ width: 'auto' }}
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
        >
          <option value="9">9 per page</option>
          <option value="18">18 per page</option>
          <option value="27">27 per page</option>
        </Form.Select>
      </div>

      <Row xs={1} sm={2} lg={3} className="g-4">
        {filteredAndSortedInfluencers.currentItems.map((influencer) => (
          <Col key={influencer.id}>
            <Card className="h-100 influencer-card">
              <Card.Body>
                <div className="d-flex flex-column flex-sm-row align-items-center mb-3">
                  <img
                    src={getProfileImage(influencer.profile_picture, influencer.name)}
                    alt={influencer.name}
                    className="rounded-circle mb-2 mb-sm-0 me-sm-3"
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src);
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(influencer.name)}&size=60`;
                    }}
                  />
                  <div className="text-center text-sm-start">
                    <Card.Title className="mb-0">{influencer.name}</Card.Title>
                    <div className="text-muted">@{influencer.social_media_handle}</div>
                  </div>
                </div>

                <div className="mt-3">
                  {renderSocialMediaLinks(influencer)}
                </div>

                <div className="mb-2">
                  <Badge bg="primary" className="me-2">
                    {getPlatformIcon(influencer.platform)} {influencer.platform}
                  </Badge>
                  <Badge bg="secondary">
                    {(influencer.followers_count || 0).toLocaleString()} followers
                  </Badge>
                </div>

                <div className="metrics-grid mb-3">
                  <div className="metric">
                    <small>Engagement</small>
                    <strong>{(influencer.engagement_rate || 0).toFixed(1)}%</strong>
                  </div>
                  <div className="metric">
                    <small>Avg. Likes</small>
                    <strong>{(influencer.avg_likes || 0).toLocaleString()}</strong>
                  </div>
                  <div className="metric">
                    <small>Posts/Month</small>
                    <strong>{influencer.posting_frequency || 'N/A'}</strong>
                  </div>
                </div>

                <div className="d-flex justify-content-between">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => handleViewProfile(influencer)}
                    className="me-2"
                  >
                    View Profile
                  </Button>
                  <Button variant="success" size="sm" onClick={() => handleBookNow(influencer)}>
                    Book Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Pagination>
          {Array.from({ length: filteredAndSortedInfluencers.totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>

      <Modal
        show={showProfile}
        onHide={() => setShowProfile(false)}
        size="lg"
        centered
        dialogClassName="profile-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Influencer Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInfluencer && (
            <InfluencerProfile 
              influencerId={selectedInfluencer.id} 
              onClose={() => setShowProfile(false)}
            />
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book Influencer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Campaign</Form.Label>
              <Form.Select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                required
              >
                <option value="">Choose a campaign...</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name} (Budget: ${campaign.budget})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBookingSubmit}
            disabled={!selectedCampaign}
          >
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`