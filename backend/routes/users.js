const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { addUser } = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/automation";
const client = new MongoClient(uri);

router.get('/test', (req, res) => {
    res.send('Test route is working!');
});

router.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;

    const db = client.db("automation");
    const usersCollection = db.collection("users");

    // Check if username already exists
    const userByUsername = await usersCollection.findOne({ username });
    if (userByUsername) {
        return res.status(400).send('Username already exists.');
    }

    // Check if email already exists
    const userByEmail = await usersCollection.findOne({ email });
    if (userByEmail) {
        return res.status(400).send('Email already exists.');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const user = {
        user_id: uuidv4(),
        username: username,
        password: hashedPassword,
        email: email,
        role: role,
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
    };

    // Save the user to the database
    try {
        await usersCollection.insertOne(user);
        res.send('User registered!');
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user.');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const db = client.db("automation");
    const usersCollection = db.collection("users");

    // Fetch the user from the database using the username
    const user = await usersCollection.findOne({ username });

    if (!user) {
        return res.status(400).send('User not found.');
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).send('Invalid credentials.');
    }

    // If the passwords match, generate a JWT and send it to the user
    const payload = {
        userId: user.userId,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

router.post('/test', async (req, res) => {
  res.send('Test route is working!');
});



module.exports = router;
