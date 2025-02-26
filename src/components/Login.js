import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaSignInAlt, FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import config from '../config';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role || 'user');
        setIsAuthenticated(true);
        navigate('/dashboard/campaigns');
      } else {
        setError(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
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

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3 rounded-pill"
                    disabled={loading}
                  >
                    {loading ? (
                      'Signing in...'
                    ) : (
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