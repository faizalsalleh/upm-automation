const { MongoClient } = require('mongodb');

// MongoDB connection string for a local instance
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

let projectsCollection;

// Connect to MongoDB and get the 'projects' collection
client.connect(err => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  projectsCollection = client.db("automation").collection("projects"); // "automation" is the name of the database
});

const addProject = async (project) => {
  try {
    const result = await projectsCollection.insertOne(project);
    console.log("Project added to MongoDB:", result);
    return result;
  } catch (err) {
    console.error('Error adding project:', err);
    throw err;
  }
};

module.exports = {
    addProject
};
