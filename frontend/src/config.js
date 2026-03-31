// Centralized API configuration
// In development (npm start): connects directly to the backend at localhost:5001
// In production (npm run build): uses relative URLs since backend serves the frontend
const API_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '');

export default API_URL;

