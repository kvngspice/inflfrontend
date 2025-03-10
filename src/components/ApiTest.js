import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert } from 'react-bootstrap';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const runTests = async () => {
    setLoading(true);
    setTestResults([]);
    
    // Test 1: Basic API connectivity
    try {
      const response = await fetch('http://127.0.0.1:8000/api/test/');
      const data = await response.json();
      setTestResults(prev => [...prev, {
        name: 'Basic API Test',
        success: true,
        message: 'Successfully connected to API',
        data
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        name: 'Basic API Test',
        success: false,
        message: `Failed: ${error.message}`
      }]);
    }
    
    // Test 2: Authentication
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/test-auth/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTestResults(prev => [...prev, {
        name: 'Authentication Test',
        success: response.ok,
        message: response.ok ? 'Authentication successful' : 'Authentication failed',
        data
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        name: 'Authentication Test',
        success: false,
        message: `Failed: ${error.message}`
      }]);
    }
    
    // Test 3: Profile API
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/api/influencers/my-profile/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setTestResults(prev => [...prev, {
        name: 'Profile API Test',
        success: response.ok,
        message: response.ok ? 'Successfully fetched profile' : 'Failed to fetch profile',
        data
      }]);
    } catch (error) {
      setTestResults(prev => [...prev, {
        name: 'Profile API Test',
        success: false,
        message: `Failed: ${error.message}`
      }]);
    }
    
    setLoading(false);
  };
  
  return (
    <Container className="py-4">
      <h2>API Connectivity Test</h2>
      <Button 
        variant="primary" 
        onClick={runTests} 
        disabled={loading}
        className="mb-4"
      >
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </Button>
      
      {testResults.map((test, index) => (
        <Card key={index} className="mb-3" border={test.success ? 'success' : 'danger'}>
          <Card.Header as="h5">{test.name}</Card.Header>
          <Card.Body>
            <Alert variant={test.success ? 'success' : 'danger'}>
              {test.message}
            </Alert>
            {test.data && (
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(test.data, null, 2)}
              </pre>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default ApiTest; 