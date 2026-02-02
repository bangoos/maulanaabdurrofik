const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const Portfolio = require('../models/Portfolio');
const Profile = require('../models/Profile');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.redirect('/admin/login');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Admin login page
router.get('/login', (req, res) => {
  if (req.session && req.session.authenticated) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { 
    title: 'Admin Login - Maulana Abdurrofik',
    error: null 
  });
});

// Admin login process
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check credentials (in production, use database)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@maulanaabdurrofik.id';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      req.session.authenticated = true;
      req.session.admin = { email };
      return res.redirect('/admin/dashboard');
    }
    
    res.render('admin/login', { 
      title: 'Admin Login - Maulana Abdurrofik',
      error: 'Invalid email or password' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/login', { 
      title: 'Admin Login - Maulana Abdurrofik',
      error: 'An error occurred during login' 
    });
  }
});

// Admin logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/admin/dashboard');
    }
    res.redirect('/admin/login');
  });
});

// Admin dashboard
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const portfolioCount = await Portfolio.countDocuments();
    const recentPortfolios = await Portfolio.find().sort({ createdAt: -1 }).limit(5);
    const profile = await Profile.findOne();
    
    res.render('admin/dashboard', {
      title: 'Admin Dashboard - Maulana Abdurrofik',
      portfolioCount,
      recentPortfolios,
      profile,
      admin: req.session.admin
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/error', { error });
  }
});

// Portfolio management
router.get('/portfolios', isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const portfolios = await Portfolio.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Portfolio.countDocuments();
    const totalPages = Math.ceil(total / limit);
    
    res.render('admin/portfolios', {
      title: 'Manage Portfolios - Maulana Abdurrofik',
      portfolios,
      currentPage: page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/error', { error });
  }
});

// Add new portfolio form
router.get('/portfolios/new', isAuthenticated, (req, res) => {
  res.render('admin/portfolio-form', {
    title: 'Add Portfolio - Maulana Abdurrofik',
    portfolio: null,
    action: '/admin/portfolios',
    method: 'POST'
  });
});

// Create new portfolio
router.post('/portfolios', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const portfolioData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      technologies: req.body.technologies ? req.body.technologies.split(',').map(t => t.trim()) : [],
      projectUrl: req.body.projectUrl || '',
      githubUrl: req.body.githubUrl || '',
      featured: req.body.featured === 'on',
      order: parseInt(req.body.order) || 0
    };
    
    if (req.file) {
      portfolioData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const portfolio = new Portfolio(portfolioData);
    await portfolio.save();
    
    res.redirect('/admin/portfolios?success=Portfolio created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/portfolio-form', {
      title: 'Add Portfolio - Maulana Abdurrofik',
      portfolio: req.body,
      action: '/admin/portfolios',
      method: 'POST',
      error: 'Failed to create portfolio'
    });
  }
});

// Edit portfolio form
router.get('/portfolios/:id/edit', isAuthenticated, async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).render('admin/error', { error: 'Portfolio not found' });
    }
    
    res.render('admin/portfolio-form', {
      title: 'Edit Portfolio - Maulana Abdurrofik',
      portfolio,
      action: `/admin/portfolios/${portfolio._id}`,
      method: 'PUT'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/error', { error });
  }
});

// Update portfolio
router.put('/portfolios/:id', isAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const portfolioData = {
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      technologies: req.body.technologies ? req.body.technologies.split(',').map(t => t.trim()) : [],
      projectUrl: req.body.projectUrl || '',
      githubUrl: req.body.githubUrl || '',
      featured: req.body.featured === 'on',
      order: parseInt(req.body.order) || 0
    };
    
    if (req.file) {
      portfolioData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      portfolioData,
      { new: true, runValidators: true }
    );
    
    if (!portfolio) {
      return res.status(404).render('admin/error', { error: 'Portfolio not found' });
    }
    
    res.redirect('/admin/portfolios?success=Portfolio updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/portfolio-form', {
      title: 'Edit Portfolio - Maulana Abdurrofik',
      portfolio: { ...req.body, _id: req.params.id },
      action: `/admin/portfolios/${req.params.id}`,
      method: 'PUT',
      error: 'Failed to update portfolio'
    });
  }
});

// Delete portfolio
router.delete('/portfolios/:id', isAuthenticated, async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json({ success: true, message: 'Portfolio deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
});

// Profile management
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create default profile if none exists
      profile = new Profile({
        name: 'Maulana Abdurrofik',
        title: 'Full Stack Developer',
        bio: 'Passionate full stack developer with expertise in Node.js, React, and modern web technologies.',
        email: 'contact@maulanaabdurrofik.id',
        social: {
          github: 'https://github.com/maulanaabdurrofik',
          linkedin: 'https://linkedin.com/in/maulanaabdurrofik'
        }
      });
      await profile.save();
    }
    
    res.render('admin/profile', {
      title: 'Edit Profile - Maulana Abdurrofik',
      profile
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/error', { error });
  }
});

// Update profile
router.post('/profile', isAuthenticated, upload.single('avatar'), async (req, res) => {
  try {
    const profileData = {
      name: req.body.name,
      title: req.body.title,
      bio: req.body.bio,
      email: req.body.email,
      phone: req.body.phone || '',
      location: req.body.location || '',
      social: {
        github: req.body.github || '',
        linkedin: req.body.linkedin || '',
        twitter: req.body.twitter || '',
        instagram: req.body.instagram || '',
        facebook: req.body.facebook || ''
      }
    };
    
    if (req.file) {
      profileData.avatar = `/uploads/${req.file.filename}`;
    }
    
    let profile = await Profile.findOne();
    if (profile) {
      Object.assign(profile, profileData);
      await profile.save();
    } else {
      profile = new Profile(profileData);
      await profile.save();
    }
    
    res.redirect('/admin/profile?success=Profile updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).render('admin/profile', {
      title: 'Edit Profile - Maulana Abdurrofik',
      profile: req.body,
      error: 'Failed to update profile'
    });
  }
});

module.exports = router;
