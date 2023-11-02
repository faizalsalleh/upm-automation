const { MongoClient } = require('mongodb');

// MongoDB connection string for a local instance
const uri = "mongodb://localhost:27017/";

const client = new MongoClient(uri);

const run = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB.");

        const db = client.db("automation"); // Select the "automation" database

        // Create the Users collection (if it doesn't exist)
        const usersCollection = db.collection('users');

        // Create indexes for the username and email fields
        await usersCollection.createIndex({ username: 1 }, { unique: true });
        await usersCollection.createIndex({ email: 1 }, { unique: true });

        console.log("Users collection and indexes set up successfully.");

    } catch (err) {
        console.error("Error setting up MongoDB:", err);
    } finally {
        await client.close();
    }
};

run();
