const config = {
  API_URL: process.env.REACT_APP_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000'
};

// Add this for debugging
console.log('Current API URL:', config.API_URL);

export default config; 