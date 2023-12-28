const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb://localhost:27017/automation";
const client = new MongoClient(uri);

// test_case_results document structure (for reference)
/*
{
  test_case_id: ObjectId,
  type: String,
  name: String,
  request: Number,
  fail: Number,
  median: Number,
  percent_90: Number,
  percent_99: Number,
  average: Number,
  min: Number,
  max: Number,
  average_size: Number,
  current_rps: Number,
  current_failure: Number,
  user_id: ObjectId,
  created_at: Date,
  updated_at: Date
}
*/

let testCasesResultsCollection;

async function connectDB() {
    if (!testCasesResultsCollection) {
        await client.connect();
        testCasesResultsCollection = client.db("automation").collection("test_case_results");
    }
    return testCasesResultsCollection;
}

const addTestCaseResult = async (testCaseResultData) => {
    console.log('testCaseResultData at Model: ', testCaseResultData);
    const collection = await connectDB();
    const adjustedData = {
      test_case_id: new ObjectId(testCaseResultData.testCaseId),
      type: testCaseResultData.method,
      name: testCaseResultData.name,
      request: testCaseResultData.num_requests,
      fail: testCaseResultData.num_failures,
      median: testCaseResultData.median_response_time,
      percent_90: testCaseResultData.ninetieth_response_time,
      percent_99: testCaseResultData.ninety_ninth_response_time,
      average: testCaseResultData.avg_response_time,
      min: testCaseResultData.min_response_time,
      max: testCaseResultData.max_response_time,
      average_size: testCaseResultData.avg_content_length,
      current_rps: testCaseResultData.current_rps,
      current_failure: testCaseResultData.current_fail_per_sec,
      user_id: new ObjectId(testCaseResultData.user_id),
      created_at: new Date(),
      updated_at: new Date()
    };
    return await collection.insertOne(adjustedData);
};

const getAllTestCaseResults = async () => {
    const collection = await connectDB();
    return await collection.find({}).toArray();
};

const getAllTestCaseResultsByTestCaseId = async (testCaseId) => {
  const collection = await connectDB();
  return await collection.find({ test_case_id: new ObjectId(testCaseId) }).toArray();
};

const getTestCaseResultById = async (id) => {
    const collection = await connectDB();
    return await collection.findOne({ _id: new ObjectId(id) });
};

const updateTestCaseResult = async (id, updateData) => {
    const collection = await connectDB();
    return await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
};

const deleteTestCaseResult = async (id) => {
    const collection = await connectDB();
    return await collection.deleteOne({ _id: new ObjectId(id) });
};

const deleteAllResultsByTestCaseId = async (testCaseId) => {
    const collection = await connectDB();
    return await collection.deleteMany({ test_case_id: new ObjectId(testCaseId) });
};

module.exports = {
  addTestCaseResult,
  getAllTestCaseResults,
  getAllTestCaseResultsByTestCaseId,
  getTestCaseResultById,
  updateTestCaseResult,
  deleteTestCaseResult,
  deleteAllResultsByTestCaseId
};
