import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Row, Col, Card, Form, Button, Badge, Pagination, Dropdown, Modal, Collapse } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaFilter, FaSort, FaStar, FaChartLine, FaExternalLinkAlt, FaUsers } from 'react-icons/fa';
import InfluencerProfile from './InfluencerProfile';
import './InfluencerList.css';
import config from '../../config';

const InfluencerList = () => {
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchInfluencers();
    fetchCampaigns();
  }, []);

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
      const response = await fetch(`${config.API_URL}/api/campaigns/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCampaigns(data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns');
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
    if (!imageUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    }
    return imageUrl;
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
  }, [influencers, searchQuery, selectedPlatform, minFollowers, advancedFilters, sortField, sortDirection]);

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

      setShowBookingModal(false);
      alert('Booking created successfully!');
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

      <div className="filters-section mb-4">
        <Row className="g-3">
          <Col xs={12} md={6} lg={3}>
            <Form.Control
              type="text"
              placeholder="Search by name, handle, or niche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Form.Select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option value="">All Platforms</option>
              <option value="X">X (Twitter)</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
            </Form.Select>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Form.Control
              type="number"
              placeholder="Min followers"
              value={minFollowers}
              onChange={(e) => setMinFollowers(e.target.value)}
            />
          </Col>
          <Col xs={12} md={6} lg={3}>
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
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xs={12} md={6} lg={4}>
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" className="w-100">
                <FaSort className="me-2" />Sort By
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => { setSortField('followers_count'); setSortDirection('desc'); }}>
                  Followers (High to Low)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortField('engagement_rate'); setSortDirection('desc'); }}>
                  Engagement Rate (High to Low)
                </Dropdown.Item>
                <Dropdown.Item onClick={() => { setSortField('name'); setSortDirection('asc'); }}>
                  Name (A-Z)
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
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
          {selectedInfluencer && (
            <>
              <h5>{selectedInfluencer.name}</h5>
              <p>Select Campaign:</p>
              <Form.Select 
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                required
              >
                <option value="">Select a campaign</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.name} - {campaign.industry} ({campaign.budget})
                  </option>
                ))}
              </Form.Select>
              {campaigns.length === 0 && (
                <p className="text-muted mt-2">No campaigns available. Please create a campaign first.</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBookingSubmit}
            disabled={!selectedCampaign || campaigns.length === 0}
          >
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`        .influencer-list {
          padding: 15px;
        }

        .filters-section {
          position: sticky;
          top: 0;
          background: white;
          padding: 15px;
          z-index: 100;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .influencer-card {
          transition: transform 0.2s;
        }

        .influencer-card:hover {
          transform: translateY(-5px);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 10px;
        }

        @media (max-width: 576px) {
          .influencer-list {
            padding: 10px;
          }

          .filters-section {
            padding: 10px;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .social-icon-link {
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .social-icon-link:hover {
          background-color: rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default InfluencerList; 
