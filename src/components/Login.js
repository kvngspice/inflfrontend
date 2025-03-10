import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import config from '../config';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'client'  // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle specific error for role mismatch
        if (response.status === 403) {
          throw new Error(data.error || 'You cannot log in with this role. Please select the correct role.');
        }
        throw new Error(data.error || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);
        setIsAuthenticated(true);
        
        // Redirect based on role
        if (data.role === 'influencer') {
          navigate('/influencer/dashboard');
        } else {
          navigate('/dashboard/campaigns');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-4">
              <h1 className="h3 mb-3 fw-bold">Welcome Back!</h1>
              <p className="text-muted">Sign in to continue to your dashboard</p>
            </div>

            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaUser className="text-muted" />
                      </span>
                      <Form.Control
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        required
                        className="border-0 border-start"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaLock className="text-muted" />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        className="border-0 border-start"
                      />
                    </div>
                  </Form.Group>

                  {/* Add role toggle */}
                  <div className="mb-4 text-center">
                    <ToggleButtonGroup
                      type="radio"
                      name="role"
                      value={formData.role}
                      onChange={(value) => setFormData({...formData, role: value})}
                      className="w-100"
                    >
                      <ToggleButton
                        id="client-role"
                        value="client"
                        variant={formData.role === 'client' ? 'primary' : 'outline-primary'}
                        className="w-50"
                      >
                        Client/Brand
                      </ToggleButton>
                      <ToggleButton
                        id="influencer-role"
                        value="influencer"
                        variant={formData.role === 'influencer' ? 'primary' : 'outline-primary'}
                        className="w-50"
                      >
                        Influencer
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </div>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 rounded-pill"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : (
                      <>
                        Sign In <FaArrowRight className="ms-2" />
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="mb-0">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary text-decoration-none">
                  Create Account <FaArrowRight className="ms-1" size={12} />
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
        }

        .input-group-text {
          padding: 0.75rem 1rem;
        }

        .form-control {
          padding: 0.75rem 1rem;
          background-color: #f8f9fa;
        }

        .form-control:focus {
          box-shadow: none;
          border-color: #primary;
        }

        .btn-primary {
          padding: 0.75rem 1.5rem;
          transition: transform 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default Login; 