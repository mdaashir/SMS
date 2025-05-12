const { getDb } = require('../config/db');

class Student {
	constructor(student) {
		this.studentId = student.studentId;
		this.name = student.name;
		this.email = student.email;
		this.phone = student.phone;
		this.program = student.program;
		this.batchYear = student.batchYear;
		this.createdAt = new Date();
		this.updatedAt = new Date();
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
		} else if (!/^\+?[\d\s-]{10,}$/.test(this.phone)) {
			errors.push(`${this.phone} is not a valid phone number!`);
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
	static async find(query = {}) {
		const db = getDb();
		return await db.collection('students').find(query).toArray();
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

		const result = await db
			.collection('students')
			.findOneAndUpdate(query, { $set: update }, { returnDocument: 'after' });

		return result.value;
	}

	// Delete student
	static async findOneAndDelete(query) {
		const db = getDb();
		const result = await db.collection('students').findOneAndDelete(query);
		return result.value;
	}
}

module.exports = Student;
