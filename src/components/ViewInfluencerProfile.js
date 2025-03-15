import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';
import config from '../config';

const ViewInfluencerProfile = ({ influencerId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log(`Fetching profile for influencer ID: ${influencerId} from ${config.API_URL}/api/influencers/${influencerId}/profile/`);
        
        const response = await fetch(`${config.API_URL}/api/influencers/${influencerId}/profile/`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error response (${response.status}):`, errorText);
          throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Profile data received:', data);
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Failed to load influencer profile');
      } finally {
        setLoading(false);
      }
    };

    if (influencerId) {
      fetchProfile();
    }
  }, [influencerId]);

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
    if (!imageUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    }
    
    // Handle different URL formats
    if (imageUrl.startsWith('/media/')) {
      return `${config.API_URL}${imageUrl}`;
    }
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    return `${config.API_URL}/media/${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!profile) {
    return <Alert variant="warning">Profile not found</Alert>;
  }

  return (
    <Card>
      <Card.Body>
        <Row>
          <Col md={4} className="text-center">
            <img
              src={getProfileImage(profile.profile_picture, profile.name)}
              alt={profile.name}
              className="rounded-circle mb-3"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              onError={(e) => {
                console.log('Profile image failed to load:', e.target.src);
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&size=150`;
              }}
            />
          </Col>
          <Col md={8}>
            <h3>{profile.name}</h3>
            <div className="d-flex align-items-center mb-2">
              {getPlatformIcon(profile.platform)}
              <Badge bg="primary" className="ms-2">{profile.platform}</Badge>
            </div>
            <p><strong>Niche:</strong> {profile.niche}</p>
            <p><strong>Followers:</strong> {profile.followers_count?.toLocaleString()}</p>
            <p><strong>Social Media:</strong> {profile.social_media_handle}</p>
            {profile.interests && (
              <div>
                <strong>Interests:</strong>
                <p>{profile.interests}</p>
              </div>
            )}
            {profile.demography && (
              <div>
                <strong>Target Audience:</strong>
                <p>{profile.demography}</p>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ViewInfluencerProfile; 