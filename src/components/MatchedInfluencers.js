import React, { useState } from 'react';
import { Row, Col, Card, Button, Badge, Modal } from 'react-bootstrap';
import PropTypes from 'prop-types';

const MatchedInfluencers = ({ influencers, onBookInfluencer, campaignBudget }) => {
  const [showBudgetWarning, setShowBudgetWarning] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);

  const handleBookClick = (influencer) => {
    console.log('Budget check:', {
      baseFee: parseFloat(influencer.base_fee),
      campaignBudget: parseFloat(campaignBudget)
    });

    if (parseFloat(influencer.base_fee) > parseFloat(campaignBudget)) {
      setSelectedInfluencer(influencer);
      setShowBudgetWarning(true);
    } else {
      onBookInfluencer(influencer);
    }
  };

  const handleConfirmBooking = () => {
    setShowBudgetWarning(false);
    onBookInfluencer(selectedInfluencer);
  };

  console.log('MatchedInfluencers props:', { influencers }); // Debug log

  if (!influencers) {
    return (
      <div className="text-center p-5">
        <h5 className="text-muted">Loading influencers...</h5>
      </div>
    );
  }

  if (influencers.length === 0) {
    return (
      <div className="text-center p-5">
        <h5 className="text-muted">No matched influencers found</h5>
        <p>Try adjusting your campaign criteria to find more matches</p>
      </div>
    );
  }

  return (
    <div className="matched-influencers">
      <h4 className="mb-4">Matched Influencers</h4>
      <Row>
        {influencers.map((influencer) => (
          <Col md={4} key={influencer.id} className="mb-4">
            <Card className="h-100 shadow-sm hover-effect">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={influencer.profile_picture || 'https://via.placeholder.com/50'}
                    alt={influencer.name}
                    className="rounded-circle me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                  <div>
                    <h5 className="mb-1">{influencer.name}</h5>
                    <Badge bg="primary">{influencer.platform}</Badge>
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Followers:</span>
                    <span className="fw-bold">{influencer.followers_count.toLocaleString()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Engagement Rate:</span>
                    <span className="fw-bold">{influencer.engagement_rate}%</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Content Category:</span>
                    <span className="fw-bold">{influencer.content_category}</span>
                  </div>
                </div>

                <div className="mb-3">
                  {influencer.tags?.map((tag, index) => (
                    <Badge key={index} bg="light" text="dark" className="me-1 mb-1">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Base Fee:</span>
                    <span className="fw-bold">
                      ${parseFloat(influencer.base_fee).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  className="w-100"
                  onClick={() => handleBookClick(influencer)}
                >
                  Book Influencer
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Budget Warning Modal */}
      <Modal show={showBudgetWarning} onHide={() => setShowBudgetWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Budget Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            This influencer's base fee (${selectedInfluencer?.base_fee}) is above your campaign budget (${campaignBudget}).
          </p>
          <p>Would you like to proceed with booking anyway?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBudgetWarning(false)}>
            Don't Book
          </Button>
          <Button variant="primary" onClick={handleConfirmBooking}>
            Book Anyway
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

MatchedInfluencers.propTypes = {
  influencers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      platform: PropTypes.string.isRequired,
      followers_count: PropTypes.number.isRequired,
      engagement_rate: PropTypes.number.isRequired,
      content_category: PropTypes.string,
      profile_picture: PropTypes.string,
      base_fee: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string)
    })
  ).isRequired,
  onBookInfluencer: PropTypes.func.isRequired,
  campaignBudget: PropTypes.number.isRequired
};

export default MatchedInfluencers; 