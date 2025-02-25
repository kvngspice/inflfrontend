import React, { useState } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaBuilding, FaArrowRight } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6} xl={5}>
            <div className="text-center mb-4">
              <h1 className="h3 mb-3 fw-bold">Create Account</h1>
              <p className="text-muted">Join our platform and start your journey</p>
            </div>

            <Card className="shadow-sm border-0">
              <Card.Body className="p-4">
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
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

                  <Form.Group className="mb-3">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaEnvelope className="text-muted" />
                      </span>
                      <Form.Control
                        type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="border-0 border-start"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
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

                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaLock className="text-muted" />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                        className="border-0 border-start"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0">
                        <FaBuilding className="text-muted" />
                      </span>
                      <Form.Select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="border-0 border-start"
                      >
                        <option value="client">Brand/Client</option>
                        <option value="influencer">Influencer</option>
                      </Form.Select>
                    </div>
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 rounded-pill"
                    disabled={loading}
                  >
                    {loading ? (
                      'Creating Account...'
                    ) : (
                      <>
                        Create Account <FaArrowRight className="ms-2" />
                      </>
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <p className="mb-0">
                Already have an account?{' '}
                <Link to="/login" className="text-primary text-decoration-none">
                  Sign In <FaArrowRight className="ms-1" size={12} />
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>

      <style jsx>{`
        .register-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          display: flex;
          align-items: center;
        }

        .input-group-text {
          padding: 0.75rem 1rem;
        }

        .form-control, .form-select {
          padding: 0.75rem 1rem;
          background-color: #f8f9fa;
        }

        .form-control:focus, .form-select:focus {
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

export default Register; 