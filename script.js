document.addEventListener("DOMContentLoaded", function () {
    let influencersData = []; // Store influencers for filtering
    const influencersList = document.getElementById("influencers-list");
    const campaignsList = document.getElementById("campaigns-list");
    const campaignForm = document.getElementById("campaign-form");

    // Fetch and display influencers
    if (influencersList) {
        fetch("http://127.0.0.1:8000/api/influencers/") // Adjust API URL if needed
            .then(response => response.json())
            .then(data => {
                influencersData = data;
                displayInfluencers(data);
            })
            .catch(error => console.error("Error fetching influencers:", error));
    }

    // Function to display influencers
    function displayInfluencers(data) {
        influencersList.innerHTML = ""; // Clear previous results
        data.forEach(influencer => {
            const div = document.createElement("div");
            div.className = "p-4 border rounded-lg shadow bg-white";
            div.innerHTML = `
                <h3 class="text-xl font-semibold">${influencer.name}</h3>
                <p>${influencer.platform} - ${influencer.niche}</p>
                <p>Followers: ${influencer.followers_count}</p>
            `;
            influencersList.appendChild(div);
        });
    }

    // Fetch and display campaigns
    if (campaignsList) {
        fetch("http://127.0.0.1:8000/api/campaigns/") // Adjust API URL if needed
            .then(response => response.json())
            .then(data => {
                displayCampaigns(data);
            })
            .catch(error => console.error("Error fetching campaigns:", error));
    }

    // Function to display campaigns
    function displayCampaigns(data) {
        campaignsList.innerHTML = ""; // Clear previous results
        data.forEach(campaign => {
            const div = document.createElement("div");
            div.className = "p-4 border rounded-lg shadow bg-white";
            div.innerHTML = `
                <h3 class="text-xl font-semibold">${campaign.name}</h3>
                <p>Objective: ${campaign.objective}</p>
                <p>Budget: $${campaign.budget}</p>
            `;
            campaignsList.appendChild(div);
        });
    }

    // Handle Campaign Form Submission
    if (campaignForm) {
        campaignForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("campaign-name").value;
            const objective = document.getElementById("campaign-objective").value;
            const budget = document.getElementById("campaign-budget").value;

            if (!name || !objective || !budget) {
                alert("All fields are required!");
                return;
            }

            const newCampaign = {
                name: name,
                objective: objective,
                budget: parseFloat(budget),
            };

            fetch("http://127.0.0.1:8000/api/campaigns/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCampaign),
            })
            .then(response => response.json())
            .then(data => {
                alert("Campaign Created Successfully!");
                displayCampaigns([...data, newCampaign]); // Update UI
                campaignForm.reset(); // Clear form
            })
            .catch(error => console.error("Error creating campaign:", error));
        });
    }
});
