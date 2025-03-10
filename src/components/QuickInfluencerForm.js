import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, Badge } from 'react-bootstrap';
import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaExternalLinkAlt, FaMoneyBillWave, FaUserPlus, FaGlobe, FaCheckCircle } from 'react-icons/fa';
import viraloop from '../components/VIRALOOP.svg';
import config from '../config';

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

const DEMOGRAPHICS = [
  "13-17",
  "18-24",
  "25-34",
  "35-44",
  "45+"
];

const QuickInfluencerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    primary_platform: '',
    social_platforms: [], // Array to store multiple platforms
    niches: [],
    country: '',
    region: '',
    bio: '',
    demography: '',
  });

  // For adding new platforms
  const [newPlatform, setNewPlatform] = useState({
    platform: '',
    followers_count: '',
    handle: '',
    url: ''
  });

  const [selectedNiche, setSelectedNiche] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const platforms = [
    'Instagram', 
    'TikTok', 
    'YouTube', 
    'Twitter', 
    'Facebook', 
    'LinkedIn', 
    'Pinterest', 
    'Snapchat',
    'Twitch'
  ];

  const niches = [
    'General',
    'Comedy',
    'Fashion', 
    'Beauty', 
    'Lifestyle', 
    'Travel', 
    'Food', 
    'Fitness', 
    'Technology', 
    'Gaming',
    'Business', 
    'Education', 
    'Entertainment', 
    'Health', 
    'Parenting', 
    'Sports', 
    'Art & Design',
    'Music',
    'Others'
  ];

  const handleAddPlatform = () => {
    if (!newPlatform.platform || !newPlatform.followers_count || !newPlatform.handle) {
      return;
    }

    setFormData({
      ...formData,
      social_platforms: [...formData.social_platforms, newPlatform]
    });

    setNewPlatform({
      platform: '',
      followers_count: '',
      handle: '',
      url: ''
    });
  };

  const handleRemovePlatform = (index) => {
    const updatedPlatforms = formData.social_platforms.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      social_platforms: updatedPlatforms
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate that at least one social platform has been added
    if (formData.social_platforms.length === 0) {
      setError('Please add at least one social media platform');
      setLoading(false);
      return;
    }
    
    try {
      // First save to database
      const dbResponse = await fetch(`${config.API_URL}/api/quick-add-influencer/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          platform: formData.social_platforms[0]?.platform || '', // Primary platform
          followers_count: parseInt(formData.social_platforms[0]?.followers_count) || 0,
          niche: formData.niches[0] || '', // Primary niche
          social_media_handle: formData.social_platforms[0]?.handle || '',
          region: formData.region,
          bio: formData.bio,
          social_platforms: formData.social_platforms,
          demography: formData.demography,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender
        })
      });

      if (!dbResponse.ok) {
        const errorData = await dbResponse.json();
        throw new Error(errorData.error || 'Failed to save to database');
      }

      // Then save to Google Sheets
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvoV5C2-QmEL-AuruC3eGcXZsC0p_yV-_6fHzKxdP8bFpxP0oJYvNnxi6O9POnvRSC/exec';
      
      const sheetsResponse = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: '',
        primary_platform: '',
        social_platforms: [],
        niches: [],
        country: '',
        region: '',
        bio: '',
        demography: ''
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message || 'Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quick-form-page">
      {/* Hero Section */}
      <div className="hero-section py-5 mb-4" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0099ff 100%)', color: 'white' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8} className="mx-auto text-center">
              <div className="mb-4 d-flex justify-content-center">
                <img 
                  src={viraloop} 
                  alt="Viraloop" 
                  style={{ width: "250px", height: "auto" }}
                />
              </div>
              <h1 className="display-5 fw-bold mb-3">Earn extra income by monetizing your social media platforms</h1>
              <p className="lead mb-4">
                <span className="badge bg-light text-primary me-2">No follower limit!</span>
                Fill the form below to connect with campaigns that match your platform & get Paid 
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-4">
        <Card className="shadow border-0 rounded-lg">
          <Card.Body className="p-4 p-md-5">
            <h2 className="text-center mb-4 fw-bold">Quick Influencer Registration</h2>
            
            {error && <Alert variant="danger">{error}</Alert>}
            {success && (
              <Alert variant="success" className="d-flex align-items-center">
                <div className="bg-success bg-opacity-25 p-2 rounded-circle me-3">
                  <FaCheckCircle className="text-success" size={24} />
                </div>
                <div>
                  <h5 className="mb-1">Registration Successful!</h5>
                  <p className="mb-0">Thank you for registering! We'll be in touch soon with campaign opportunities.</p>
                </div>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="py-2"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={formData.gender}
                      onChange={(e) => setFormData({...formData, gender: e.target.value})}
                      required
                      className="py-2"
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
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="py-2"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="py-2"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Card className="bg-light border-0 mb-4">
                <Card.Body>
                  <h5 className="mb-3">
                    <FaGlobe className="me-2 text-primary" />
                    Social Media Platforms <span className="text-danger">*</span>
                  </h5>
                  {formData.social_platforms.length === 0 && (
                    <Alert variant="warning" className="mb-3">
                      <small>Please add at least one social media platform</small>
                    </Alert>
                  )}
                  <Row>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Platform</Form.Label>
                        <Form.Select
                          value={newPlatform.platform}
                          onChange={(e) => setNewPlatform({...newPlatform, platform: e.target.value})}
                          className="py-2"
                        >
                          <option value="">Select Platform</option>
                          {platforms.map(platform => (
                            <option key={platform} value={platform}>{platform}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={2}>
                      <Form.Group>
                        <Form.Label>Followers</Form.Label>
                        <Form.Control
                          type="number"
                          value={newPlatform.followers_count}
                          onChange={(e) => setNewPlatform({...newPlatform, followers_count: e.target.value})}
                          placeholder="Number of followers"
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Handle/Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={newPlatform.handle}
                          onChange={(e) => setNewPlatform({...newPlatform, handle: e.target.value})}
                          placeholder="@username"
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Label>Profile URL</Form.Label>
                        <Form.Control
                          type="url"
                          value={newPlatform.url}
                          onChange={(e) => setNewPlatform({...newPlatform, url: e.target.value})}
                          placeholder="https://..."
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={2} className="d-flex align-items-end">
                      <Button 
                        variant="primary" 
                        onClick={handleAddPlatform}
                        className="w-100 py-2"
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>

                  {formData.social_platforms.length > 0 && (
                    <div className="mt-3">
                      {formData.social_platforms.map((platform, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center bg-white p-3 rounded mb-2 shadow-sm">
                          <div>
                            {platform.platform === 'Instagram' && <FaInstagram className="text-danger me-2" />}
                            {platform.platform === 'TikTok' && <FaTiktok className="text-dark me-2" />}
                            {platform.platform === 'YouTube' && <FaYoutube className="text-danger me-2" />}
                            {platform.platform === 'Twitter' && <FaTwitter className="text-primary me-2" />}
                            <strong>{platform.platform}</strong> - @{platform.handle} 
                            <Badge bg="primary" className="ms-2">{platform.followers_count} followers</Badge>
                            {platform.url && (
                              <a 
                                href={platform.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="ms-2 text-primary"
                              >
                                <FaExternalLinkAlt size={12} /> View Profile
                              </a>
                            )}
                          </div>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleRemovePlatform(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Country</Form.Label>
                    <Form.Select
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      required
                      className="py-2"
                    >
                      <option value="">Select Country</option>
                      {Object.keys(REGIONS).map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Region</Form.Label>
                    <Form.Select
                      value={formData.region}
                      onChange={(e) => setFormData({...formData, region: e.target.value})}
                      disabled={!formData.country}
                      required
                      className="py-2"
                    >
                      <option value="">Select Region</option>
                      {formData.country && REGIONS[formData.country]?.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Primary Audience Age Range</Form.Label>
                    <Form.Select
                      value={formData.demography}
                      onChange={(e) => setFormData({...formData, demography: e.target.value})}
                      required
                      className="py-2"
                    >
                      <option value="">Select Age Range</option>
                      {DEMOGRAPHICS.map(demo => (
                        <option key={demo} value={demo}>{demo}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Content Niche</Form.Label>
                    <Form.Select
                      value={selectedNiche}
                      onChange={(e) => {
                        setSelectedNiche(e.target.value);
                        if (e.target.value && !formData.niches.includes(e.target.value)) {
                          setFormData({
                            ...formData,
                            niches: [...formData.niches, e.target.value]
                          });
                        }
                      }}
                      className="py-2"
                    >
                      <option value="">Select Niche</option>
                      {niches.map(niche => (
                        <option key={niche} value={niche}>{niche}</option>
                      ))}
                    </Form.Select>
                    {formData.niches.length > 0 && (
                      <div className="mt-2">
                        {formData.niches.map((niche, index) => (
                          <Badge 
                            key={index} 
                            bg="primary" 
                            className="me-1 mb-1 p-2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setFormData({
                                ...formData,
                                niches: formData.niches.filter(n => n !== niche)
                              });
                            }}
                          >
                            {niche} ×
                          </Badge>
                        ))}
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  required
                  className="py-2"
                />
              </Form.Group>

              <div className="d-grid">
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="py-3"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : 'Submit Registration'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {/* Testimonials Section */}
      </Container>

      {/* Footer */}
      <div className="bg-light py-4 mt-5">
        <Container>
          <p className="text-center text-muted mb-0">
            © 2025 Influencer Platform. All rights reserved.
          </p>
        </Container>
      </div>

      <style jsx="true">{`
        .quick-form-page {
          background-color: #f8f9fa;
        }
        
        .form-control:focus, .form-select:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .btn-primary {
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .hero-section {
          position: relative;
          overflow: hidden;
        }
        
        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background-image: url('data:image/svg+xml;charset=utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"%3E%3Cpath fill="%23ffffff" fill-opacity="0.05" d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"%3E%3C/path%3E%3C/svg%3E');
          background-size: cover;
          background-position: center;
          opacity: 0.1;
        }
      `}</style>
    </div>
  );
};

export default QuickInfluencerForm; 
 
 
 
 
 
 
 