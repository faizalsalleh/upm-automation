const { MongoClient } = require('mongodb');

// MongoDB connection string for a local instance
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

let testCaseDataCollection;

// Connect to MongoDB and get the 'test_case_data' collection
client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  testCaseDataCollection = client.db("automation").collection("test_case_data"); // "automation" is the name of the database
});

const addTestCaseData = async (testCaseData) => {
  try {
    const result = await testCaseDataCollection.insertOne(testCaseData);
    console.log("Test case data added to MongoDB:", result);
    return result;
  } catch (err) {
    console.error('Error adding project:', err);
    throw err;
  }
};

module.exports = {
  addTestCaseData
};
