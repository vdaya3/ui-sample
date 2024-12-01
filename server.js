const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const cors = require('cors')

const app = express()

// Middleware
app.use(cors())
app.use(express.static('uploads')) // Serve files from uploads directory

// Paths
const UPLOADS_DIR = path.join(__dirname, 'uploads')
const CSV_FILE_PATH = path.join(UPLOADS_DIR, 'radar.csv')

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR)
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR) // Save to uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, 'radar.csv') // Save as a fixed filename
  },
})
const upload = multer({ storage })

// Serve static files from the uploads directory
app.use('/uploads', express.static(UPLOADS_DIR))

// Endpoint to load the CSV file
app.get('/api/load-csv', (req, res) => {
  if (fs.existsSync(CSV_FILE_PATH)) {
    try {
      const csvData = fs.readFileSync(CSV_FILE_PATH, 'utf8')
      res.type('text/csv').send(csvData)
    } catch (error) {
      console.error('Error reading CSV file:', error)
      res.status(500).json({ message: 'Failed to load CSV file.' })
    }
  } else {
    res.status(404).json({ message: 'CSV file not found.' })
  }
})

// Endpoint to save the updated CSV file
app.post('/api/save-csv', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' })
    }

    // Ensure the uploaded file replaces the existing CSV
    const tempPath = req.file.path
    fs.renameSync(tempPath, CSV_FILE_PATH)

    const fileUrl = `http://localhost:${PORT}/uploads/radar.csv` // File URL
    res.status(200).json({ message: 'CSV updated successfully', fileUrl })
  } catch (error) {
    console.error('Error saving CSV file:', error)
    res.status(500).json({ message: 'Failed to save CSV file.' })
  }
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
