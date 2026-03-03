// Import Express framework for building REST APIs
const express = require('express');

// Create Express app instance
const app = express();

// Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ============ CORS SETUP ============
// Allow frontend (different origin) to communicate with backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// ============ ROUTES ============
// Welcome endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API' });
});

// Health check endpoint - verify server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ============ START SERVER ============
// Listen on specified port and log confirmation
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
