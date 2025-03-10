import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Tabs, Tab, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaCalendarCheck, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaFileDownload, FaInfoCircle, FaHistory } from 'react-icons/fa';
import CampaignTimeline from './CampaignTimeline';
import CampaignAssets from './CampaignAssets';
import './InfluencerCampaigns.css';

const InfluencerCampaigns = () => {
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [completedCampaigns, setCompletedCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAssetsModal, setShowAssetsModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://127.0.0.1:8000/api/influencer/bookings/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      
      const data = await response.json();
      console.log('Campaigns data:', data);
      
      // Filter campaigns by status
      setActiveCampaigns(data.filter(campaign => campaign.status === 'approved'));
      setPendingCampaigns(data.filter(campaign => campaign.status === 'pending'));
      setCompletedCampaigns(data.filter(campaign => campaign.status === 'completed'));
      
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://127.0.0.1:8000/api/influencer/campaigns/${campaignId}/accept/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept campaign');
      }
      
      // Refresh campaigns after accepting
      fetchCampaigns();
      
    } catch (error) {
      console.error('Error accepting campaign:', error);
      setError(error.message);
    }
  };

  const handleDeclineCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://127.0.0.1:8000/api/influencer/campaigns/${campaignId}/decline/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to decline campaign');
      }
      
      // Refresh campaigns after declining
      fetchCampaigns();
      
    } catch (error) {
      console.error('Error declining campaign:', error);
      setError(error.message);
    }
  };

  const viewTimeline = (campaign) => {
    setSelectedCampaign(campaign);
    setShowTimelineModal(true);
  };

  const viewAssets = (campaign) => {
    setSelectedCampaign(campaign);
    setShowAssetsModal(true);
  };

  const renderCampaignCard = (campaign, type) => {
    return (
      <Card className="campaign-card mb-3" key={campaign.id}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="mb-1">{campaign.name}</h5>
              <Badge 
                bg={
                  type === 'active' ? 'success' : 
                  type === 'pending' ? 'warning' : 'secondary'
                }
              >
                {type === 'active' ? 'Active' : 
                 type === 'pending' ? 'Pending Approval' : 'Completed'}
              </Badge>
            </div>
            <div className="text-muted">
              {type === 'active' && (
                <span>Due: {new Date(campaign.end_date).toLocaleDateString()}</span>
              )}
              {type === 'completed' && (
                <span>Completed: {new Date(campaign.completion_date).toLocaleDateString()}</span>
              )}
            </div>
          </div>
          
          <p className="mb-3">{campaign.description}</p>
          
          <div className="campaign-details mb-3">
            <div className="detail-item">
              <strong>Brand:</strong> {campaign.brand_name}
            </div>
            <div className="detail-item">
              <strong>Platform:</strong> {campaign.platform}
            </div>
            <div className="detail-item">
              <strong>Budget:</strong> ${campaign.budget}
            </div>
          </div>
          
          <div className="d-flex justify-content-between">
            <div>
              {type === 'pending' && (
                <>
                  <Button 
                    variant="success" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleAcceptCampaign(campaign.id)}
                  >
                    <FaCheckCircle className="me-1" /> Accept
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDeclineCampaign(campaign.id)}
                  >
                    <FaTimesCircle className="me-1" /> Decline
                  </Button>
                </>
              )}
            </div>
            
            <div>
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="me-2"
                onClick={() => viewTimeline(campaign)}
              >
                <FaHistory className="me-1" /> Timeline
              </Button>
              <Button 
                variant="outline-info" 
                size="sm"
                onClick={() => viewAssets(campaign)}
              >
                <FaFileDownload className="me-1" /> Assets
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading campaigns...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">My Campaigns</h2>
      
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}
      
      <Tabs defaultActiveKey="active" className="mb-4">
        <Tab 
          eventKey="active" 
          title={
            <span>
              <FaCalendarCheck className="me-2" />
              Active Campaigns
              {activeCampaigns.length > 0 && (
                <Badge bg="primary" className="ms-2">{activeCampaigns.length}</Badge>
              )}
            </span>
          }
        >
          {activeCampaigns.length === 0 ? (
            <Alert variant="info">
              You don't have any active campaigns at the moment.
            </Alert>
          ) : (
            activeCampaigns.map(campaign => renderCampaignCard(campaign, 'active'))
          )}
        </Tab>
        
        <Tab 
          eventKey="pending" 
          title={
            <span>
              <FaHourglassHalf className="me-2" />
              Pending Approval
              {pendingCampaigns.length > 0 && (
                <Badge bg="warning" className="ms-2">{pendingCampaigns.length}</Badge>
              )}
            </span>
          }
        >
          {pendingCampaigns.length === 0 ? (
            <Alert variant="info">
              You don't have any pending campaign requests.
            </Alert>
          ) : (
            pendingCampaigns.map(campaign => renderCampaignCard(campaign, 'pending'))
          )}
        </Tab>
        
        <Tab 
          eventKey="completed" 
          title={
            <span>
              <FaCheckCircle className="me-2" />
              Completed
            </span>
          }
        >
          {completedCampaigns.length === 0 ? (
            <Alert variant="info">
              You haven't completed any campaigns yet.
            </Alert>
          ) : (
            completedCampaigns.map(campaign => renderCampaignCard(campaign, 'completed'))
          )}
        </Tab>
      </Tabs>
      
      {/* Timeline Modal */}
      <Modal 
        show={showTimelineModal} 
        onHide={() => setShowTimelineModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Campaign Timeline</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCampaign && (
            <CampaignTimeline campaign={selectedCampaign} />
          )}
        </Modal.Body>
      </Modal>
      
      {/* Assets Modal */}
      <Modal 
        show={showAssetsModal} 
        onHide={() => setShowAssetsModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Campaign Assets</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCampaign && (
            <CampaignAssets campaign={selectedCampaign} />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default InfluencerCampaigns; 
 
 
 
 
 
 
 