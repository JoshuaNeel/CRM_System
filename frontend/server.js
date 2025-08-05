const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4173;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Handle client-side routing by serving index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Frontend server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
}); 