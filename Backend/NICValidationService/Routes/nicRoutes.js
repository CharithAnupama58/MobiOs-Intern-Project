import express from 'express';
import { uploadCsvFiles } from '../Controllers/nicController.js';
import multer from 'multer';

// Configure multer storage
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

// Define the route and apply the multer middleware
router.post('/upload-csv', upload.array('csvFiles', 4), uploadCsvFiles);

export default router;

