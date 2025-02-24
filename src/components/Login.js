import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import config from '../config';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const loginUrl = `${config.API_URL}/api/auth/login/`;
      console.log('Attempting login to:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          // Add explicit CORS headers
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim()
        })
      });

      // Log response status for debugging
      console.log('Response status:', response.status);
      
      // Get response text first
      const responseText = await response.text();
      console.log('Response text:', responseText);

      let data;
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error('Invalid server response');
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed');
      }

      // Success path
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.role || 'user');
      setIsAuthenticated(true);
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Invalid credentials or server error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <div className="login-form mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login; 