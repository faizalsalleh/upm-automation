require('dotenv').config();
const { dynamoDBDocClient } = require('./aws-config');
const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// You can now use dynamoDBDocClient directly in your routes or other parts of your application.

// Basic Route
app.get('/', (req, res) => {
    res.send('Hello from the Express server!');
});

app.use('/api/users', userRoutes);

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
