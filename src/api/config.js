const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'https://influencer-backend-fmh5.onrender.com/api'
    : 'http://localhost:8000/api';

export const apiConfig = {
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // Add the Authorization header in the API calls when needed
    }
};

// Helper function to handle API errors
export const handleApiError = (error) => {
    console.error('API Error:', error);
    if (error.response) {
        // Server responded with error
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        return error.response.data.error || 'An error occurred';
    } else if (error.request) {
        // Request was made but no response
        console.error('No response received');
        return 'No response from server';
    } else {
        // Error in request setup
        console.error('Request error:', error.message);
        return 'Error setting up request';
    }
};

// Helper function to get auth header
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_BASE_URL; 