import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      setIsAuthenticated(true);
      navigate("/");  // Reload homepage to show dashboard
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="home-container">
      {isAuthenticated ? (
        <div>
          <h2>Welcome to the Dashboard</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>Login to Access the App</h2>
          <form onSubmit={handleLogin}>
            <input type="text" name="username" placeholder="Username" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default HomePage;
