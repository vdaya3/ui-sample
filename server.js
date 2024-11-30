const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const cors = require('cors');


const app = express()

// Middleware
app.use(cors());
app.use(express.static('uploads')); // Serve files from uploads directory

// Path to the uploads folder and CSV file
const uploadsFolder = path.join(__dirname, 'uploads')
const csvFilePath = path.join(uploadsFolder, 'radar.csv')

// Configure multer for file uploads
//const upload = multer({ dest: 'uploads/' })
// Set up the uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR); // Save to uploads directory
    },
    filename: (req, file, cb) => {
        const uniqueName = 'radar.csv'; // Save as a fixed filename
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

// Serve static files from uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));


// Serve the CSV file
app.get('/api/load-csv', (req, res) => {
  if (fs.existsSync(csvFilePath)) {
    const csvData = fs.readFileSync(csvFilePath, 'utf8')
    res.type('text/csv').send(csvData)
  } else {
    res.status(404).send('CSV file not found')
  }
})

// Save the updated CSV file
app.post('/api/save-csv', upload.single('file'), (req, res) => {
  const tempPath = req.file.path // Path of the uploaded file
  fs.renameSync(tempPath, csvFilePath) // Move uploaded file to replace the existing CSV

  const fileUrl = `http://localhost:3000/uploads/radar.csv`
  res.json({ message: 'CSV updated successfully', fileUrl })
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
