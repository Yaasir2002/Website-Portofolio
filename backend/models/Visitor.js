const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      default: '/',
    },
    referrer: {
      type: String,
      default: 'Direct',
    },
    userAgent: {
      type: String,
      default: '',
    },
    ipHash: {
      type: String,
      default: '',
    },
    portfolioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Portfolio',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Visitor', visitorSchema);
