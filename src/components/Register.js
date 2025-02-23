import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' // or 'influencer'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>I am a:</Form.Label>
          <Form.Select
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
          >
            <option value="client">Brand/Client</option>
            <option value="influencer">Influencer</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>

        <p className="mt-3">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Form>
    </Container>
  );
};

export default Register; 