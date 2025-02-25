import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Card, Button, Modal, Form, Spinner } from "react-bootstrap";

const InfluencerDetail = () => {
  const { id } = useParams();
  const [influencer, setInfluencer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // ✅ Booking modal state

  // Booking Form States
  const [campaignName, setCampaignName] = useState("");
  const [aboutCampaign, setAboutCampaign] = useState(""); // ✅ New Field
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/influencers/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch influencer details.");
        }
        return response.json();
      })
      .then((data) => {
        setInfluencer(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching influencer details:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    const bookingData = {
      influencer_id: id,
      campaign_name: campaignName,
      about_campaign: aboutCampaign, // ✅ New Field
      budget: budget,
      date: date,
    };

    fetch("http://127.0.0.1:8000/api/bookings/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Booking Successful!"); // ✅ Success Message
        setShowModal(false);
        setCampaignName("");
        setAboutCampaign(""); // ✅ Reset Field
        setBudget("");
        setDate("");
      })
      .catch((error) => {
        console.error("Error booking influencer:", error);
        alert("Booking Failed! Try again.");
      });
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading influencer details...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <Container>
      <Card className="shadow-sm mt-4">
        <Card.Img
          variant="top"
          src={influencer?.profile_picture || "https://via.placeholder.com/300"}
          alt={influencer?.name || "Influencer"}
        />
        <Card.Body>
          <h2>{influencer?.name}</h2>
          <p><strong>Platform:</strong> {influencer?.platform}</p>
          <p><strong>Niche:</strong> {influencer?.niche}</p>
          <p><strong>Followers:</strong> {influencer?.followers_count?.toLocaleString()}</p>
          <p><strong>Social Media Handle:</strong> {influencer?.social_handle || "N/A"}</p>
          <p><strong>Interests:</strong> {influencer?.interests || "Not specified"}</p>

          {/* ✅ Book Influencer Button */}
          <Button variant="success" onClick={() => setShowModal(true)}>
            Book Influencer
          </Button>
        </Card.Body>
      </Card>

      {/* ✅ Booking Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Book {influencer?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleBookingSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Campaign Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Campaign Name"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                required
              />
            </Form.Group>

            {/* ✅ New "About Campaign" Field */}
            <Form.Group className="mb-3">
              <Form.Label>About Campaign</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Describe the campaign..."
                value={aboutCampaign}
                onChange={(e) => setAboutCampaign(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Booking Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Confirm Booking
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default InfluencerDetail;
