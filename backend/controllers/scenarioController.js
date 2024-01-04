const { MongoClient, ObjectId } = require('mongodb');

// MongoDB URI and client setup
const uri = "mongodb://localhost:27017/automation";
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        return client.db("automation").collection("scenarios");
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

// Create a new scenario
exports.createScenario = async (req, res) => {
    try {
        const scenariosCollection = await connectDB();
        const scenarioData = {
            project_id: new ObjectId(req.body.project_id),
            ...req.body,
            user_id: new ObjectId(req.body.user_id),
            created_at: new Date(),
            updated_at: new Date()
        };
        const result = await scenariosCollection.insertOne(scenarioData);
        res.status(201).json({ message: 'Scenario created successfully', data: result });
    } catch (err) {
      // Check if the error is a duplicate key error
      if (err.code === 11000) {
        res.status(409).json({ message: 'A scenario with this name already exists. Please use a different name.' });
      } else {
        console.error('Error creating scenario:', err);
        res.status(500).json({ message: 'Error creating scenario', error: err.message });
      }
    }
};

// Get a single scenario by ID
exports.getScenarioById = async (req, res) => {
    try {
        const scenariosCollection = await connectDB();
        const id = new ObjectId(req.params.id);
        const scenario = await scenariosCollection.findOne({ _id: id });
        if (!scenario) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        res.status(200).json(scenario);
    } catch (err) {
        console.error('Error retrieving scenario:', err);
        res.status(500).json({ message: 'Error retrieving scenario', error: err.message });
    }
};

// Get all scenarios
// exports.getAllScenarios = async (req, res) => {
//   try {
//     const scenariosCollection = await connectDB();
//     // Sort by 'created_at' field in descending order (-1)
//     const scenarios = await scenariosCollection.find({}).sort({ created_at: -1 }).toArray();
//     res.status(200).json(scenarios);
//   } catch (err) {
//     console.error('Error retrieving scenarios:', err);
//     res.status(500).json({ message: 'Error retrieving scenarios', error: err.message });
//   }
// };

// Get all scenarios for a specific project
exports.getAllScenariosForProject = async (req, res) => {
  try {
      const scenariosCollection = await connectDB();
      const projectId = new ObjectId(req.params.projectId); // Convert string to ObjectId
      console.log('projectId in scenarioController.js:', projectId);

      const scenarios = await scenariosCollection.find({ project_id: req.params.projectId }) // Use projectId as ObjectId
                                                .sort({ created_at: -1 })
                                                .toArray();
      res.status(200).json(scenarios);
  } catch (err) {
      console.error('Error retrieving scenarios:', err);
      res.status(500).json({ message: 'Error retrieving scenarios', error: err.message });
  }
};



// Update a scenario
exports.updateScenario = async (req, res) => {
    try {
        const scenariosCollection = await connectDB();
        const id = new ObjectId(req.params.id);
        const updateData = {
            ...req.body,
            updated_at: new Date()
        };
        const result = await scenariosCollection.updateOne({ _id: id }, { $set: updateData });
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        res.status(200).json({ message: 'Scenario updated successfully' });
    } catch (err) {
        console.error('Error updating scenario:', err);
        res.status(500).json({ message: 'Error updating scenario', error: err.message });
    }
};

// Delete a scenario
exports.deleteScenario = async (req, res) => {
    try {
        const scenariosCollection = await connectDB();
        const id = new ObjectId(req.params.id);
        const result = await scenariosCollection.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Scenario not found' });
        }
        res.status(200).json({ message: 'Scenario deleted successfully' });
    } catch (err) {
        console.error('Error deleting scenario:', err);
        res.status(500).json({ message: 'Error deleting scenario', error: err.message });
    }
};

// Make sure to close the MongoDB client connection when your app stops
process.on('exit', () => {
    client.close();
});
