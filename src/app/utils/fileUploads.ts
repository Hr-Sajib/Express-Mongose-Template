// config/multer.config.ts
import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadMultipleFiles = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF, PPTX, DOC, DOCX allowed'));
  },
}).array('targetSalesFiles', 10);