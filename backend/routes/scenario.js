const express = require('express');
const router = express.Router();
const scenariosController = require('../controllers/scenarioController');

// POST route to create a new scenario
router.post('/add', scenariosController.createScenario);

// GET route to retrieve all scenarios for a project
router.get('/:projectId', scenariosController.getAllScenariosForProject);

// GET route to retrieve a single scenario by ID
router.get('/:id', scenariosController.getScenarioById);

// PUT route to update a scenario
router.put('/update/:id', scenariosController.updateScenario);

// DELETE route to delete a scenario
router.delete('/delete/:id', scenariosController.deleteScenario);

module.exports = router;
