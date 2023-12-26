const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection string and client setup
const uri = "mongodb://localhost:27017/automation";
const client = new MongoClient(uri);

async function connectDB() {
    await client.connect();
    return client.db("automation").collection("test_cases");
}

async function connectDB2() {
    await client.connect();
    return client.db("automation").collection("test_case_data");
}

// Create a new test case
exports.createTestCase = async (req, res) => {
    try {
        const testCasesCollection = await connectDB();
        const testCaseData = {
            ...req.body,
            scenario_id: ObjectId(req.body.scenario_id),  // Convert to ObjectId
            user_id: ObjectId(req.body.user_id),  // Convert to ObjectId
            created_at: new Date(),
            updated_at: new Date()
        };
        const result = await testCasesCollection.insertOne(testCaseData);
        res.status(201).json({ message: 'Test case created successfully', data: result });
    } catch (err) {
        console.error('Error creating test case:', err);
        res.status(500).json({ message: 'Error creating test case', error: err.message });
    }
};

// Get all test cases
exports.getAllTestCases = async (req, res) => {
    try {
        const testCasesCollection = await connectDB();
        const testCases = await testCasesCollection.find({}).toArray();
        res.status(200).json(testCases);
    } catch (err) {
        console.error('Error retrieving test cases:', err);
        res.status(500).json({ message: 'Error retrieving test cases', error: err.message });
    }
};

// Get all test cases for a specific scenario
exports.getAllTestCasesForScenario = async (req, res) => {
  try {
      const testCasesCollection = await connectDB();
      const scenarioId = new ObjectId(req.params.scenarioId); // Convert string to ObjectId
      const testCases = await testCasesCollection.find({ scenario_id: scenarioId }) // Use scenarioId as ObjectId
                                                .sort({ created_at: -1 })
                                                .toArray();
      res.status(200).json(testCases);
  } catch (err) {
      console.error('Error retrieving test cases:', err);
      res.status(500).json({ message: 'Error retrieving test cases', error: err.message });
  }
};

// Get all test case results
exports.getAllTestCaseResults = async (req, res) => {
  try {
      const testCaseResultsCollection = await connectDB2();
      const testCaseId = new ObjectId(req.params.testCaseId); // Convert string to ObjectId
      const testCaseResults = await testCaseResultsCollection.find({ test_case_id: testCaseId })
                                                .sort({ created_at: -1 })
                                                .toArray();
      res.status(200).json(testCaseResults);
  } catch (err) {
      console.error('Error retrieving test case results:', err);
      res.status(500).json({ message: 'Error retrieving case results', error: err.message });
  }
};


// Get a single test case by ID
exports.getTestCaseById = async (req, res) => {
    try {
        const testCasesCollection = await connectDB();
        const testCase = await testCasesCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!testCase) {
            return res.status(404).json({ message: 'Test case not found' });
        }
        res.status(200).json(testCase);
    } catch (err) {
        console.error('Error retrieving test case:', err);
        res.status(500).json({ message: 'Error retrieving test case', error: err.message });
    }
};

// Update a test case
exports.updateTestCase = async (req, res) => {
    try {
        const testCasesCollection = await connectDB();
        const updateData = {
            ...req.body,
            updated_at: new Date()  // Update the updated_at field
        };
        const result = await testCasesCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Test case not found' });
        }
        res.status(200).json({ message: 'Test case updated successfully' });
    } catch (err) {
        console.error('Error updating test case:', err);
        res.status(500).json({ message: 'Error updating test case', error: err.message });
    }
};

// Delete a test case
exports.deleteTestCase = async (req, res) => {
    try {
        const testCasesCollection = await connectDB();
        const result = await testCasesCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Test case not found' });
        }
        res.status(200).json({ message: 'Test case deleted successfully' });
    } catch (err) {
        console.error('Error deleting test case:', err);
        res.status(500).json({ message: 'Error deleting test case', error: err.message });
    }
};
