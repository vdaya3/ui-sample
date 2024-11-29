const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Path to the uploads folder and the CSV file
const uploadsFolder = path.join(__dirname, 'uploads');
const csvFilePath = path.join(uploadsFolder, 'radar.csv');

// Serve the CSV file
app.get('/load-csv', (req, res) => {
    if (fs.existsSync(csvFilePath)) {
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        res.type('text/csv').send(csvData);
    } else {
        res.status(404).send('CSV file not found');
    }
});

// Save the updated CSV file
app.post('/save-csv', (req, res) => {
    const updatedCsv = req.body.csv;
    fs.writeFileSync(csvFilePath, updatedCsv, 'utf8'); // Overwrite the existing file
    res.json({ message: 'CSV updated successfully' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
