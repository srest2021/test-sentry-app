const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001; // Different port to avoid conflicts

// Add Document-Policy header middleware
app.use((req, res, next) => {
  res.set('Document-Policy', 'js-profiling');
  next();
});

// Proxy all requests to the React development server
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  onProxyRes: (proxyRes, req, res) => {
    // Ensure the Document-Policy header is set on the response
    proxyRes.headers['Document-Policy'] = 'js-profiling';
  }
}));

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📊 Document-Policy header set to: js-profiling`);
  console.log(`🔍 Sentry profiling is now enabled!`);
  console.log(`📡 Proxying to React dev server at http://localhost:3000`);
}); 