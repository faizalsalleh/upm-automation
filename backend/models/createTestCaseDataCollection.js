const { MongoClient } = require('mongodb');

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

const run = async () => {
    try {
        await client.connect();
        const db = client.db("automation");

        // Create the test case data collection
        const testCaseDataCollection = db.collection('test_case_data');

        console.log("Test case data collection set up successfully.");

    } catch (err) {
        console.error("Error setting up MongoDB:", err);
    } finally {
        await client.close();
    }
};

run();
