const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

const run = async () => {
    try {
        await client.connect();
        const db = client.db("automation");

        // Create the scenarios collection
        const scenariosCollection = db.collection('scenarios');

        console.log("Scenarios collection set up successfully.");

    } catch (err) {
        console.error("Error setting up MongoDB:", err);
    } finally {
        await client.close();
    }
};

run();
