const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Get Avg Response Time Bar Chart
router.get('/getAvgResponseTimeBarChart/:id', dashboardController.getAvgResponseTimeBarChart);

// Route to get test cases by scenario ID
router.get('/testcases/:id', dashboardController.getTestCasesByScenario);


module.exports = router;
