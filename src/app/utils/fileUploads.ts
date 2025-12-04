// config/multer.config.ts
import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadSingleTargetSalesPdf = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF allowed'));
    }
  },
}).single('targetSalesPdf'); // ← field name in form-data