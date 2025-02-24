import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';
import config from '../../config';

const InfluencerProfile = ({ influencerId }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`${config.API_URL}/api/influencers/${influencerId}/profile`, {
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
        setProfile(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load influencer profile');
      } finally {
        setLoading(false);
      }
    };

    if (influencerId) {
      fetchProfile();
    }
  }, [influencerId]);

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
              src={profile.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`}
              alt={profile.name}
              className="rounded-circle mb-3"
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />
            <h4>{profile.name}</h4>
            <p className="text-muted">@{profile.social_media_handle}</p>
          </Col>
          <Col md={8}>
            <div className="mb-4">
              <h5>Platform & Stats</h5>
              <Badge bg="primary" className="me-2">
                {profile.platform}
              </Badge>
              <Badge bg="secondary" className="me-2">
                {profile.followers_count?.toLocaleString()} followers
              </Badge>
              <Badge bg="info">
                {profile.engagement_rate}% engagement
              </Badge>
            </div>

            <div className="mb-4">
              <h5>Social Media Links</h5>
              <div className="d-flex gap-3">
                {profile.instagram_url && (
                  <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={24} className="text-danger" />
                  </a>
                )}
                {profile.tiktok_url && (
                  <a href={profile.tiktok_url} target="_blank" rel="noopener noreferrer">
                    <FaTiktok size={24} />
                  </a>
                )}
                {profile.youtube_url && (
                  <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer">
                    <FaYoutube size={24} className="text-danger" />
                  </a>
                )}
                {profile.twitter_url && (
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                    <FaTwitter size={24} className="text-primary" />
                  </a>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h5>About</h5>
              <p>{profile.bio || 'No bio available'}</p>
            </div>

            <div>
              <h5>Content Categories</h5>
              <div className="d-flex flex-wrap gap-2">
                {profile.content_categories?.map((category, index) => (
                  <Badge key={index} bg="secondary">{category}</Badge>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default InfluencerProfile; 