const express = require('express');
const router = express.Router();
const Student = require('../models/student');

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management API endpoints
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     description: Add a new student record to the database
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Create a new student
router.post('/', async (req, res) => {
	try {
		const student = new Student(req.body);
		const savedStudent = await student.save();
		res.status(201).json(savedStudent);
	} catch (error) {
		if (error.message && error.message.includes('Duplicate')) {
			res.status(400).json({ message: error.message });
		} else {
			res.status(400).json({ message: error.message });
		}
	}
});

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     description: Retrieve a list of all student records
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get all students
router.get('/', async (req, res) => {
	try {
		const students = await Student.find({}, {
			sort: { studentId: 1 }
		});
		res.json(students);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

/**
 * @swagger
 * /api/students/paginated:
 *   get:
 *     summary: Get paginated students
 *     description: Retrieve a paginated list of students with optional filtering
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: program
 *         schema:
 *           type: string
 *         description: Filter by program
 *       - in: query
 *         name: batchYear
 *         schema:
 *           type: string
 *         description: Filter by batch year
 *     responses:
 *       200:
 *         description: Paginated list of students
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get paginated students with filters
router.get('/paginated', async (req, res) => {
	try {
		// Parse and validate query parameters
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.max(1, Math.min(50, parseInt(req.query.limit) || 10));
		const skip = (page - 1) * limit;

		const filter = {};
		if (req.query.program) {
			filter.program = req.query.program;
		}
		if (req.query.batchYear) {
			filter.batchYear = req.query.batchYear;
		}

		console.log('Pagination request:', { page, limit, skip, filter });

		// Get total count
		const totalItems = await Student.countDocuments(filter);
		console.log('Total items counted:', totalItems);

		// Execute query with pagination
		const students = await Student.find(filter, {
			skip: skip,
			limit: limit,
			sort: { studentId: 1 }
		});

		// Calculate total pages
		const totalPages = Math.max(1, Math.ceil(totalItems / limit));

		res.json({
			students: students || [],
			totalItems,
			totalPages,
			currentPage: page
		});
	} catch (error) {
		res.status(500).json({ message: error.message || 'An error occurred while fetching students' });
	}
});

/**
 * @swagger
 * /api/students/stats:
 *   get:
 *     summary: Get student statistics
 *     description: Retrieve statistics about students including counts by program and batch year
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Student statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStudents:
 *                   type: integer
 *                 programCounts:
 *                   type: object
 *                 batchYearCounts:
 *                   type: object
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get student statistics
router.get('/stats', async (req, res) => {
	try {
		// Get total count
		const totalStudents = await Student.countDocuments();

		// Use aggregation for program counts
		const db = require('../config/db').getDb();
		const programAggregation = await db.collection('students').aggregate([
			{ $group: { _id: "$program", count: { $sum: 1 } } },
			{ $sort: { _id: 1 } }
		]).toArray();

		const programCounts = {};
		programAggregation.forEach(item => {
			if (item._id) {
				programCounts[item._id] = item.count;
			}
		});

		// Use aggregation for batch year counts
		const batchYearAggregation = await db.collection('students').aggregate([
			{ $group: { _id: "$batchYear", count: { $sum: 1 } } },
			{ $sort: { _id: 1 } }
		]).toArray();

		const batchYearCounts = {};
		batchYearAggregation.forEach(item => {
			if (item._id) {
				batchYearCounts[item._id] = item.count;
			}
		});

		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

		const recentEnrollments = await Student.countDocuments({
			createdAt: { $gte: thirtyDaysAgo }
		});

		res.json({
			totalStudents,
			programCounts,
			batchYearCounts,
			recentEnrollments
		});
	} catch (error) {
		console.error('Error in student stats endpoint:', error);
		res.status(500).json({ message: error.message || 'An error occurred while fetching statistics' });
	}
});

/**
 * @swagger
 * /api/students/program/{program}:
 *   get:
 *     summary: Get students by program
 *     description: Retrieve a list of students filtered by their program
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: program
 *         schema:
 *           type: string
 *         required: true
 *         description: Program name to filter students by
 *     responses:
 *       200:
 *         description: A list of students in the specified program
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Get students by program
router.get('/program/:program', async (req, res) => {
	try {
		const programRegex = new RegExp(req.params.program, 'i');
		const students = await Student.find({ program: programRegex }, {
			sort: { studentId: 1 }
		});

		if (!students || students.length === 0) {
			return res.json([]); // Return empty array instead of 404 for better frontend handling
		}

		res.json(students);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

/**
 * @swagger
 * /api/students/{studentId}:
 *   put:
 *     summary: Update student by ID
 *     description: Update an existing student record by student ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the student to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Bad request - validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Update student by studentId
router.put('/:studentId', async (req, res) => {
	try {
		const studentId = req.params.studentId;

		const existingStudent = await Student.findOne({ studentId });
		if (!existingStudent) {
			return res.status(404).json({ message: 'Student not found' });
		}

		if (
			req.body.email &&
			!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.email)
		) {
			return res.status(400).json({ message: 'Invalid email format' });
		}

		// Format phone number if provided
		if (req.body.phone) {
			// Apply the same phone formatting logic
			if (!req.body.phone.startsWith('+')) {
				const cleanNumber = req.body.phone.replace(/^0+/, '');
				req.body.phone = `+91${cleanNumber}`;
			}

			// Validate phone number
			const phoneDigits = req.body.phone.replace(/\D/g, '');
			if (phoneDigits.length < 10) {
				return res.status(400).json({ message: 'Invalid phone number format - must have at least 10 digits' });
			}
		}

		// Create a clean update object without _id
		const updateData = { ...req.body };
		delete updateData._id; // Remove _id to prevent immutable field error
		await Student.findOneAndUpdate(
			{ studentId },
			updateData
		);
		const result = await Student.findOne({ studentId });
		res.json(result);
	} catch (error) {
		console.error('Error updating student:', error);
		res.status(400).json({ message: error.message });
	}
});

/**
 * @swagger
 * /api/students/{studentId}:
 *   delete:
 *     summary: Delete student by ID
 *     description: Delete a student record by student ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: studentId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the student to delete
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Student not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// Delete student by studentId
router.delete('/:studentId', async (req, res) => {
	try {
		const studentId = req.params.studentId;

		const existingStudent = await Student.findOne({ studentId });
		if (!existingStudent) {
			return res.status(404).json({ message: 'Student not found' });
		}

		await Student.findOneAndDelete({ studentId });
		res.json({ message: 'Student deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
