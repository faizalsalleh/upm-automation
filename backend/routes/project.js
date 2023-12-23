const express = require('express');
const router = express.Router();
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB URI
const uri = "mongodb://localhost:27017/automation";

// Create a new MongoClient
const client = new MongoClient(uri);

async function connectDB() {
  try {
      await client.connect();
  } catch (err) {
      console.error('Error connecting to MongoDB:', err);
      throw err; // Rethrow the error to handle it in the calling function
  }
  return client.db("automation").collection("projects");
}

//user_id: req.user.userId,
// POST route to create a new project
router.post('/add', async (req, res) => {
  try {
      const projectsCollection = await connectDB();
      const projectData = {
          ...req.body,
          user_id: "658733068fd542d8d32afffe", // Dummy user ID
          created_at: new Date(),
          updated_at: new Date()
      };
      const result = await projectsCollection.insertOne(projectData);
      res.status(201).json({ message: 'Project created successfully', data: result });
  } catch (err) {
      // Check if the error is a duplicate key error
      if (err.code === 11000) {
        res.status(409).json({ message: 'A project with this name already exists. Please use a different name.' });
    } else {
        console.error('Error creating project:', err);
        res.status(500).json({ message: 'Error creating project', error: err.message });
    }
  }
});

// GET route to retrieve all projects
router.get('/', async (req, res) => {
    try {
        const projectsCollection = await connectDB();
        const projects = await projectsCollection.find({}).toArray();
        res.status(200).json(projects);
    } catch (err) {
        console.error('Error retrieving projects:', err);
        res.status(500).json({ message: 'Error retrieving projects', error: err.message });
    }
});


// GET route to retrieve a single project by ID
router.get('/:id', async (req, res) => {
    try {
        const projectsCollection = await connectDB();
        const id = req.params.id;
        const project = await projectsCollection.findOne({ _id: new ObjectId(id) });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (err) {
        console.error('Error retrieving project:', err);
        res.status(500).json({ message: 'Error retrieving project', error: err.message });
    }
});

// PUT route to update a project
router.put('/update/:id', async (req, res) => {
  try {
      const projectsCollection = await connectDB();
      const id = req.params.id;
      const updateData = {
          ...req.body,
          updated_at: new Date() // Update the updated_at field
      };
      const result = await projectsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
      if (result.matchedCount === 0) {
          return res.status(404).json({ message: 'Project not found' });
      }
      res.status(200).json({ message: 'Project updated successfully' });
  } catch (err) {
      console.error('Error updating project:', err);
      res.status(500).json({ message: 'Error updating project', error: err.message });
  }
});

// DELETE route to delete a project
router.delete('/delete/:id', async (req, res) => {
    try {
        const projectsCollection = await connectDB();
        const id = req.params.id;
        const result = await projectsCollection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err);
        res.status(500).json({ message: 'Error deleting project', error: err.message });
    }
});

module.exports = router;
