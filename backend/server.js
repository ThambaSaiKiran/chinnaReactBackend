const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const upload = multer();

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Saikiran@2000',
    database: 'health_dev_challenge'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

const userId = "john_doe_17091999"; // Replace with dynamic logic if needed
const email = "john@xyz.com"; // Replace with dynamic logic if needed
const rollNumber = "ABCD123"; // Replace with dynamic logic if needed

app.post('/bfhl', upload.single('file'), (req, res) => {
    const data = req.body.data ? JSON.parse(req.body.data) : [];
    const fileB64 = req.file ? req.file.buffer.toString('base64') : null;

    // Separate numbers and alphabets
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));

    // Find highest lowercase alphabet
    const lowercaseAlphabets = alphabets.filter(char => char === char.toLowerCase());
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().pop()] : [];

    // File handling
    let fileValid = false, mimeType = null, fileSize = null;
    if (fileB64) {
        fileValid = true; // Assume valid for now
        mimeType = "image/png"; // Example MIME type
        fileSize = (Buffer.byteLength(fileB64, 'base64') / 1024).toFixed(2); // Convert to KB
    }

    return res.json({
        is_success: true,
        user_id: userId,
        email: email,
        roll_number: rollNumber,
        numbers: numbers,
        alphabets: alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValid,
        file_mime_type: mimeType,
        file_size_kb: fileSize
    });
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
