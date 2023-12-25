const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const scenariosController = require('../controllers/scenarioController');

// POST route to create a new project
router.post('/add', projectController.createProject);

// GET route to retrieve all projects
router.get('/', projectController.getAllProjects);

// GET route to retrieve a single project by ID
router.get('/:id', projectController.getProjectById);

// PUT route to update a project
router.put('/update/:id', projectController.updateProject);

// DELETE route to delete a project
router.delete('/delete/:id', projectController.deleteProject);

// GET route to retrieve all scenarios for a project
router.get('/scenario/:projectId', scenariosController.getAllScenariosForProject);

module.exports = router;
