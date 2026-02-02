const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const Profile = require('../models/Profile');

// Home page
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const portfolios = await Portfolio.find().sort({ order: 1, createdAt: -1 });
    const featuredPortfolios = portfolios.filter(p => p.featured);
    
    res.render('index', {
      profile,
      portfolios,
      featuredPortfolios,
      title: 'Maulana Abdurrofik - Portfolio'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error });
  }
});

// Portfolio detail page
router.get('/portfolio/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).render('404');
    }
    
    const profile = await Profile.findOne();
    const relatedPortfolios = await Portfolio.find({
      _id: { $ne: portfolio._id },
      category: portfolio.category
    }).limit(3);
    
    res.render('portfolio-detail', {
      portfolio,
      profile,
      relatedPortfolios,
      title: `${portfolio.title} - Maulana Abdurrofik`
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error });
  }
});

// Portfolio by category
router.get('/category/:category', async (req, res) => {
  try {
    const category = req.params.category;
    const portfolios = await Portfolio.find({ category }).sort({ order: 1, createdAt: -1 });
    const profile = await Profile.findOne();
    
    res.render('category', {
      portfolios,
      profile,
      category,
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Projects - Maulana Abdurrofik`
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error });
  }
});

// About page
router.get('/about', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.render('about', {
      profile,
      title: 'About - Maulana Abdurrofik'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error });
  }
});

// Contact page
router.get('/contact', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    res.render('contact', {
      profile,
      title: 'Contact - Maulana Abdurrofik'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error });
  }
});

module.exports = router;
