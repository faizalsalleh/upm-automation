const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/automation";
const client = new MongoClient(uri);

const run = async () => {
    try {
        await client.connect();
        const db = client.db("automation");

        // Create the test case collection
        const testCasesCollection = db.collection('test_cases');

        console.log("Test case collection set up successfully.");

    } catch (err) {
        console.error("Error setting up MongoDB:", err);
    } finally {
        await client.close();
    }
};

run();
