import express from 'express';
import { uploadCsvFiles,getNicDetails } from '../Controllers/nicController.js';
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


router.post('/upload-csv', upload.array('csvFiles', 20), uploadCsvFiles);
router.get('/nicDetails', async (req, res) => {
  await getNicDetails(req, res);
}); 

export default router;
