import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { FaFileImage, FaFilePdf, FaFileWord, FaFileExcel, FaFilePowerpoint, FaFileAlt, FaDownload, FaLink } from 'react-icons/fa';

const CampaignAssets = ({ campaign }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchAssets();
  }, [campaign.id]);
  
  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://127.0.0.1:8000/api/influencer/campaigns/${campaign.id}/assets/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch campaign assets');
      }
      
      const data = await response.json();
      setAssets(data);
      
    } catch (error) {
      console.error('Error fetching assets:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const getFileIcon = (fileType) => {
    switch (fileType.toLowerCase()) {
      case 'image':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="asset-icon text-primary" />;
      case 'pdf':
        return <FaFilePdf className="asset-icon text-danger" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="asset-icon text-primary" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="asset-icon text-success" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="asset-icon text-warning" />;
      default:
        return <FaFileAlt className="asset-icon text-secondary" />;
    }
  };
  
  if (loading) {
    return (
      <div className="text-center p-3">
        <Spinner animation="border" size="sm" role="status">
          <span className="visually-hidden">Loading assets...</span>
        </Spinner>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="danger">
        {error}
      </Alert>
    );
  }
  
  if (assets.length === 0) {
    return (
      <Alert variant="info">
        No assets have been provided for this campaign yet.
      </Alert>
    );
  }
  
  return (
    <div>
      <h5 className="mb-4">Campaign Assets</h5>
      
      <Row>
        {assets.map(asset => (
          <Col md={6} key={asset.id} className="mb-3">
            <div className="asset-card d-flex align-items-center">
              {getFileIcon(asset.file_type)}
              
              <div className="asset-details">
                <div className="asset-title">{asset.name}</div>
                <div className="asset-meta">
                  {asset.file_type.toUpperCase()} • {asset.size} • 
                  Added on {new Date(asset.uploaded_at).toLocaleDateString()}
                </div>
                <div className="asset-description mt-2">
                  {asset.description}
                </div>
              </div>
              
              <div className="ms-3">
                {asset.url ? (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {asset.type === 'link' ? (
                      <><FaLink className="me-1" /> Open</>
                    ) : (
                      <><FaDownload className="me-1" /> Download</>
                    )}
                  </Button>
                ) : (
                  <Button variant="outline-secondary" size="sm" disabled>
                    Not Available
                  </Button>
                )}
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CampaignAssets; 
 
 
 
 
 
 
 