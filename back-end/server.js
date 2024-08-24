const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the "frontend" directory
app.use(express.static(path.join(__dirname, '../front-end')));

// Route to serve the JSON data
app.get('/api/cities', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'cities.json'));
});

// Catch-all route to serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end', 'project.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
