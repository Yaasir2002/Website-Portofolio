const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect Database
connectDB();

// 1. Helmet HTTP Security Headers (XSS, HSTS, Clickjacking, MIME sniffing protection)
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for flexible external image/video embeds (Unsplash, YouTube)
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows cross-origin image loading
  })
);

// 2. Prevent NoSQL Injection Attacks (sanitizes $, . in keys)
app.use(mongoSanitize());

// 3. Prevent HTTP Parameter Pollution Attacks
app.use(hpp());

// Body Parser Middleware
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// 4. Restricted CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl/Postman) or if in development
      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Akses ditolak oleh kebijakan keamanan CORS'));
      }
    },
    credentials: true,
  })
);

// 5. Global API Rate Limiter (Max 100 requests per 15 minutes per IP)
const globalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { message: 'Terlalu banyak permintaan dari IP ini. Coba lagi dalam 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', globalApiLimiter);

// 6. Strict Rate Limiter for Admin Login (Max 5 failed attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Terlalu banyak percobaan login gagal. Demi keamanan, coba lagi setelah 15 menit.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', loginLimiter);

// 7. Rate Limiter for Contact Form Submissions (Max 5 messages per hour per IP)
const messageLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Anda telah mencapai batas pengiriman pesan per jam. Silakan coba lagi nanti.' },
});
app.use('/api/messages', messageLimiter);

// Serve static uploads safely
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/portfolios', require('./routes/portfolioRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API Server is secure & running smoothly' });
});

// Production Central Error Handler (Masks stack traces in production)
app.use((err, req, res, next) => {
  console.error('Server Security Error:', err.message);
  const isProduction = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    message: isProduction ? 'Terjadi kesalahan pada server' : err.message || 'Internal Server Error',
    ...(isProduction ? {} : { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔒 Security Hardened Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

module.exports = app;
