const TestCaseResult = require('../models/TestCaseResult');

exports.createTestCaseResult = async (req, res) => {
    try {
        const result = await TestCaseResult.addTestCaseResult(req.body);
        res.status(201).json({ message: 'Test case result created successfully', data: result });
    } catch (err) {
        console.error('Error creating test case result:', err);
        res.status(500).json({ message: 'Error creating test case result', error: err.message });
    }
};

exports.getAllTestCaseResults = async (req, res) => {
    try {
        const results = await TestCaseResult.getAllTestCaseResults();
        res.status(200).json(results);
    } catch (err) {
        console.error('Error retrieving test case results:', err);
        res.status(500).json({ message: 'Error retrieving test case results', error: err.message });
    }
};

exports.getAllTestCaseResultsByTestCaseId = async (req, res) => {
  try {
      const testCaseId = req.params.testCaseId; // Get testCaseId from request parameters
      const results = await TestCaseResult.getAllTestCaseResultsByTestCaseId(testCaseId);
      res.status(200).json(results);
  } catch (err) {
      console.error('Error retrieving test case results:', err);
      res.status(500).json({ message: 'Error retrieving test case results', error: err.message });
  }
};

exports.getTestCaseResultById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await TestCaseResult.getTestCaseResultById(id);
        if (!result) {
            return res.status(404).json({ message: 'Test case result not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error('Error retrieving test case result:', err);
        res.status(500).json({ message: 'Error retrieving test case result', error: err.message });
    }
};

exports.updateTestCaseResult = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = { ...req.body, updated_at: new Date() };
        const result = await TestCaseResult.updateTestCaseResult(id, updateData);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Test case result not found' });
        }
        res.status(200).json({ message: 'Test case result updated successfully' });
    } catch (err) {
        console.error('Error updating test case result:', err);
        res.status(500).json({ message: 'Error updating test case result', error: err.message });
    }
};

exports.deleteTestCaseResult = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await TestCaseResult.deleteTestCaseResult(id);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Test case result not found' });
        }
        res.status(200).json({ message: 'Test case result deleted successfully' });
    } catch (err) {
        console.error('Error deleting test case result:', err);
        res.status(500).json({ message: 'Error deleting test case result', error: err.message });
    }
};

exports.deleteAllResultsByTestCaseId = async (req, res) => {
    try {
        const testCaseId = req.params.testCaseId;
        const result = await TestCaseResult.deleteAllResultsByTestCaseId(testCaseId);
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No test case results found for the given test case ID' });
        }
        res.status(200).json({ message: 'Test case results deleted successfully', deletedCount: result.deletedCount });
    } catch (err) {
        console.error('Error deleting test case results:', err);
        res.status(500).json({ message: 'Error deleting test case results', error: err.message });
    }
};
