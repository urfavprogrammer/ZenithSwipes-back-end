import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!fs.existsSync('uploads/proofs')) {
  fs.mkdirSync('uploads/proofs', { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    // Add original file extension to the saved filename
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/avatars'));
  },
  filename: (req, file, cb) => {
    // Add original file extension to the saved filename
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const imageFileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed!"), false);
  } else {
    cb(null, true);
  }
};
const upload = multer({ dest: 'uploads/proofs/' });
const profileUpload = multer({ storage: avatarStorage, fileFilter: imageFileFilter });

export { upload, profileUpload };
// Usage: import { upload, profileUpload } from '../middleware/upload.js';