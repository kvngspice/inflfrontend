import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [matchedInfluencers, setMatchedInfluencers] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/campaigns/${id}`)
      .then((response) => response.json())
      .then((data) => setCampaign(data))
      .catch((error) => console.error("Error fetching campaign details:", error));

    fetch(`${process.env.REACT_APP_API_URL}/api/campaigns/${id}/search-influencers/`)
      .then((response) => response.json())
      .then((data) => setMatchedInfluencers(data))
      .catch((error) => console.error("Error fetching influencers:", error));
  }, [id]);

  if (!campaign) return <p>Loading campaign details...</p>;

  return (
    <Container className="mt-4">
      <h1>{campaign.name}</h1>
      <p>{campaign.objective}</p>
      <p><strong>Platforms:</strong> {campaign.platforms?.join(", ")}</p>
      <p className="text-success">${campaign.budget}</p>
      <p><strong>Demography:</strong> {campaign.demography} | {campaign.gender}</p>
      <p><strong>Region:</strong> {campaign.region}</p>
      <p><strong>Industry:</strong> {campaign.industry}</p>

      <h2 className="mt-4">Matched Influencers</h2>
      <Row>
        {matchedInfluencers.length === 0 ? (
          <p className="text-muted">No matching influencers found.</p>
        ) : (
          matchedInfluencers.map((influencer) => (
            <Col md={4} key={influencer.id}>
              <Card className="shadow-sm mb-3">
                <Card.Body>
                  <h5>{influencer.name}</h5>
                  <p><strong>Platform:</strong> {influencer.platform}</p>
                  <p>{influencer.niche}</p>
                  <p className="text-muted">{influencer.followers_count} followers</p>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}

export default CampaignDetail;
