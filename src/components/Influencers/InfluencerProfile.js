import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, ListGroup, Tab, Tabs } from 'react-bootstrap';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaUser, FaChartLine, FaHistory, FaExternalLinkAlt } from 'react-icons/fa';
import config from '../../config';

const InfluencerProfile = ({ influencerId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInfluencerProfile();
  }, [influencerId]);

  const fetchInfluencerProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${config.API_URL}/api/influencers/${influencerId}/profile/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      console.log('Profile data received:', data);
      console.log('Social media URLs:', {
        instagram: data.instagram_url,
        tiktok: data.tiktok_url,
        youtube: data.youtube_url,
        twitter: data.twitter_url
      });
      
      if (response.ok) {
        // Log the profile picture URL
        console.log('Profile picture URL:', data.profile_picture);
        setProfile(data);
      } else {
        throw new Error(data.error || 'Failed to fetch profile');
      }
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
      default: return null;
    }
  };

  const getProfileImage = (imageUrl, name) => {
    // If no image URL, generate one using UI Avatars
    if (!imageUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    }
    return imageUrl;
  };

  const renderSocialLinks = () => {
    const links = [];
    
    if (profile.instagram_url) {
      links.push(
        <a 
          href={profile.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-danger me-2"
          key="instagram"
          title="Instagram Profile"
        >
          <FaInstagram size={24} />
        </a>
      );
    }

    if (profile.tiktok_url) {
      links.push(
        <a 
          href={profile.tiktok_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dark me-2"
          key="tiktok"
          title="TikTok Profile"
        >
          <FaTiktok size={24} />
        </a>
      );
    }

    if (profile.youtube_url) {
      links.push(
        <a 
          href={profile.youtube_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-danger me-2"
          key="youtube"
          title="YouTube Channel"
        >
          <FaYoutube size={24} />
        </a>
      );
    }

    if (profile.twitter_url) {
      links.push(
        <a 
          href={profile.twitter_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary me-2"
          key="twitter"
          title="Twitter Profile"
        >
          <FaTwitter size={24} />
        </a>
      );
    }

    return links.length ? (
      <div className="social-links mt-3 mb-3 d-flex justify-content-center">
        {links}
      </div>
    ) : null;
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!profile) return <div>No profile data available</div>;

  return (
    <div className="influencer-profile">
      <Row>
        <Col md={4}>
          <Card>
            <Card.Img 
              variant="top" 
              src={getProfileImage(profile.profile_picture, profile.name)} 
              alt={profile.name}
              style={{ 
                height: '200px', 
                objectFit: 'cover',
                backgroundColor: '#f8f9fa' // Light background for empty states
              }}
              onError={(e) => {
                console.log('Image failed to load:', e.target.src);
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=200`;
              }}
            />
            <Card.Body>
              <div className="d-flex align-items-center mb-3">
                <h4 className="mb-0 me-2">{profile.name}</h4>
                {getPlatformIcon(profile.platform)}
              </div>
              {renderSocialLinks()}
              <Badge bg="primary" className="me-2">{profile.platform}</Badge>
              <Badge bg="info">{profile.niche}</Badge>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Tabs defaultActiveKey="overview" className="mb-3">
            <Tab eventKey="overview" title={<><FaUser /> Overview</>}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Followers:</strong> {profile.followers_count?.toLocaleString()}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Social Handle:</strong> {profile.social_media_handle}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Demographics:</strong> {profile.demography || 'Not specified'}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Interests:</strong> {profile.interests || 'Not specified'}
                </ListGroup.Item>
              </ListGroup>
            </Tab>

            <Tab eventKey="metrics" title={<><FaChartLine /> Metrics</>}>
              <Card>
                <Card.Body>
                  <h5>Performance Metrics</h5>
                  <Row>
                    <Col md={4}>
                      <div className="text-center">
                        <h6>Avg. Engagement Rate</h6>
                        <h3>{profile.engagement_rate || '0'}%</h3>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h6>Avg. Likes</h6>
                        <h3>{profile.avg_likes?.toLocaleString() || '0'}</h3>
                      </div>
                    </Col>
                    <Col md={4}>
                      <div className="text-center">
                        <h6>Avg. Comments</h6>
                        <h3>{profile.avg_comments?.toLocaleString() || '0'}</h3>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="history" title={<><FaHistory /> Campaign History</>}>
              <Card>
                <Card.Body>
                  <h5>Previous Campaigns</h5>
                  {profile.campaign_history?.length > 0 ? (
                    profile.campaign_history.map((campaign, index) => (
                      <div key={index} className="mb-3 p-3 border rounded">
                        <h6>{campaign.name}</h6>
                        <p className="mb-1">Duration: {campaign.duration}</p>
                        <p className="mb-1">Performance: {campaign.performance}</p>
                        <Badge bg={campaign.status === 'completed' ? 'success' : 'warning'}>
                          {campaign.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p>No campaign history available</p>
                  )}
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default InfluencerProfile; 