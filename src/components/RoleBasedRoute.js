import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to={userRole === 'influencer' ? '/influencer/dashboard' : '/dashboard/campaigns'} />;
  }

  return children;
};

export default RoleBasedRoute; 