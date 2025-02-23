import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug log

      if (response.ok && data.token) {
        // Store the token
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        
        // Update authentication state
        setIsAuthenticated(true);

        // Redirect to dashboard
        navigate('/dashboard/campaigns');
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <div className="mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">
          <FaSignInAlt className="me-2" />
          Login
        </h2>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
              placeholder="Enter your username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              placeholder="Enter your password"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            <FaSignInAlt className="me-2" />
            Login
          </Button>

          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </Form>
      </div>
    </Container>
  );
};

export default Login; 