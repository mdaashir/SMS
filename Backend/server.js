const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
require('dotenv').config();
const { connectToDatabase, closeConnection } = require('./config/db');
const swaggerUI = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');

const logger = {
	info: (...args) => {
		if (
			process.env.NODE_ENV !== 'production' ||
			process.env.LOG_LEVEL === 'info'
		) {
			console.log(new Date().toISOString(), '-', ...args);
		}
	},
	error: (...args) => console.error(new Date().toISOString(), '-', ...args),
};

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? process.env.ALLOWED_ORIGINS?.split(',') || '*'
				: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	})
);

// Compression middleware
app.use(compression());

// Parse JSON bodies
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.originalUrl}`);
	next();
});

// Swagger documentation
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.get('/api/swagger.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpecs);
});

// Health check endpoint
app.get('/health', async (req, res) => {
	try {
		const db = require('./config/db').getDb();
		const dbStatus = await db.ping();

		res.status(200).json({
			status: 'ok',
			service: 'student-management-api',
			database: dbStatus ? 'connected' : 'disconnected',
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			service: 'student-management-api',
			database: 'disconnected',
			error: error.message,
		});
	}
});

// Routes
const studentRoutes = require('./routes/students');
app.use('/api/students', studentRoutes);

// 404 handler
app.use((req, res) => {
	res.status(404).json({ message: 'Resource not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
	logger.error('Error:', err);

	// Determine appropriate status code
	const statusCode = err.statusCode || 500;

	// Send error response
	res.status(statusCode).json({
		message: err.message || 'Something went wrong!',
		status: 'error',
		...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
	});
});

const PORT = parseInt(process.env.PORT || '5000', 10);

// Connect to MongoDB and start the server
async function startServer() {
	try {
		await connectToDatabase();

		app.listen(PORT, '0.0.0.0', () => {
			logger.info(
				`Server is running on port ${PORT} in ${
					process.env.NODE_ENV || 'development'
				} mode`
			);
		});
	} catch (error) {
		logger.error('Failed to start server:', error);
		process.exit(1);
	}
}

startServer();

// Handle Ctrl+C shutdown
process.on('SIGINT', async () => {
	closeConnection();
	process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
	logger.error('Uncaught Exception:', error);
	closeConnection();
	process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
	closeConnection();
	process.exit(1);
});
