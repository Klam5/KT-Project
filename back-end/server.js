const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the "front-end" directory
app.use(express.static(path.join(__dirname, '../front-end')));

// Route to serve the JSON data
app.get('/api/places', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'places.json'));
});

// Catch-all route to serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end', 'project.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
