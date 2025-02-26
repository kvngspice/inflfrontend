const config = {
  API_URL: process.env.REACT_APP_API_URL || 'https://influencer-backend-fmh5.onrender.com'
};

// Add this for debugging
console.log('Current API URL:', config.API_URL);

export default config; 