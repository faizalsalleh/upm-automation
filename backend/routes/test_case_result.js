const express = require('express');
const router = express.Router();
const testCaseResultController = require('../controllers/testCaseResultController');

// POST route to create a new test case result
router.post('/add', testCaseResultController.createTestCaseResult);

// GET route to retrieve a single test case result by ID
router.get('/:id', testCaseResultController.getTestCaseResultById);

// PUT route to update a test case result
router.put('/update/:id', testCaseResultController.updateTestCaseResult);

// DELETE route to delete a test case result
router.delete('/delete/:id', testCaseResultController.deleteTestCaseResult);

// GET route to retrieve all test case results by test case id
router.get('/for/:testCaseId', testCaseResultController.getAllTestCaseResultsByTestCaseId);

// DELETE route to delete a test case result by test case id
router.delete('/delete/for/:id', testCaseResultController.deleteAllResultsByTestCaseId);

module.exports = router;
