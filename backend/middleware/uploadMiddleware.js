const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary if environment variables exist
const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Local storage fallback
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const localStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const rawExt = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm'];
    const safeExt = allowedExts.includes(rawExt) ? rawExt : '.bin';

    const randomHash = crypto.randomBytes(16).toString('hex');
    const safePrefix = file.fieldname.replace(/[^a-zA-Z0-9_-]/g, '');

    cb(null, `${safePrefix}-${Date.now()}-${randomHash}${safeExt}`);
  },
});

// Cloudinary storage engine
const cloudinaryStorage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'portfolio_uploads',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'webm'],
      },
    })
  : null;

function checkFileType(file, cb) {
  const allowedExtensions = /^\.(jpeg|jpg|png|gif|webp|mp4|webm|svg)$/i;
  const allowedMimeTypes = /^(image\/(jpeg|png|gif|webp|svg\+xml)|video\/(mp4|webm))$/i;

  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Format file tidak diizinkan! Hanya gambar (jpg, png, webp, gif, svg) dan video (mp4, webm) yang diperbolehkan.'));
  }
}

const upload = multer({
  storage: hasCloudinaryConfig ? cloudinaryStorage : localStorage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
