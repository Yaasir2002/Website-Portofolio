const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Alex Rivera',
    },
    title: {
      type: String,
      default: 'Creative Designer & Full-Stack Developer',
    },
    bio: {
      type: String,
      default: 'Saya seorang desainer dan pengembang web apasionat yang berfokus menciptakan pengalaman digital modern, interaktif, dan berestetika tinggi.',
    },
    avatar: {
      type: String,
      default: '/uploads/default-avatar.png',
    },
    logo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Jakarta, Indonesia',
    },
    email: {
      type: String,
      default: 'contact@alexrivera.dev',
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      dribbble: { type: String, default: 'https://dribbble.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      twitter: { type: String, default: 'https://x.com' },
    },
    stats: {
      yearsExperience: { type: Number, default: 5 },
      completedProjects: { type: Number, default: 42 },
      happyClients: { type: Number, default: 30 },
    },
    experiences: [
      {
        period: String,
        role: String,
        company: String,
        description: String,
      },
    ],
    education: [
      {
        period: String,
        degree: String,
        institution: String,
        description: String,
      },
    ],
    certifications: [
      {
        year: String,
        title: String,
        issuer: String,
        credentialUrl: String,
        description: String,
      },
    ],
    skillCategories: [
      {
        title: String,
        accent: { type: String, default: 'accent-cyan' },
        skills: [
          {
            name: String,
            level: Number,
          },
        ],
      },
    ],
    toolsIcons: [
      {
        name: String,
        icon: String,
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Encrypt password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
