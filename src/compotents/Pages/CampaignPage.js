import React, { useEffect, useState } from "react";

function CampaignPage() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/campaigns/")
      .then((response) => response.json())
      .then((data) => setCampaigns(data))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Campaigns</h1>
      <div className="row">
        {campaigns.map((campaign) => (
          <div className="col-md-6 mb-4" key={campaign.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{campaign.name}</h5>
                <p className="card-text">
                  <strong>Objective:</strong> {campaign.objective}
                </p>
                <p className="card-text">
                  <strong>Budget:</strong> ${campaign.budget}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CampaignPage;
