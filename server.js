// This is a fallback server file for Render deployment
// Using CommonJS syntax for maximum compatibility
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the dist/public directory
const publicPath = path.join(__dirname, 'dist', 'public');

if (fs.existsSync(publicPath)) {
  console.log(`Serving static files from: ${publicPath}`);
  app.use(express.static(publicPath));

  // Serve index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
} else {
  console.error(`Error: Could not find the build directory: ${publicPath}`);
  app.get('*', (req, res) => {
    res.status(500).send('Server Error: Build directory not found. Please make sure the application is built correctly.');
  });
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Fallback server running on port ${PORT}`);
});