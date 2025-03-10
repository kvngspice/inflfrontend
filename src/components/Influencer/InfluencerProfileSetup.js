import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaInstagram, FaTiktok, FaYoutube, FaTwitter } from 'react-icons/fa';
import config from '../../config';

const InfluencerProfileSetup = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    platform: 'Instagram',
    niche: '',
    followers_count: '',
    profile_picture: null,
    social_media_handle: '',
    region: 'Nigeria',
    interests: '',
    bio: '',
    instagram_url: '',
    tiktok_url: '',
    youtube_url: '',
    twitter_url: '',
  });
  
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_picture: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formDataToSend = new FormData();
      
      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      console.log('Submitting profile to:', `${config.API_URL}/api/influencers/profile/setup/`);
      
      const response = await fetch(`${config.API_URL}/api/influencers/profile/setup/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      
      setSuccess(true);
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <h2>Complete Your Profile</h2>
            <p className="text-muted">Let brands know about you and increase your chances of getting booked</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">Profile updated successfully!</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Primary Platform</Form.Label>
                  <Form.Select
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                    <option value="X">X (Twitter)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Followers Count</Form.Label>
                  <Form.Control
                    type="number"
                    name="followers_count"
                    value={formData.followers_count}
                    onChange={handleChange}
                    required
                    placeholder="Number of followers"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Niche/Category</Form.Label>
                  <Form.Select
                    name="niche"
                    value={formData.niche}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select your niche</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Technology">Technology</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>Social Media Handle</Form.Label>
                  <Form.Control
                    type="text"
                    name="social_media_handle"
                    value={formData.social_media_handle}
                    onChange={handleChange}
                    placeholder="@yourusername"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <div className="d-flex align-items-center">
                {profilePicturePreview && (
                  <div className="me-3">
                    <img 
                      src={profilePicturePreview} 
                      alt="Profile Preview" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} 
                    />
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell brands about yourself"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Interests (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="e.g. Fashion, Travel, Food"
                required
              />
            </Form.Group>
            
            <h5 className="mt-4 mb-3">Connect Your Social Networks</h5>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    <FaInstagram className="me-2" /> Instagram URL
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    placeholder="https://instagram.com/yourusername"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    <FaTiktok className="me-2" /> TikTok URL
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="tiktok_url"
                    value={formData.tiktok_url}
                    onChange={handleChange}
                    placeholder="https://tiktok.com/@yourusername"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    <FaYoutube className="me-2" /> YouTube URL
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="youtube_url"
                    value={formData.youtube_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/c/yourchannel"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label>
                    <FaTwitter className="me-2" /> X (Twitter) URL
                  </Form.Label>
                  <Form.Control
                    type="url"
                    name="twitter_url"
                    value={formData.twitter_url}
                    onChange={handleChange}
                    placeholder="https://x.com/yourusername"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-grid mt-4">
              <Button 
                variant="primary" 
                type="submit" 
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Updating Profile...
                  </>
                ) : 'Complete Profile'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InfluencerProfileSetup; 