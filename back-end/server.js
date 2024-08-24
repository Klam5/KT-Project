//create a simple server
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; //port for the server to run on


app.use(express.json());

// Example API route
app.get('/api/example', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});

// Serve static files from the "front-end" directory
app.use(express.static(path.join(__dirname, '../front-end')));

// Catch-all route to serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end', 'project.html'));
});


app.get('/', (req, res) => {
    res.send('Traveler API');
});

//starting server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
