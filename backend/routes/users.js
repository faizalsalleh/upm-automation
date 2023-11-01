// backend/routes/users.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { addUser } = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const { DynamoDBDocumentClient, QueryCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamoDBDocClient } = require('../aws-config');

router.post('/register', async (req, res) => {
  const { username, password, email, role } = req.body;

  // Check if username already exists
  const usernameQuery = {
    TableName: 'Users',
    IndexName: "UsernameIndex",
    KeyConditionExpression: "username = :usernameVal",
    ExpressionAttributeValues: {
        ":usernameVal": username
    }
  };

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Fetch the user from the database using the username
    const usernameQuery = {
        TableName: 'Users',
        IndexName: "UsernameIndex",
        KeyConditionExpression: "username = :usernameVal",
        ExpressionAttributeValues: {
            ":usernameVal": username
        }
    };

    const userResult = await dynamoDBDocClient.send(new QueryCommand(usernameQuery));

    if (userResult.Count === 0) {
        return res.status(400).send('User not found.');
    }

    const user = userResult.Items[0];

    // Check if the user has a password set
    if (!user.password) {
        return res.status(400).send('Invalid credentials.');
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


  const usernameResult = await dynamoDBDocClient.send(new QueryCommand(usernameQuery));
  if (usernameResult.Count > 0) {
    return res.status(400).send('Username already exists.');
  }

  // Check if email already exists
  const emailQuery = {
    TableName: 'Users',
    IndexName: "EmailIndex",
    KeyConditionExpression: "email = :emailVal",
    ExpressionAttributeValues: {
        ":emailVal": email
    }
  };

  const emailResult = await dynamoDBDocClient.send(new QueryCommand(emailQuery));
  if (emailResult.Count > 0) {
    return res.status(400).send('Email already exists.');
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Log the hashed password
  console.log("Hashed password:", hashedPassword);

  // Create user object
  const user = {
      userId: uuidv4(),  // Using the 'uuid' package to generate unique IDs
      username: username,
      password: hashedPassword,
      email: email,
      role: role,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
  };

  // Save the user to the database
  try {
      await addUser(user);
      res.send('User registered!');
  } catch (err) {
      console.error('Error registering user:', err);
      res.status(500).send('Error registering user.');
  }
});

module.exports = router;
