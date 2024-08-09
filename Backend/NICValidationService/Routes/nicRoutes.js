import express from 'express';
import { uploadCsvFiles } from '../Controllers/nicController.js';
import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// Allow multiple files to be uploaded (minimum 4)
router.post('/upload-csv', upload.array('csvFiles', 20), uploadCsvFiles); // Updated to allow up to 20 files, adjust as needed

export default router;
