import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

function InfluencerDetail() {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/influencers/${id}/`)
      .then((response) => response.json())
      .then((data) => setInfluencer(data))
      .catch((error) => console.error("Error fetching influencer:", error));
  }, [id]);

  if (!influencer) return <p>Loading...</p>;

  return (
    <Container>
      <Card className="shadow-sm mb-4">
        <Card.Img variant="top" src={influencer.profile_picture} alt={influencer.name} />
        <Card.Body>
          <h2>{influencer.name}</h2>
          <p><strong>Platform:</strong> {influencer.platform}</p>
          <p><strong>Niche:</strong> {influencer.niche}</p>
          <p><strong>Followers:</strong> {influencer.followers_count}</p>
          <p><strong>Social Handle:</strong> {influencer.social_media_handle}</p>
          <p><strong>Interests:</strong> {influencer.interests}</p>
          <Button variant="success" className="w-100">Book Influencer</Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default InfluencerDetail;
