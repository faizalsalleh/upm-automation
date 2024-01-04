const { MongoClient, ObjectId } = require('mongodb');

// MongoDB URI and client setup
const uri = "mongodb://localhost:27017/automation";
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        return client.db("automation").collection("projects");
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

// Create a new project
exports.createProject = async (req, res) => {
  try {
    const projectsCollection = await connectDB();
    const projectData = {
        ...req.body,
        user_id: new ObjectId(req.body.user_id),
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
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projectsCollection = await connectDB();
    // Sort by 'created_at' field in descending order (-1)
    const projects = await projectsCollection.find({}).sort({ created_at: -1 }).toArray();
    res.status(200).json(projects);
  } catch (err) {
    console.error('Error retrieving projects:', err);
    res.status(500).json({ message: 'Error retrieving projects', error: err.message });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  const projectId = req.params.id;

  // Check if projectId is a valid ObjectId
  if (!ObjectId.isValid(projectId)) {
    return res.status(400).json({ message: 'Invalid project ID' });
  }

  try {
    const projectsCollection = await connectDB();
    const project = await projectsCollection.findOne({ _id: new ObjectId(projectId) });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error('Error retrieving project:', err);
    res.status(500).json({ message: 'Error retrieving project', error: err.message });
  }
};

// Update a project
exports.updateProject = async (req, res) => {
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
};

// Delete a project
exports.deleteProject = async (req, res) => {
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
};

// Close MongoDB client connection when app stops
process.on('exit', () => {
    client.close();
});
