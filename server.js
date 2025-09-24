const express = require('express');
const path = require('path');
const sustainableTips = require('./data/tips');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Set view engine to serve HTML files
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'public'));

// Routes

// Home page - displays all tips
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get all tips
app.get('/api/tips', (req, res) => {
  res.json(sustainableTips);
});

// API endpoint to get tips by category
app.get('/api/tips/category/:category', (req, res) => {
  const category = req.params.category;
  const filteredTips = sustainableTips.filter(tip => 
    tip.category.toLowerCase().replace(/\s+/g, '-') === category.toLowerCase()
  );
  res.json(filteredTips);
});

// API endpoint to search tips
app.get('/api/tips/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const filteredTips = sustainableTips.filter(tip => 
    tip.title.toLowerCase().includes(query) ||
    tip.description.toLowerCase().includes(query) ||
    tip.category.toLowerCase().includes(query) ||
    tip.tags.some(tag => tag.toLowerCase().includes(query))
  );
  res.json(filteredTips);
});

// Individual tip detail pages
app.get('/tips/:id', (req, res) => {
  const tipId = parseInt(req.params.id);
  const tip = sustainableTips.find(t => t.id === tipId);
  
  if (!tip) {
    return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
  }
  
  res.sendFile(path.join(__dirname, 'public', 'tip-detail.html'));
});

// API endpoint to get individual tip
app.get('/api/tips/:id', (req, res) => {
  const tipId = parseInt(req.params.id);
  const tip = sustainableTips.find(t => t.id === tipId);
  
  if (!tip) {
    return res.status(404).json({ error: 'Tip not found' });
  }
  
  res.json(tip);
});

// Category pages
app.get('/category/:category', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'category.html'));
});

// About page
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Search page
app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

// 404 handler - MUST be last route
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌿 Eco Harmony Sustainable Tips Server running at http://localhost:${PORT}`);
  console.log(`📊 Serving ${sustainableTips.length} sustainable living tips`);
  console.log(`🎨 Visit http://localhost:${PORT} to explore eco-friendly practices`);
});

module.exports = app;