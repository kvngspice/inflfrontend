import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Image, Badge, ListGroup } from 'react-bootstrap';
import { FaUser, FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaTimes, FaPlus, FaFacebook, FaLinkedin, FaPinterest, FaSnapchat, FaTwitch, FaExternalLinkAlt } from 'react-icons/fa';

const DEMOGRAPHICS = [
  "13-17",
  "18-24",
  "25-34",
  "35-44",
  "45+"
];

const platformMapping = {
  'Twitter/X': 'Twitter',
  'X': 'Twitter'
};

const InfluencerProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    primary_platform: '',
    niches: [],
    social_platforms: [],
    profile_picture: null,
    region: '',
    interests: '',
    bio: '',
    engagement_rate: '',
    content_categories: '',
    languages: '',
    collaboration_preference: '',
    pricing_info: '',
    base_fee: '',
    demography: '',
  });
  
  const [newPlatform, setNewPlatform] = useState({
    platform: '',
    followers_count: '',
    handle: '',
    url: ''
  });
  
  const [selectedNiche, setSelectedNiche] = useState('');
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const platforms = [
    'Instagram', 
    'TikTok', 
    'YouTube', 
    'Twitter', 
    'Twitter/X',
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

  const regions = [
    'Lagos', 
    'Abuja', 
    'Port Harcourt', 
    'Ibadan', 
    'Kano', 
    'Enugu', 
    'Kaduna', 
    'Benin City',
    'Calabar', 
    'Warri', 
    'Owerri', 
    'Jos', 
    'Uyo', 
    'Abeokuta', 
    'Onitsha',
    'Other'
  ];

  const collaborationPreferences = [
    'Sponsored Posts',
    'Brand Ambassadorship',
    'Product Reviews',
    'Content Creation',
    'Event Appearances',
    'Affiliate Marketing',
    'Giveaways',
    'All of the above'
  ];

  const platformIcons = {
    'Instagram': <FaInstagram />,
    'TikTok': <FaTiktok />,
    'YouTube': <FaYoutube />,
    'Twitter': <FaTwitter />,
    'Twitter/X': <FaTwitter />,
    'Facebook': <FaFacebook />,
    'LinkedIn': <FaLinkedin />,
    'Pinterest': <FaPinterest />,
    'Snapchat': <FaSnapchat />,
    'Twitch': <FaTwitch />
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchProfileData();
      } catch (error) {
        console.error("Error in initial data load:", error);
        
        // Try to load from localStorage as fallback
        const persistedData = loadPersistedData();
        if (persistedData) {
          setFormData(persistedData);
          setOriginalData(JSON.stringify(persistedData));
          setError("Using locally saved data. Some information may be outdated.");
        }
      }
    };
    
    loadData();
  }, []);

  const fetchProfileData = async () => {
    try {
      console.log("Fetching profile data...");
      const token = localStorage.getItem('token');
      console.log("Token exists:", !!token);
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      try {
        const testResponse = await fetch('http://127.0.0.1:8000/api/test-auth/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log("Authentication test successful:", testData);
        } else {
          console.error("Authentication test failed");
        }
      } catch (testError) {
        console.error("Error testing authentication:", testError);
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/influencers/my-profile/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch profile data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Profile data received:", data);
      
      let nichesArray = [];
      if (data.niche) {
        if (typeof data.niche === 'string') {
          if (data.niche.startsWith('[') && data.niche.endsWith(']')) {
            try {
              nichesArray = JSON.parse(data.niche);
            } catch (e) {
              nichesArray = data.niche.split(',').map(item => item.trim());
            }
          } else {
            nichesArray = [data.niche];
          }
        } else if (Array.isArray(data.niche)) {
          nichesArray = data.niche;
        }
      }
      
      let socialPlatforms = [];
      
      if (data.platform) {
        socialPlatforms.push({
          platform: data.platform,
          followers_count: data.followers_count || 0,
          handle: data.social_media_handle || '',
          url: data[`${data.platform.toLowerCase()}_url`] || ''
        });
      }
      
      if (data.social_platforms) {
        try {
          const parsedPlatforms = typeof data.social_platforms === 'string' 
            ? JSON.parse(data.social_platforms) 
            : data.social_platforms;
          
          if (Array.isArray(parsedPlatforms)) {
            parsedPlatforms.forEach(platform => {
              if (!socialPlatforms.some(p => p.platform === platform.platform)) {
                socialPlatforms.push(platform);
              }
            });
          }
        } catch (e) {
          console.error("Error parsing social platforms:", e);
        }
      }
      
      platforms.forEach(platform => {
        const urlKey = `${platform.toLowerCase().replace('/', '')}_url`;
        if (data[urlKey] && !socialPlatforms.some(p => p.platform === platform)) {
          socialPlatforms.push({
            platform: platform,
            followers_count: 0,
            handle: '',
            url: data[urlKey]
          });
        }
      });
      
      const formattedData = {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || '',
        primary_platform: data.platform || '',
        niches: nichesArray,
        social_platforms: socialPlatforms,
        region: data.region || '',
        interests: data.interests || '',
        bio: data.bio || '',
        engagement_rate: data.engagement_rate || '',
        content_categories: data.content_categories || '',
        languages: data.languages || '',
        collaboration_preference: data.collaboration_preference || '',
        pricing_info: data.pricing_info || '',
        base_fee: data.base_fee || '',
        demography: data.demography || '',
      };
      
      if (data.profile_picture) {
        formattedData.profile_picture = data.profile_picture;
      }
      
      console.log("Formatted data for form:", formattedData);
      
      setFormData(formattedData);
      setOriginalData(JSON.stringify(formattedData));
      setIsDirty(false);
      
      if (data.profile_picture) {
        setProfilePicturePreview(data.profile_picture);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      
      if (error.message.includes('Failed to fetch')) {
        setError('Network error: Could not connect to the server. Please check your internet connection or try again later.');
      } else {
        setError(`Failed to load profile data: ${error.message}`);
      }
      
      const username = localStorage.getItem('username');
      if (username) {
        setFormData(prevData => ({
          ...prevData,
          name: username
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const persistFormData = (data) => {
    try {
      // Don't save the profile_picture as it's a File object and can't be serialized
      const dataToSave = { ...data };
      if (dataToSave.profile_picture instanceof File) {
        delete dataToSave.profile_picture;
      }
      
      localStorage.setItem('influencerProfileData', JSON.stringify(dataToSave));
      console.log("Form data persisted to localStorage");
    } catch (e) {
      console.error("Error persisting form data:", e);
    }
  };

  const loadPersistedData = () => {
    try {
      const savedData = localStorage.getItem('influencerProfileData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Loaded persisted data:", parsedData);
        return parsedData;
      }
    } catch (e) {
      console.error("Error loading persisted data:", e);
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(updatedFormData);
    persistFormData(updatedFormData);
    
    const currentData = JSON.stringify(updatedFormData);
    setIsDirty(currentData !== originalData);
  };

  const formatUrl = (url) => {
    if (!url) return '';
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    
    return url;
  };

  const handlePlatformChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'url') {
      setNewPlatform({
        ...newPlatform,
        [name]: formatUrl(value)
      });
    } else {
      setNewPlatform({
        ...newPlatform,
        [name]: value
      });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profile_picture: file
      });
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNiche = () => {
    if (selectedNiche && !formData.niches.includes(selectedNiche)) {
      setFormData({
        ...formData,
        niches: [...formData.niches, selectedNiche]
      });
      setSelectedNiche('');
    }
  };

  const handleRemoveNiche = (nicheToRemove) => {
    setFormData({
      ...formData,
      niches: formData.niches.filter(niche => niche !== nicheToRemove)
    });
  };

  const handleAddPlatform = () => {
    if (!newPlatform.platform) {
      return;
    }
    
    // Check if the platform already exists
    const platformExists = formData.social_platforms.some(
      p => p.platform === newPlatform.platform
    );
    
    if (platformExists) {
      alert(`${newPlatform.platform} is already added.`);
      return;
    }
    
    // Map Twitter/X to Twitter for backend compatibility
    const platformToSave = {
      ...newPlatform,
      platform: platformMapping[newPlatform.platform] || newPlatform.platform
    };
    
    // Add the new platform
    setFormData({
      ...formData,
      social_platforms: [...formData.social_platforms, platformToSave]
    });
    
    // Reset the form
    setNewPlatform({
      platform: '',
      followers_count: '',
      handle: '',
      url: ''
    });
  };

  const handleRemovePlatform = (platformToRemove) => {
    setFormData({
      ...formData,
      social_platforms: formData.social_platforms.filter(p => p.platform !== platformToRemove)
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    
    try {
      const formDataToSend = new FormData();
      
      // Process social platforms to ensure Twitter/X is mapped correctly
      const processedSocialPlatforms = formData.social_platforms.map(platform => {
        return {
          ...platform,
          platform: platformMapping[platform.platform] || platform.platform
        };
      });
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'social_platforms') {
          formDataToSend.append('social_platforms', JSON.stringify(processedSocialPlatforms));
        } else if (key === 'niches') {
          formDataToSend.append('niches', JSON.stringify(formData.niches));
        } else if (key === 'profile_picture' && formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] !== null && formData[key] !== undefined) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Rest of the function remains the same...
      
      const response = await fetch('http://127.0.0.1:8000/api/influencers/profile/update/', {
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
      
      const data = await response.json();
      console.log('Profile updated successfully:', data);
      console.log('Saved social platforms:', data.social_platforms);
      setSuccess(true);
      scrollToTop();
      
      // Clear persisted data since we've successfully saved to the server
      localStorage.removeItem('influencerProfileData');
      
      await fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(`Failed to update profile: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to discard your changes?')) {
      try {
        // Try to parse the original data
        if (originalData) {
          const parsedData = JSON.parse(originalData);
          setFormData(parsedData);
          setIsDirty(false);
        } else {
          // If no original data, fetch from server
          fetchProfileData();
        }
      } catch (e) {
        console.error("Error resetting form:", e);
        // Fallback to fetching from server
        fetchProfileData();
      }
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <Container className="py-4">
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card className="shadow-sm">
          <Card.Header className="bg-primary text-white">
            <h3 className="mb-0">My Profile</h3>
          </Card.Header>
          <Card.Body>
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert variant="success" className="mb-4">
                <Alert.Heading>Profile Updated Successfully!</Alert.Heading>
                <p>Your profile changes have been saved. They will be visible to brands immediately.</p>
              </Alert>
            )}
            
            {isDirty && (
              <Alert variant="warning" className="mb-4">
                <Alert.Heading>Unsaved Changes</Alert.Heading>
                <p>You have made changes to your profile that haven't been saved yet. Click "Save Changes" to update your profile.</p>
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Row className="mb-4">
                <Col md={3} className="text-center">
                  <div className="position-relative mb-3">
                    {profilePicturePreview ? (
                      <Image 
                        src={profilePicturePreview} 
                        roundedCircle 
                        className="profile-picture"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="bg-light d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: '150px', height: '150px', margin: '0 auto' }}
                      >
                        <FaUser size={60} className="text-secondary" />
                      </div>
                    )}
                  </div>
                  <Form.Group controlId="profile_picture">
                    <Form.Label className="btn btn-outline-primary">
                      Change Profile Picture
                      <Form.Control 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </Form.Label>
                  </Form.Group>
                </Col>
                
                <Col md={9}>
                  <h4 className="mb-3">Personal Information</h4>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="name">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="gender">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6} className="mb-3">
                      <Form.Group controlId="phone">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>
              
              <hr className="my-4" />
              
              <h4 className="mb-4">Social Media Platforms</h4>
              
              {formData.social_platforms.length > 0 && (
                <div className="mb-4">
                  <ListGroup>
                    {formData.social_platforms.map((platform, index) => (
                      <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <span className="me-3 fs-4">
                            {platformIcons[platform.platform] || <FaUser />}
                          </span>
                          <div>
                            <strong className="d-block">
                              {platform.platform === 'Twitter' ? 'Twitter/X' : platform.platform}
                            </strong>
                            {platform.handle && <div className="text-muted">@{platform.handle}</div>}
                            {platform.url && (
                              <a 
                                href={platform.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-decoration-none"
                              >
                                <small>
                                  <FaExternalLinkAlt className="me-1" />
                                  {platform.url}
                                </small>
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <Badge bg="primary" className="me-3 p-2">
                            {parseInt(platform.followers_count).toLocaleString()} followers
                          </Badge>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleRemovePlatform(platform.platform)}
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
              
              <Card className="mb-4 bg-light">
                <Card.Body>
                  <h5 className="mb-3">Add Social Media Platform</h5>
                  <Row>
                    <Col md={3} className="mb-3">
                      <Form.Group controlId="new_platform">
                        <Form.Label>Platform</Form.Label>
                        <Form.Select
                          name="platform"
                          value={newPlatform.platform}
                          onChange={handlePlatformChange}
                        >
                          <option value="">Select Platform</option>
                          {platforms.map(platform => (
                            <option 
                              key={platform} 
                              value={platform}
                              disabled={formData.social_platforms.some(p => p.platform === platform)}
                            >
                              {platform}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={3} className="mb-3">
                      <Form.Group controlId="new_followers_count">
                        <Form.Label>Followers Count</Form.Label>
                        <Form.Control
                          type="number"
                          name="followers_count"
                          value={newPlatform.followers_count}
                          onChange={handlePlatformChange}
                          placeholder="e.g. 10000"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={3} className="mb-3">
                      <Form.Group controlId="new_handle">
                        <Form.Label>Handle/Username</Form.Label>
                        <Form.Control
                          type="text"
                          name="handle"
                          value={newPlatform.handle}
                          onChange={handlePlatformChange}
                          placeholder="e.g. username"
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={3} className="mb-3">
                      <Form.Group controlId="new_url">
                        <Form.Label>Profile URL</Form.Label>
                        <Form.Control
                          type="url"
                          name="url"
                          value={newPlatform.url}
                          onChange={handlePlatformChange}
                          placeholder="https://..."
                          pattern="https?://.+"
                          title="Please enter a valid URL starting with http:// or https://"
                        />
                        <Form.Text className="text-muted">
                          Include the full URL (e.g., https://instagram.com/username)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="primary" 
                      onClick={handleAddPlatform}
                      disabled={!newPlatform.platform || !newPlatform.followers_count}
                    >
                      <FaPlus className="me-2" /> Add Platform
                    </Button>
                  </div>
                </Card.Body>
              </Card>
              
              <h4 className="mb-4">Content Information</h4>
              
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="niches">
                    <Form.Label>Content Niches</Form.Label>
                    <div className="mb-2">
                      {formData.niches.map(niche => (
                        <Badge 
                          bg="primary" 
                          className="me-2 mb-2 p-2" 
                          key={niche}
                        >
                          {niche}
                          <FaTimes 
                            className="ms-2" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleRemoveNiche(niche)}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="d-flex">
                      <Form.Select
                        value={selectedNiche}
                        onChange={(e) => setSelectedNiche(e.target.value)}
                        className="me-2"
                      >
                        <option value="">Select Niche</option>
                        {niches.map(niche => (
                          <option 
                            key={niche} 
                            value={niche}
                            disabled={formData.niches.includes(niche)}
                          >
                            {niche}
                          </option>
                        ))}
                      </Form.Select>
                      <Button 
                        variant="outline-primary" 
                        onClick={handleAddNiche}
                        disabled={!selectedNiche || formData.niches.includes(selectedNiche)}
                      >
                        Add
                      </Button>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="engagement_rate">
                    <Form.Label>Average Engagement Rate (%)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="engagement_rate"
                      value={formData.engagement_rate}
                      onChange={handleChange}
                      placeholder="e.g. 3.5"
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Group controlId="demography">
                    <Form.Label>Primary Audience Age Range</Form.Label>
                    <Form.Select
                      name="demography"
                      value={formData.demography}
                      onChange={handleChange}
                    >
                      <option value="">Select Age Range</option>
                      {DEMOGRAPHICS.map(demo => (
                        <option key={demo} value={demo}>{demo}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="interests">
                    <Form.Label>Personal Interests (comma separated)</Form.Label>
                    <Form.Control
                      type="text"
                      name="interests"
                      value={formData.interests}
                      onChange={handleChange}
                      placeholder="e.g. Fashion, Travel, Food"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="region">
                    <Form.Label>Region</Form.Label>
                    <Form.Select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                    >
                      <option value="">Select Region</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Group controlId="content_categories">
                    <Form.Label>Content Categories (comma separated)</Form.Label>
                    <Form.Control
                      type="text"
                      name="content_categories"
                      value={formData.content_categories}
                      onChange={handleChange}
                      placeholder="e.g. Tutorials, Reviews, Vlogs"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="bio">
                    <Form.Label>Bio</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell brands about yourself..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <hr className="my-4" />
              
              <h4 className="mb-4">Collaboration Details</h4>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="base_fee">
                    <Form.Label>Base Fee ($)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      min="0"
                      name="base_fee"
                      value={formData.base_fee}
                      onChange={handleChange}
                      placeholder="e.g. 100.00"
                    />
                    <Form.Text className="text-muted">
                      Minimum fee for booking your services
                    </Form.Text>
                  </Form.Group>
                </Col>
                
                <Col md={6} className="mb-3">
                  <Form.Group controlId="collaboration_preference">
                    <Form.Label>Collaboration Preference</Form.Label>
                    <Form.Select
                      name="collaboration_preference"
                      value={formData.collaboration_preference}
                      onChange={handleChange}
                    >
                      <option value="">Select Preference</option>
                      {collaborationPreferences.map(pref => (
                        <option key={pref} value={pref}>{pref}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group controlId="languages">
                    <Form.Label>Languages (comma separated)</Form.Label>
                    <Form.Control
                      type="text"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder="e.g. English, Yoruba, Igbo"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group controlId="pricing_info">
                    <Form.Label>Pricing Information</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="pricing_info"
                      value={formData.pricing_info}
                      onChange={handleChange}
                      placeholder="Describe your pricing structure for different types of content..."
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <div className="d-flex justify-content-between mt-4">
                <Button 
                  variant="outline-secondary" 
                  onClick={handleReset}
                  disabled={saving}
                >
                  Discard Changes
                </Button>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  size="lg"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Saving Changes...
                    </>
                  ) : 'Save Changes'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default InfluencerProfile; 