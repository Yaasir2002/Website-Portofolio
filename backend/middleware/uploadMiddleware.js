const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure uploads directory exists safely
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    // Sanitize extension and generate random cryptographically secure string
    const rawExt = path.extname(file.originalname).toLowerCase();
    const allowedExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.mp4', '.webm'];
    const safeExt = allowedExts.includes(rawExt) ? rawExt : '.bin';

    const randomHash = crypto.randomBytes(16).toString('hex');
    const safePrefix = file.fieldname.replace(/[^a-zA-Z0-9_-]/g, '');
    
    cb(null, `${safePrefix}-${Date.now()}-${randomHash}${safeExt}`);
  },
});

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
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

module.exports = upload;
