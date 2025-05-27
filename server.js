const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'https://bumpyard.commbox.io/',
  credentials: true,
}));

// Utility to forward GET requests
async function proxyGetRequest(targetUrl, req, res) {
  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': req.headers.authorization || '',
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}

// Existing endpoint
app.get('/api/commbox-stats', (req, res) => {
  const url = 'https://api.commbox.io/stats/streamsSLAExceptions';
  proxyGetRequest(url, req, res);
});

// 1. Get all managers
app.get('/api/managers', (req, res) => {
  const url = 'https://api.commbox.io/managers';
  proxyGetRequest(url, req, res);
});

// 2. Get manager stats by ID
app.get('/api/managers/:id/stats', (req, res) => {
  const managerId = req.params.id;
  const url = `https://api.commbox.io/managers/${managerId}/stats`;
  proxyGetRequest(url, req, res);
});

// 3. Get manager presence by ID
app.get('/api/managers/:id/presence', (req, res) => {
  const managerId = req.params.id;
  const url = `https://api.commbox.io/managers/${managerId}/presence`;
  proxyGetRequest(url, req, res);
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
