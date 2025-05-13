const { getDb } = require('../config/db');

class Student {
	constructor(student) {
		this.studentId = student.studentId;
		this.name = student.name;
		this.email = student.email;
		this.phone = this.formatPhoneNumber(student.phone);
		this.program = student.program;
		this.batchYear = student.batchYear;
		this.createdAt = new Date();
		this.updatedAt = new Date();
	}

	formatPhoneNumber(phone) {
		if (!phone) return phone;

		// If the phone number doesn't start with +, add +91
		if (!phone.startsWith('+')) {
			const cleanNumber = phone.replace(/^0+/, '');
			return `+91${cleanNumber}`;
		}

		return phone;
	}

	// Validate student data
	validate() {
		const errors = [];

		// Required fields
		if (!this.studentId) errors.push('Student ID is required');
		if (!this.name) errors.push('Name is required');
		if (!this.program) errors.push('Program is required');
		if (!this.batchYear) errors.push('Batch Year is required');

		// Email validation
		if (!this.email) {
			errors.push('Email is required');
		} else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email)) {
			errors.push(`${this.email} is not a valid email address!`);
		}

		// Phone validation
		if (!this.phone) {
			errors.push('Phone is required');
		} else {

			const phoneDigits = this.phone.replace(/\D/g, '');
			if (phoneDigits.length < 10) {
				errors.push(
					`${this.phone} is not a valid phone number - must have at least 10 digits`
				);
			}
		}

		return errors;
	}

	// Save student to database
	async save() {
		const errors = this.validate();
		if (errors.length > 0) {
			throw new Error(errors.join(', '));
		}

		const db = getDb();
		try {
			const result = await db.collection('students').insertOne(this);
			return { _id: result.insertedId, ...this };
		} catch (error) {
			if (error.code === 11000) {
				// Duplicate key error
				throw new Error('Duplicate student ID, email, or phone number');
			}
			throw error;
		}
	}

	// Find all students
	static async find(query = {}, options = {}) {
		const db = getDb();
		try {

			let cursor = db.collection('students').find(query);

			if (options.skip !== undefined) {
				cursor = cursor.skip(options.skip);
			}

			// Apply limit if provided
			if (options.limit !== undefined) {
				cursor = cursor.limit(options.limit);
			}

			// Apply sort if provided
			if (options.sort) {
				cursor = cursor.sort(options.sort);
			}

			const results = await cursor.toArray();
			return results;
		} catch (error) {
			console.error('Error in Student.find:', error);
			return [];
		}
	}

	// Find one student by query
	static async findOne(query) {
		const db = getDb();
		return await db.collection('students').findOne(query);
    }

	// Update student
	static async findOneAndUpdate(query, update) {
		const db = getDb();

		// Add updatedAt field
		update.updatedAt = new Date();

		delete update._id;
		delete update.studentId;

		try {
			const result = await db.collection('students').findOneAndUpdate(
				query,
				{ $set: update },
				{
					returnDocument: 'after',
					upsert: false, // Don't create if doesn't exist
				}
			);

			return result;
		} catch (error) {
			console.error('Error in findOneAndUpdate:', error);
			throw error;
		}
	}

	// Delete student
	static async findOneAndDelete(query) {
		const db = getDb();
		const result = await db.collection('students').findOneAndDelete(query);
		return result;
	}

	static async countDocuments(query = {}) {
		const db = getDb();
		try {
			return await db.collection('students').countDocuments(query);
		} catch (error) {
			console.error('Error counting documents:', error);
			return 0;
		}
	}
}

module.exports = Student;
