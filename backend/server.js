require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');
const projectRoutes = require('./routes/project');
const scenarioRoutes = require('./routes/scenario');
const testCaseRoutes = require('./routes/test_case');
const testCaseResultRoutes = require('./routes/test_case_result');
const { MongoClient } = require('mongodb');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for all routes
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello from the Express server!');
});

app.use('/api/users', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/scenario', scenarioRoutes);
app.use('/api/testcase', testCaseRoutes);
app.use('/api/testcase/result', testCaseResultRoutes);

// MongoDB connection string for a local instance
const uri = "mongodb://localhost:27017/automation";

const client = new MongoClient(uri);

async function startServer() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const PORT = 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit the process with a failure code
    }
}

startServer();
