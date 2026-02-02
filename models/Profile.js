const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  social: {
    github: String,
    linkedin: String,
    twitter: String,
    instagram: String,
    facebook: String
  },
  skills: [{
    name: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    }
  }],
  experience: [{
    title: String,
    company: String,
    period: String,
    description: String
  }],
  education: [{
    degree: String,
    institution: String,
    period: String,
    description: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

profileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Profile', profileSchema);
