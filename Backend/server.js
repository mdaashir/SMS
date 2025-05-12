const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectToDatabase, closeConnection } = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const studentRoutes = require('./routes/students');
app.use('/api/students', studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start the server
async function startServer() {
	try {
		await connectToDatabase();

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error);
		process.exit(1);
	}
}

startServer();

// Handle Ctrl+C shutdown
process.on('SIGINT', async () => {
	closeConnection();
	process.exit(0);
});
