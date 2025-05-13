const { MongoClient } = require('mongodb');
require('dotenv').config();

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DBNAME || 'student_management';

// Connection options for production
const options = {
	maxPoolSize: 50,
	wtimeoutMS: 2500,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverSelectionTimeoutMS: 5000,
	socketTimeoutMS: 45000,
	connectTimeoutMS: 10000,
};

let client;
let db;

async function connectToDatabase() {
	if (db) return db;

	const MAX_RETRIES = 5;
	let retries = 0;
	let lastError;

	while (retries < MAX_RETRIES) {
		try {
			client = new MongoClient(uri, options);
			await client.connect();
			console.log('Connected to MongoDB');

			db = client.db(dbName);

			// Create indexes for unique fields
			const studentCollection = db.collection('students');
			await studentCollection.createIndexes([
				{ key: { studentId: 1 }, unique: true },
				{ key: { email: 1 }, unique: true },
				{ key: { phone: 1 }, unique: true },
			]);

			// Add health check method
			db.ping = async () => {
				try {
					await db.command({ ping: 1 });
					return true;
				} catch (error) {
					console.error('Database ping failed:', error);
					return false;
				}
			};

			return db;
		} catch (error) {
			lastError = error;
			retries++;
			console.error(`MongoDB connection attempt ${retries} failed:`, error);

			if (retries >= MAX_RETRIES) {
				console.error('Max retries reached. Could not connect to MongoDB');
				break;
			}

			// Wait before retrying
			const delay = Math.min(1000 * Math.pow(2, retries), 10000);
			await new Promise(resolve => setTimeout(resolve, delay));
		}
	}

	console.error('Failed to connect to MongoDB after multiple attempts');
	throw lastError;
}

function getDb() {
	if (!db) {
		throw new Error(
			'Database not initialized. Call connectToDatabase() first.'
		);
	}
	return db;
}

function closeConnection() {
	if (client) {
		client.close();
		console.log('MongoDB connection closed');
	}
}

module.exports = {
	connectToDatabase,
	getDb,
	closeConnection,
};
