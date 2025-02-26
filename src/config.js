const config = {
  // Use the deployed backend URL
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://influencer-backend-fmh5.onrender.com'
    : 'http://localhost:8000'
};

console.log('Current environment:', process.env.NODE_ENV);
console.log('Current API URL:', config.API_URL);

export default config; 