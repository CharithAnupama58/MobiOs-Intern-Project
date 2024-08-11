import express from 'express';
import { uploadCsvFiles,getNicDetails,getNicChartDetails,getReportsDetails } from '../Controllers/nicController.js';
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
router.get('/chartDetails', async (req, res) => {
  await getNicChartDetails(req, res);
}); 
router.get('/reportDetails', async (req, res) => {
  await getReportsDetails(req, res);
}); 

export default router;
