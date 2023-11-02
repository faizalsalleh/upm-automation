require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const { MongoClient } = require('mongodb');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello from the Express server!');
});

app.use('/api/users', userRoutes);

// MongoDB connection string for a local instance
const uri = "mongodb://localhost:27017/automation";

const client = new MongoClient(uri);

// Connect to MongoDB
client.connect(err => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with a failure code
    }
    console.log('Connected to MongoDB');

    // Start the Server
    const PORT = 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
