import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ListGroup, Spinner, Alert, Button, Tabs, Tab } from 'react-bootstrap';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaUser, FaMapMarkerAlt, FaTag, FaUsers, FaExternalLinkAlt, FaChartLine, FaBookmark, FaPercentage, FaEye } from 'react-icons/fa';

const ViewInfluencerProfile = ({ influencerId, onClose, onBookNow }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    fetchInfluencerProfile();
  }, [influencerId]);

  const fetchInfluencerProfile = async () => {
    try {
      console.log('Fetching profile for influencer:', influencerId);
      setLoading(true);
      
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://127.0.0.1:8000/api/influencers/${influencerId}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Profile data received:', data);
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'instagram': return <FaInstagram className="text-danger" />;
      case 'tiktok': return <FaTiktok className="text-dark" />;
      case 'youtube': return <FaYoutube className="text-danger" />;
      case 'twitter': return <FaTwitter className="text-primary" />;
      default: return <FaUser />;
    }
  };

  const getProfileImage = (imageUrl, name) => {
    if (!imageUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
    }
    
    // Handle different URL formats
    if (imageUrl.startsWith('/media/')) {
      return `http://127.0.0.1:8000${imageUrl}`;
    }

    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }

    return `http://127.0.0.1:8000/media/${imageUrl}`;
  };

  const renderSocialLinks = () => {
    if (!profile) return null;
    
    const links = [];
    
    if (profile.instagram_url) {
      links.push(
        <a 
          href={profile.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link instagram"
          key="instagram"
        >
          <FaInstagram size={20} /> Instagram
        </a>
      );
    }

    if (profile.tiktok_url) {
      links.push(
        <a 
          href={profile.tiktok_url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link tiktok"
          key="tiktok"
        >
          <FaTiktok size={20} /> TikTok
        </a>
      );
    }

    if (profile.youtube_url) {
      links.push(
        <a 
          href={profile.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link youtube"
          key="youtube"
        >
          <FaYoutube size={20} /> YouTube
        </a>
      );
    }

    if (profile.twitter_url) {
      links.push(
        <a 
          href={profile.twitter_url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-link twitter"
          key="twitter"
        >
          <FaTwitter size={20} /> Twitter
        </a>
      );
    }

    return links.length > 0 ? (
      <div className="social-links-container">
        {links}
      </div>
    ) : (
      <p className="text-muted">No social media links available</p>
    );
  };

  const calculateTotalFollowers = () => {
    if (!profile) return 0;
    
    let total = parseInt(profile.followers_count) || 0;
    
    if (profile.social_platforms && Array.isArray(profile.social_platforms)) {
      profile.social_platforms.forEach(platform => {
        total += parseInt(platform.followers_count) || 0;
      });
    }
    
    return total;
  };

  const handleBookNow = () => {
    if (onBookNow && profile) {
      onBookNow(profile);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error Loading Profile</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={onClose}>Close</Button>
      </Alert>
    );
  }

  if (!profile) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Profile Not Found</Alert.Heading>
        <p>The requested influencer profile could not be found.</p>
        <Button variant="outline-warning" onClick={onClose}>Close</Button>
      </Alert>
    );
  }

  return (
    <div className="influencer-profile-view">
      <Row>
        <Col md={4}>
          <Card className="profile-card mb-4">
            <div className="profile-image-container">
              <img 
                src={getProfileImage(profile.profile_picture, profile.name)} 
                alt={profile.name}
                className="profile-image"
                onError={(e) => {
                  console.log('Image failed to load:', e.target.src);
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=200`;
                }}
              />
            </div>
            <Card.Body className="text-center">
              <h3 className="mb-1">{profile.name}</h3>
              <p className="text-muted mb-2">@{profile.social_media_handle || 'username'}</p>
              
              <div className="d-flex justify-content-center mb-3">
                <Badge bg="primary" className="me-2 p-2">
                  {getPlatformIcon(profile.platform)} {profile.platform}
                </Badge>
                <Badge bg="secondary" className="p-2">
                  <FaUsers className="me-1" /> {profile.followers_count?.toLocaleString()} followers
                </Badge>
              </div>
              
              {profile.region && (
                <p className="mb-2">
                  <FaMapMarkerAlt className="me-1 text-danger" /> {profile.region}
                </p>
              )}
              
              {renderSocialLinks()}
              
              <Button 
                variant="success" 
                className="w-100 mt-3"
                onClick={handleBookNow}
              >
                <FaBookmark className="me-2" /> Book Now
              </Button>
            </Card.Body>
          </Card>
          
          {profile.base_fee && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Booking Information</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <span>Base Fee:</span>
                  <span className="fw-bold">${parseFloat(profile.base_fee).toLocaleString()}</span>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
        
        <Col md={8}>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="about" title={<><FaUser className="me-1" /> About</>}>
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">About</h5>
                  {profile.bio ? (
                    <p>{profile.bio}</p>
                  ) : (
                    <p className="text-muted">No bio available</p>
                  )}
                  
                  {profile.interests && (
                    <div className="mt-3">
                      <h6>Interests</h6>
                      <div>
                        {profile.interests.split(',').map((interest, index) => (
                          <Badge 
                            bg="light" 
                            text="dark" 
                            className="me-2 mb-2 p-2" 
                            key={index}
                          >
                            <FaTag className="me-1" /> {interest.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Content & Audience</h5>
                  <Row>
                    <Col md={6}>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <strong>Niche:</strong> {profile.niche}
                        </ListGroup.Item>
                        {profile.demography && (
                          <ListGroup.Item>
                            <strong>Audience Age:</strong> {profile.demography}
                          </ListGroup.Item>
                        )}
                        {profile.engagement_rate && (
                          <ListGroup.Item>
                            <strong>Engagement Rate:</strong> {profile.engagement_rate}%
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                    </Col>
                    <Col md={6}>
                      {profile.content_categories && (
                        <div>
                          <h6>Content Categories</h6>
                          <div>
                            {profile.content_categories.split(',').map((category, index) => (
                              <Badge 
                                bg="info" 
                                className="me-2 mb-2" 
                                key={index}
                              >
                                {category.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="analytics" title={<><FaChartLine className="me-1" /> Analytics</>}>
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Audience Overview</h5>
                  <Row>
                    <Col md={4} className="mb-3">
                      <div className="analytics-metric">
                        <div className="analytics-icon">
                          <FaUsers />
                        </div>
                        <div className="analytics-value">
                          <h3>{calculateTotalFollowers().toLocaleString()}</h3>
                          <p>Total Followers</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="analytics-metric">
                        <div className="analytics-icon engagement">
                          <FaPercentage />
                        </div>
                        <div className="analytics-value">
                          <h3>{profile.engagement_rate || '0'}%</h3>
                          <p>Engagement Rate</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className="mb-3">
                      <div className="analytics-metric">
                        <div className="analytics-icon impressions">
                          <FaEye />
                        </div>
                        <div className="analytics-value">
                          <h3>{(calculateTotalFollowers() * 1.5).toLocaleString()}</h3>
                          <p>Est. Impressions</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="mb-3">Followers by Platform</h5>
                  <div className="platform-followers">
                    <div className="platform-metric">
                      <div className="platform-icon">
                        {getPlatformIcon(profile.platform)}
                      </div>
                      <div className="platform-details">
                        <div className="platform-name">{profile.platform}</div>
                        <div className="platform-count">{parseInt(profile.followers_count).toLocaleString()} followers</div>
                      </div>
                      <div className="platform-percentage">
                        {Math.round((parseInt(profile.followers_count) / calculateTotalFollowers()) * 100)}%
                      </div>
                    </div>
                    
                    {profile.social_platforms && profile.social_platforms.map((platform, index) => (
                      <div className="platform-metric" key={index}>
                        <div className="platform-icon">
                          {getPlatformIcon(platform.platform)}
                        </div>
                        <div className="platform-details">
                          <div className="platform-name">{platform.platform}</div>
                          <div className="platform-count">{parseInt(platform.followers_count).toLocaleString()} followers</div>
                        </div>
                        <div className="platform-percentage">
                          {Math.round((parseInt(platform.followers_count) / calculateTotalFollowers()) * 100)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
              
              <Card>
                <Card.Body>
                  <h5 className="mb-3">Audience Demographics</h5>
                  <Row>
                    <Col md={6}>
                      <h6>Age Distribution</h6>
                      <div className="demographic-bars">
                        {profile.demography && (
                          <div className="demographic-bar-container">
                            <div className="demographic-label">{profile.demography}</div>
                            <div className="demographic-bar-wrapper">
                              <div className="demographic-bar" style={{ width: '75%' }}></div>
                            </div>
                            <div className="demographic-value">75%</div>
                          </div>
                        )}
                        <div className="demographic-bar-container">
                          <div className="demographic-label">Other Ages</div>
                          <div className="demographic-bar-wrapper">
                            <div className="demographic-bar" style={{ width: '25%' }}></div>
                          </div>
                          <div className="demographic-value">25%</div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <h6>Gender Distribution</h6>
                      <div className="demographic-bars">
                        <div className="demographic-bar-container">
                          <div className="demographic-label">Female</div>
                          <div className="demographic-bar-wrapper">
                            <div className="demographic-bar female" style={{ width: '65%' }}></div>
                          </div>
                          <div className="demographic-value">65%</div>
                        </div>
                        <div className="demographic-bar-container">
                          <div className="demographic-label">Male</div>
                          <div className="demographic-bar-wrapper">
                            <div className="demographic-bar male" style={{ width: '35%' }}></div>
                          </div>
                          <div className="demographic-value">35%</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
            
            <Tab eventKey="platforms" title="Social Platforms">
              {profile.social_platforms && profile.social_platforms.length > 0 ? (
                <Card>
                  <Card.Body>
                    <h5 className="mb-3">Additional Platforms</h5>
                    <ListGroup>
                      {profile.social_platforms.map((platform, index) => (
                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="me-2">{getPlatformIcon(platform.platform)}</span>
                            <strong>{platform.platform}</strong>
                            {platform.handle && <span className="ms-2 text-muted">@{platform.handle}</span>}
                          </div>
                          <div className="d-flex align-items-center">
                            <Badge bg="secondary" className="me-3">
                              {parseInt(platform.followers_count).toLocaleString()} followers
                            </Badge>
                            {platform.url && (
                              <a 
                                href={platform.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-primary"
                              >
                                <FaExternalLinkAlt className="me-1" /> Visit
                              </a>
                            )}
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              ) : (
                <Alert variant="info">No additional social platforms available</Alert>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
      
      <div className="text-center mt-4">
        <Button variant="secondary" onClick={onClose}>
          Close Profile
        </Button>
      </div>
      
      <style jsx>{`
        .influencer-profile-view {
          padding: 1rem;
        }
        
        .profile-card {
          border-radius: 10px;
          overflow: hidden;
        }
        
        .profile-image-container {
          height: 200px;
          overflow: hidden;
          position: relative;
          background-color: #f8f9fa;
        }
        
        .profile-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .social-links-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }
        
        .social-link {
          display: inline-flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 20px;
          text-decoration: none;
          color: white;
          font-size: 0.9rem;
          transition: transform 0.2s, opacity 0.2s;
        }
        
        .social-link:hover {
          transform: translateY(-2px);
          opacity: 0.9;
        }
        
        .social-link svg {
          margin-right: 6px;
        }
        
        .instagram {
          background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
        }
        
        .tiktok {
          background: #000;
        }
        
        .youtube {
          background: #FF0000;
        }
        
        .twitter {
          background: #1DA1F2;
        }
        
        .analytics-metric {
          display: flex;
          align-items: center;
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 15px;
          height: 100%;
        }
        
        .analytics-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #0d6efd;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          margin-right: 15px;
        }
        
        .analytics-icon.engagement {
          background-color: #198754;
        }
        
        .analytics-icon.impressions {
          background-color: #6f42c1;
        }
        
        .analytics-value h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        
        .analytics-value p {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }
        
        .platform-followers {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .platform-metric {
          display: flex;
          align-items: center;
          padding: 10px;
          border-radius: 8px;
          background-color: #f8f9fa;
        }
        
        .platform-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          margin-right: 15px;
        }
        
        .platform-details {
          flex: 1;
        }
        
        .platform-name {
          font-weight: 600;
        }
        
        .platform-count {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .platform-percentage {
          font-weight: 600;
          font-size: 1.1rem;
          color: #0d6efd;
        }
        
        .demographic-bars {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 15px;
        }
        
        .demographic-bar-container {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .demographic-label {
          width: 80px;
          font-size: 0.9rem;
        }
        
        .demographic-bar-wrapper {
          flex: 1;
          height: 10px;
          background-color: #e9ecef;
          border-radius: 5px;
          overflow: hidden;
          margin: 0 10px;
        }
        
        .demographic-bar {
          height: 100%;
          background-color: #0d6efd;
          border-radius: 5px;
        }
        
        .demographic-bar.female {
          background-color: #d63384;
        }
        
        .demographic-bar.male {
          background-color: #0dcaf0;
        }
        
        .demographic-value {
          width: 40px;
          text-align: right;
          font-size: 0.9rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ViewInfluencerProfile; 
 
 
 
 
 
 
 