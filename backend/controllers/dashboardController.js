const { MongoClient, ObjectId } = require('mongodb');

// MongoDB URI and client setup
const uri = "mongodb://localhost:27017/automation";
const client = new MongoClient(uri);

async function connectDB1() {
    try {
        await client.connect();
        return client.db("automation").collection("test_cases");
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

async function connectDB2() {
    try {
        await client.connect();
        return client.db("automation").collection("test_case_results");
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

// Get Avg Response Time Bar Chart
exports.getAvgResponseTimeBarChart = async (req, res) => {
  try {
    const testCasesCollection = await connectDB1();
    const resultsCollection = await connectDB2();

    const scenarioId = req.params.id;
    const testCases = await testCasesCollection.find({ scenario_id: new ObjectId(scenarioId) }).toArray();
    const testCasesIds = testCases.map(tc => tc._id);

    const results = await resultsCollection
      .aggregate([
        { $match: { test_case_id: { $in: testCasesIds } } },
        {
          $group: {
            _id: "$user_num",
            averageResponseTime: { $avg: "$average" }
          }
        },
        { $sort: { _id: 1 } } // to sort by user_num
      ])
      .toArray();

    // Now `results` will have the average response times grouped by user_num
    res.json(results);
  } catch (err) {
    console.error('Error getting average response time data:', err);
    res.status(500).send('Server error');
  }
};

// exports.getAvgResponseTimeBarChart = async (req, res) => {
//   const scenarioId = req.params.id;
//   console.log('getAvgResponseTimeBarChart triggered for scenarioId:', scenarioId);

//   try {
//       // Dummy data
//       const dummyData = [
//           { _id: '5', averageResponseTime: 100 },
//           { _id: '10', averageResponseTime: 200 },
//           { _id: '20', averageResponseTime: 300 }
//       ];

//       // Instead of querying the database, send back the dummy data
//       res.json(dummyData);
//   } catch (err) {
//       console.error('Error in getAvgResponseTimeBarChart:', err);
//       res.status(500).send('Server error');
//   }
// };

// Get Test Cases by Scenario ID
exports.getTestCasesByScenario = async (req, res) => {
  const scenarioId = req.params.id;
  try {
    //console.log('scenarioId in getTestCasesByScenario: ', scenarioId);
    // Assuming you have a function to connect to your database and get the test cases collection
    const testCasesCollection = await connectDB1();
    const testCases = await testCasesCollection.find({ scenario_id: new ObjectId(scenarioId) }).toArray();
    res.json(testCases);
  } catch (err) {
    console.error('Error retrieving test cases:', err);
    res.status(500).send('Server error');
  }
};


