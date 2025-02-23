import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import PropTypes from 'prop-types';

const AnalyticsDashboard = ({ analyticsData }) => {
  if (!analyticsData) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Calculate percentage changes for metrics
  const calculateChange = (data, key) => {
    if (!data || data.length < 2) return 0;
    const lastValue = data[data.length - 1][key];
    const previousValue = data[data.length - 2][key];
    return ((lastValue - previousValue) / previousValue) * 100;
  };

  return (
    <Container fluid>
      <Row className="mb-4">
        {Object.entries(analyticsData.keyMetrics || {}).map(([key, value], index) => {
          const change = calculateChange(
            analyticsData.campaignMetrics?.performance,
            key.toLowerCase().includes('reach') ? 'reach' : 'engagement'
          );
          
          return (
            <Col md={3} key={index}>
              <Card className="text-center h-100 shadow-sm">
                <Card.Body>
                  <h6 className="text-muted text-uppercase mb-3">{key}</h6>
                  <h3 className="text-primary mb-2">{value}</h3>
                  {change !== 0 && (
                    <Badge bg={change > 0 ? 'success' : 'danger'} className="mt-2">
                      {change > 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
                    </Badge>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Campaign Performance</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={analyticsData.campaignMetrics?.performance || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="reach"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Engagement Metrics</h5>
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={analyticsData.engagementStats?.timeline || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="likes"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

AnalyticsDashboard.propTypes = {
  analyticsData: PropTypes.shape({
    keyMetrics: PropTypes.object,
    campaignMetrics: PropTypes.shape({
      performance: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        reach: PropTypes.number,
        engagement: PropTypes.number,
      }))
    }),
    engagementStats: PropTypes.shape({
      timeline: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string,
        likes: PropTypes.number,
        comments: PropTypes.number,
      }))
    })
  }).isRequired
};

export default React.memo(AnalyticsDashboard);