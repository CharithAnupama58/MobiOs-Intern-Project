export const uploadCsvFiles = async (req, res) => {
    if (!req.files || req.files.length !== 4) {
      return res.status(400).json({ error: 'Please upload exactly 4 CSV files.' });
    }
  
    const fileNames = req.files.map((file) => file.originalname);
  
    console.log('Uploaded files:', req.files);
    console.log('File Names:', fileNames);
  
    // Further processing of the CSV files can be done here
  
    res.json({ message: 'Files uploaded successfully', fileNames });
  };
  