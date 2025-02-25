import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Row, Col, Button, Badge, Nav, Alert } from "react-bootstrap";
import MatchedInfluencers from './components/MatchedInfluencers';

function CampaignDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [campaign, setCampaign] = useState(null);
  const [matchedInfluencers, setMatchedInfluencers] = useState([]);
  const [approvedInfluencers, setApprovedInfluencers] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCampaignAndMatches();
      fetchApprovedInfluencers();
    }
  }, [id]);

  const fetchCampaignAndMatches = async () => {
    try {
      setLoading(true);
      const campaignId = id;

      // Fetch campaign details
      const campaignResponse = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/`);
      if (!campaignResponse.ok) {
        throw new Error('Failed to fetch campaign');
      }
      const campaignData = await campaignResponse.json();
      setCampaign(campaignData);

      // Fetch matched influencers with the correct URL
      const matchesResponse = await fetch(`http://127.0.0.1:8000/api/campaigns/${campaignId}/matches/`);
      if (!matchesResponse.ok) {
        throw new Error('Failed to fetch matches');
      }
      const matchesData = await matchesResponse.json();
      console.log('Matched Influencers:', matchesData);
      setMatchedInfluencers(matchesData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load campaign details: ' + err.message);
      setLoading(false);
    }
  };

  const fetchApprovedInfluencers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/campaigns/${id}/approved-influencers/`);
      const data = await response.json();
      setApprovedInfluencers(data);
      setIsRunning(data.length > 0);
    } catch (error) {
      console.error("Error fetching approved influencers:", error);
    }
  };

  const handleBookInfluencer = async (influencer) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/bookings/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaign: id,
          influencer: influencer.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to book influencer.");
      }

      const data = await response.json();
      setBookingMessage(`✅ Successfully booked ${data.influencer_name} for this campaign!`);
      fetchApprovedInfluencers();
    } catch (error) {
      setError("Failed to book influencer");
    }
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!campaign) {
    return <Alert variant="warning">Campaign not found</Alert>;
  }

  return (
    <Container>
      <h1 className="my-4">{campaign.name} - Details</h1>

      <Card>
        <Card.Header>
          <Nav variant="tabs">
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'details'}
                onClick={() => setActiveTab('details')}
              >
                Campaign Details
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                active={activeTab === 'matches'}
                onClick={() => setActiveTab('matches')}
              >
                Matched Influencers
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {activeTab === 'details' && (
            <div>
              <p><strong>Objective:</strong> {campaign.objective}</p>
              <p><strong>Platforms:</strong> {campaign.platforms?.join(", ")}</p>
              <p><strong>Budget:</strong> ${campaign.budget}</p>
              <p><strong>Demography:</strong> {campaign.demography} | {campaign.gender}</p>
              <p><strong>Region:</strong> {campaign.region}</p>
              <p><strong>Industry:</strong> {campaign.industry}</p>

              <p>
                <strong>Status:</strong>{" "}
                <Badge bg={isRunning ? "success" : "secondary"}>
                  {isRunning ? "Running" : "Not Running"}
                </Badge>
              </p>

              <Button variant="primary" onClick={fetchCampaignAndMatches}>
                Refresh Matching Influencers
              </Button>
            </div>
          )}
          {activeTab === 'matches' && (
            <MatchedInfluencers 
              influencers={matchedInfluencers}
              onBookInfluencer={handleBookInfluencer}
              campaignBudget={campaign?.budget}
            />
          )}
        </Card.Body>
      </Card>

      {bookingMessage && (
        <Alert variant="success" className="mt-3" dismissible onClose={() => setBookingMessage("")}>
          {bookingMessage}
        </Alert>
      )}

      {approvedInfluencers.length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h2 className="h5 mb-0">Approved Influencers</h2>
          </Card.Header>
          <Card.Body>
            <Row>
              {approvedInfluencers.map((influencer) => (
                <Col md={4} key={influencer.id}>
                  <Card className="shadow-sm mb-3">
                    <Card.Body>
                      <h5>{influencer.name}</h5>
                      <p><strong>Platform:</strong> {influencer.platform}</p>
                      <p><strong>Niche:</strong> {influencer.niche}</p>
                      <p className="text-muted">{influencer.followers_count.toLocaleString()} followers</p>
                      <Badge bg={
                        influencer.status === "pending" ? "warning" :
                        influencer.status === "active" ? "primary" :
                        influencer.status === "completed" ? "success" : "secondary"
                      }>
                        {influencer.status}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default CampaignDetail;
