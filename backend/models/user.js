const { MongoClient } = require('mongodb');

// MongoDB connection string for a local instance
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

let usersCollection;

// Connect to MongoDB and get the 'users' collection
client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  usersCollection = client.db("automation").collection("users"); // "automation" is the name of the database
});

const addUser = async (user) => {
  try {
    const result = await usersCollection.insertOne(user);
    console.log("User added to MongoDB:", result);
    return result;
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  }
};

module.exports = {
    addUser
};
