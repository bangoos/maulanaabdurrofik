const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Profile = require('../models/Profile');

// Get all portfolios
router.get('/portfolios', async (req, res) => {
  try {
    const { category, featured } = req.query;
    let query = {};
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;
    
    const portfolios = await Portfolio.find(query).sort({ order: 1, createdAt: -1 });
    res.json(portfolios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single portfolio
router.get('/portfolios/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get profile
router.get('/profile', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Portfolio.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
