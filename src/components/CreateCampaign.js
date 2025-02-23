import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';

const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState(false);
const navigate = useNavigate();  // Make sure to import useNavigate from react-router-dom

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await fetch('${process.env.REACT_APP_API_URL}/api/campaigns/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {  // Check if status is 2xx
            console.log('Campaign created:', data);
            // Show success message
            setSuccess(true);
            // Reset form
            setFormData({
                name: '',
                objective: '',
                platforms: [],
                budget: '',
                demography: '18-24',
                gender: 'Male',
                region: 'Nigeria',
                industry: 'General'
            });
            // Navigate to campaigns list or show success message
            navigate('/campaigns');
        } else {
            // Handle error response
            console.error('Error response:', data);
            setError(data.error || data.details || 'Failed to create campaign');
        }
    } catch (err) {
        console.error('Error creating campaign:', err);
        setError('Network error or server is not responding');
    } finally {
        setLoading(false);
    }
};

return (
    <Container>
        <h2>Create New Campaign</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">Campaign created successfully!</Alert>}
        <Form onSubmit={handleSubmit}>
            {/* ... your form fields ... */}
            <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
            >
                {loading ? 'Creating...' : 'Create Campaign'}
            </Button>
        </Form>
    </Container>
); 