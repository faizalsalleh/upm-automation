const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/automation";
const client = new MongoClient(uri);

const createProjectsCollection = async () => {
    try {
        await client.connect();

        const db = client.db("automation");
        const projectsCollection = db.collection("projects");

        // Create indexes if needed. For example, if you want project names to be unique:
        await projectsCollection.createIndex({ name: 1 }, { unique: true });

        console.log("Projects collection and indexes set up successfully.");
    } catch (err) {
        console.error("Error setting up the projects collection:", err);
    } finally {
        await client.close();
    }
};

createProjectsCollection();
