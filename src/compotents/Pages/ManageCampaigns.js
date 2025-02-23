import React, { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/campaigns/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => setCampaigns(data))
      .catch((error) => console.error("Error fetching campaigns:", error));
  }, []);

  return (
    <Container className="mt-5">
      <h2>Manage Campaigns</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign.id}>
              <td>{campaign.id}</td>
              <td>{campaign.name}</td>
              <td>${campaign.budget}</td>
              <td>{campaign.active ? "Active" : "Inactive"}</td>
              <td>
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageCampaigns;
