// This is a fallback server file for Render deployment
// Using CommonJS syntax for maximum compatibility
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`[Fallback Server] Environment variables:`, {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV
});
console.log(`[Fallback Server] Using PORT: ${PORT}`);

// Serve static files from the dist/public directory
const publicPath = path.join(__dirname, 'dist', 'public');

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    server: 'fallback',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 'default'
  });
});

if (fs.existsSync(publicPath)) {
  console.log(`Serving static files from: ${publicPath}`);
  app.use(express.static(publicPath));

  // Serve index.html for all routes except /health
  app.get('*', (req, res) => {
    if (req.path === '/health') return; // Skip for health check
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  console.error(`Error: Could not find the build directory: ${publicPath}`);
  app.get('*', (req, res) => {
    if (req.path === '/health') return; // Skip for health check
    res.status(500).send('Server Error: Build directory not found. Please make sure the application is built correctly.');
  });
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fallback server running on port ${PORT}`);
});