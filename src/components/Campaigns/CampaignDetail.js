import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Chart from 'chart.js/auto';
import config from '../../config';

function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Fetch campaign details
    fetch(`${config.API_URL}/api/campaigns/${id}/`)
      .then((response) => response.json())
      .then((data) => setCampaign(data))
      .catch((error) => console.error("Error fetching campaign:", error));

    // Fetch analytics data
    fetch(`${config.API_URL}/api/campaigns/${id}/analytics/`)
      .then((response) => response.json())
      .then((data) => setAnalytics(data))
      .catch((error) => console.error("Error fetching analytics:", error));
  }, [id]);

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

  if (!campaign || !analytics) {
    return (
      <Container>
        <div>Loading campaign details...</div>
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