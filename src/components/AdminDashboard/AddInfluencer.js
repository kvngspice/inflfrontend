import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';

const AddInfluencer = () => {
  const [formData, setFormData] = useState({
    name: '',
    platform: '',
    followers_count: '',
    niche: '',
    social_media_handle: '',
    profile_picture: null,
    region: 'Nigeria',
    base_fee: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('platform', formData.platform);
    formDataToSend.append('followers_count', formData.followers_count);
    formDataToSend.append('niche', formData.niche);
    formDataToSend.append('social_media_handle', formData.social_media_handle);
    formDataToSend.append('region', formData.region || 'Nigeria');
    formDataToSend.append('base_fee', formData.base_fee || 0);
    
    if (formData.profile_picture) {
      formDataToSend.append('profile_picture', formData.profile_picture);
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/influencers/add/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add influencer');
      }

      setSuccess(true);
      resetForm();
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      platform: '',
      followers_count: '',
      niche: '',
      social_media_handle: '',
      profile_picture: null,
      region: 'Nigeria',
      base_fee: '',
    });
  };

  return (
    <Container>
      <h2>Add New Influencer</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Influencer added successfully!</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Platform</Form.Label>
          <Form.Select
            value={formData.platform}
            onChange={(e) => setFormData({...formData, platform: e.target.value})}
            required
          >
            <option value="">Select Platform</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
            <option value="YouTube">YouTube</option>
            <option value="X">X (Twitter)</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Followers Count</Form.Label>
          <Form.Control
            type="number"
            value={formData.followers_count}
            onChange={(e) => setFormData({...formData, followers_count: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Base Fee ($)</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            min="0"
            value={formData.base_fee}
            onChange={(e) => setFormData({...formData, base_fee: e.target.value})}
            required
            placeholder="Enter minimum booking fee"
          />
          <Form.Text className="text-muted">
            Minimum fee for booking this influencer
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Niche/Category</Form.Label>
          <Form.Control
            type="text"
            value={formData.niche}
            onChange={(e) => setFormData({...formData, niche: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Social Media Handle</Form.Label>
          <Form.Control
            type="text"
            value={formData.social_media_handle}
            onChange={(e) => setFormData({...formData, social_media_handle: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFormData({...formData, profile_picture: e.target.files[0]})}
            accept="image/*"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Region</Form.Label>
          <Form.Select
            value={formData.region}
            onChange={(e) => setFormData({...formData, region: e.target.value})}
            required
          >
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Kenya">Kenya</option>
            <option value="South Africa">South Africa</option>
          </Form.Select>
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Influencer'}
        </Button>
      </Form>
    </Container>
  );
};

export default AddInfluencer; 