import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Spinner, Alert } from 'react-bootstrap';

const InfluencerProfile = ({ influencerId, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/influencers/${influencerId}/profile/`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load influencer profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [influencerId]);

  const getProfileImage = (imageUrl, name) => {
    console.log('Profile image URL:', imageUrl); // Debug log

    if (!imageUrl) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200`;
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
            <Badge bg="primary" className="mb-2">{profile.platform}</Badge>
            <p><strong>Niche:</strong> {profile.niche}</p>
            <p><strong>Followers:</strong> {profile.followers_count.toLocaleString()}</p>
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

export default InfluencerProfile; 