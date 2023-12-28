const express = require('express');
const router = express.Router();
const testCaseController = require('../controllers/testCaseController');

// POST route to create a new test case
router.post('/add', testCaseController.createTestCase);

// GET route to retrieve a single test case by ID
router.get('/:id', testCaseController.getTestCaseById);

// PUT route to update a test case
router.put('/update/:id', testCaseController.updateTestCase);

// DELETE route to delete a test case
router.delete('/delete/:id', testCaseController.deleteTestCase);

module.exports = router;
