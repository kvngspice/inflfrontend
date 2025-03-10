import React from 'react';
import { Badge } from 'react-bootstrap';
import { FaCheckCircle, FaHourglassHalf, FaCalendarAlt, FaFileAlt, FaMoneyBillWave, FaHandshake } from 'react-icons/fa';

const CampaignTimeline = ({ campaign }) => {
  // Generate timeline events based on campaign data
  const generateTimelineEvents = () => {
    const events = [
      {
        id: 1,
        title: 'Campaign Created',
        date: campaign.created_at,
        description: `Campaign "${campaign.name}" was created by ${campaign.brand_name}`,
        icon: <FaCalendarAlt />,
        completed: true
      },
      {
        id: 2,
        title: 'Booking Request Sent',
        date: campaign.booking_date || campaign.created_at,
        description: 'You were invited to participate in this campaign',
        icon: <FaHandshake />,
        completed: true
      }
    ];
    
    // Add acceptance event if campaign is active or completed
    if (campaign.status === 'active' || campaign.status === 'completed') {
      events.push({
        id: 3,
        title: 'Campaign Accepted',
        date: campaign.acceptance_date,
        description: 'You accepted the campaign invitation',
        icon: <FaCheckCircle />,
        completed: true
      });
    }
    
    // Add content submission events if available
    if (campaign.content_submissions) {
      campaign.content_submissions.forEach((submission, index) => {
        events.push({
          id: 4 + index,
          title: `Content ${index + 1} Submitted`,
          date: submission.date,
          description: submission.description,
          icon: <FaFileAlt />,
          completed: true
        });
      });
    }
    
    // Add payment event if campaign is completed
    if (campaign.status === 'completed') {
      events.push({
        id: 10,
        title: 'Payment Processed',
        date: campaign.payment_date,
        description: `Payment of $${campaign.budget} processed`,
        icon: <FaMoneyBillWave />,
        completed: true
      });
      
      events.push({
        id: 11,
        title: 'Campaign Completed',
        date: campaign.completion_date,
        description: 'Campaign successfully completed',
        icon: <FaCheckCircle />,
        completed: true
      });
    }
    
    // Add upcoming events for active campaigns
    if (campaign.status === 'active') {
      // Add content submission deadline if not yet submitted
      if (!campaign.content_submitted) {
        events.push({
          id: 12,
          title: 'Content Submission Deadline',
          date: campaign.content_deadline,
          description: 'Deadline to submit your content',
          icon: <FaHourglassHalf />,
          completed: false
        });
      }
      
      // Add campaign end date
      events.push({
        id: 13,
        title: 'Campaign End Date',
        date: campaign.end_date,
        description: 'Campaign scheduled completion',
        icon: <FaCalendarAlt />,
        completed: false
      });
    }
    
    // Sort events by date
    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  const timelineEvents = generateTimelineEvents();
  
  return (
    <div className="timeline-container">
      <h5 className="mb-4">{campaign.name} - Timeline</h5>
      
      {timelineEvents.map(event => (
        <div 
          key={event.id} 
          className={`timeline-item ${event.completed ? 'completed' : ''}`}
        >
          <div className="d-flex justify-content-between mb-2">
            <h6 className="mb-0 d-flex align-items-center">
              <span className="me-2">{event.icon}</span>
              {event.title}
            </h6>
            <Badge bg={event.completed ? 'success' : 'warning'}>
              {event.completed ? 'Completed' : 'Upcoming'}
            </Badge>
          </div>
          <div className="timeline-date mb-1">
            {new Date(event.date).toLocaleString()}
          </div>
          <p className="mb-0">{event.description}</p>
        </div>
      ))}
    </div>
  );
};

export default CampaignTimeline; 
 
 
 
 
 
 
 