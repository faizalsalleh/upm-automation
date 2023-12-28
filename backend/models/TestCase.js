const { MongoClient } = require('mongodb');

// MongoDB connection string for a local instance
const uri = "mongodb://localhost:27017/automation";

const client = new MongoClient(uri);

let testCasesCollection;

// Connect to MongoDB and get the 'test_cases' collection
client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  testCasesCollection = client.db("automation").collection("test_cases"); // "automation" is the name of the database
});

const addTestCase = async (testCase) => {
  try {
    const result = await testCasesCollection.insertOne(testCase);
    console.log("Test case added to MongoDB:", result);
    return result;
  } catch (err) {
    console.error('Error adding project:', err);
    throw err;
  }
};

module.exports = {
  addTestCase
};
