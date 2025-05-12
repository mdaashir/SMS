const { MongoClient } = require('mongodb');
require('dotenv').config();

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DBNAME || 'student_management';

let client;
let db;

async function connectToDatabase() {
	if (db) return db;

	try {
		client = new MongoClient(uri);
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

		return db;
	} catch (error) {
		console.error('MongoDB connection error:', error);
		process.exit(1);
	}
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
