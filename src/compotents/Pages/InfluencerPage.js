import React, { useEffect, useState } from "react";

function InfluencerPage() {
  const [influencers, setInfluencers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/influencers/")
      .then((response) => response.json())
      .then((data) => setInfluencers(data))
      .catch((error) => console.error("Error fetching influencers:", error));
  }, []);

  const filteredInfluencers = influencers.filter((influencer) =>
    influencer.niche.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h1 className="text-center">Influencers</h1>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search by niche..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="row">
        {filteredInfluencers.map((influencer) => (
          <div className="col-md-4 mb-4" key={influencer.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{influencer.name}</h5>
                <p className="card-text">
                  <strong>Platform:</strong> {influencer.platform}
                </p>
                <p className="card-text">
                  <strong>Niche:</strong> {influencer.niche}
                </p>
                <p className="card-text">
                  <strong>Followers:</strong> {influencer.followers_count}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InfluencerPage;
