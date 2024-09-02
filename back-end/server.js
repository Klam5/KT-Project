require('dotenv').config();
const express = require('express');
const path = require('path');
const OpenAI = require('openai');
const app = express();
const port = process.env.PORT || 3000;

// Ensure that the API key is loaded from the environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());

// Serve static files from the "front-end" directory
app.use(express.static(path.join(__dirname, '../front-end')));

// Route to serve the JSON data
app.get('/api/places', (req, res) => {
    res.sendFile(path.join(__dirname, 'data', 'places.json'));
});

// New route to handle search with OpenAI API
app.get('/getTravelInfo', async (req, res) => {
    const location = req.query.location;
    if (!location) {
        return res.status(400).json({ error: 'Location query parameter is required' });
    }
    try {
        // Updated prompt
        const prompt = `I'm planning to travel to ${location} soon. I don't know what to bring or what to do there, and I want
                        to make the most of my trip. I want you to respond with 2 lists. The first is a list of must bring items 
                        for this destination. The second is a list of must see things or activities. If the activity would require
                        me to bring more items, list them with it. For example, if my destination is Belize, and I plan 
                        to hike in the forest, I would need to carry bug spray, when that originally wouldn't be necessary.`;
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
        });
        const gptResponse = response.choices[0].message.content;

        // Convert the response into a list of items, places, and activities
        const travelInfo = gptResponse.split('\n').filter(line => line).map(line => line.trim());

        res.json({ travelInfo });
    } catch (error) {
        console.error('Error fetching travel data:', error.message);
        res.status(500).json({ error: 'Failed to fetch travel data' });
    }
});

// Catch-all route to serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../front-end', 'project.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
