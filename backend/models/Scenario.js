const { MongoClient } = require('mongodb');

// MongoDB connection string for a local instance
const uri = "mongodb://localhost:27017/automation";

const client = new MongoClient(uri);

let scenariosCollection;

// Connect to MongoDB and get the 'scenarios' collection
client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  scenariosCollection = client.db("automation").collection("scenarios"); // "automation" is the name of the database
});

const addScenario = async (scenario) => {
  try {
    const result = await scenariosCollection.insertOne(scenario);
    console.log("Scenario added to MongoDB:", result);
    return result;
  } catch (err) {
    console.error('Error adding Scenario:', err);
    throw err;
  }
};

module.exports = {
  addScenario
};
