import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const CampaignAnalytics = ({ analytics }) => {
  if (!analytics) return <div>Loading analytics...</div>;

  const engagementChartData = {
    labels: analytics.dates || [],
    datasets: [{
      label: 'Engagement Rate',
      data: analytics.engagementRates || [],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  const platformChartData = {
    labels: analytics.platformData?.map(p => p.platform) || [],
    datasets: [{
      label: 'Platform Performance',
      data: analytics.platformData?.map(p => p.engagementRate) || [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)'
      ]
    }]
  };

  return (
    <div className="campaign-analytics">
      <h3 className="mb-4">Campaign Performance</h3>
      
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4>{analytics.totalReach?.toLocaleString()}</h4>
              <p className="text-muted mb-0">Total Reach</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4>{analytics.totalEngagements?.toLocaleString()}</h4>
              <p className="text-muted mb-0">Total Engagements</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4>{(analytics.averageEngagementRate * 100).toFixed(1)}%</h4>
              <p className="text-muted mb-0">Avg. Engagement Rate</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h4>${analytics.roi?.toFixed(2)}</h4>
              <p className="text-muted mb-0">ROI</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Engagement Trend</Card.Title>
              <Line data={engagementChartData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Platform Performance</Card.Title>
              <Doughnut data={platformChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CampaignAnalytics; 