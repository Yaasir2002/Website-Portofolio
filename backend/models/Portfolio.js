const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, // e.g. "UI/UX Design", "Web Development", "Branding", "Mobile App", "Graphic Design", "Video / Motion Graphic"
    },
    thumbnail: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    tools: [
      {
        type: String,
      },
    ],
    demoLink: {
      type: String,
      default: '',
    },
    githubLink: {
      type: String,
      default: '',
    },
    date: {
      type: String,
      default: '2026',
    },
    tags: [
      {
        type: String,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
