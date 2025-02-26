import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import config from '../../config';

function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [campaignRes, analyticsRes] = await Promise.all([
          fetch(`${config.API_URL}/api/campaigns/${id}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          }),
          fetch(`${config.API_URL}/api/campaigns/${id}/analytics/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          })
        ]);

        if (!campaignRes.ok || !analyticsRes.ok) {
          if (campaignRes.status === 401 || analyticsRes.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch campaign data');
        }

        const [campaignData, analyticsData] = await Promise.all([
          campaignRes.json(),
          analyticsRes.json()
        ]);

        setCampaign(campaignData);
        setAnalytics(analyticsData);
      } catch (err) {
        console.error('Error fetching campaign data:', err);
        setError('Failed to load campaign data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (analytics && chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: analytics.dates,
          datasets: [{
            label: 'Engagement Rate',
            data: analytics.engagementRates,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Campaign Engagement Over Time'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Engagement Rate (%)'
              }
            }
          }
        }
      });
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [analytics]);

  if (loading) {
    return (
      <Container>
        <div>Loading campaign details...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1>{campaign.name}</h1>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3>Campaign Overview</h3>
              <p>Objective: {campaign.objective}</p>
              <p>Budget: ${campaign.budget}</p>
              <p>Region: {campaign.region}</p>
              <p>Total Reach: {analytics.totalReach}</p>
              <p>Total Engagements: {analytics.totalEngagements}</p>
              <p>ROI: {analytics.roi}%</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body>
              <h3>Engagement Analytics</h3>
              <canvas ref={chartRef}></canvas>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <h3>Platform Performance</h3>
              <div className="d-flex flex-wrap justify-content-around">
                {analytics.platformData.map((platform, index) => (
                  <div key={index} className="text-center p-3">
                    <h5>{platform.platform}</h5>
                    <p>Engagement Rate: {platform.engagementRate}%</p>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CampaignDetail;