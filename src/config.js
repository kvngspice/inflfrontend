const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000'
};

console.log('Current API URL:', config.API_URL);

export default config; 