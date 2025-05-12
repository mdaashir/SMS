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
		const students = await Student.find();
		res.json(students);
	} catch (error) {
		res.status(500).json({ message: error.message });
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
		const students = await Student.find({ program: programRegex });

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

		if (req.body.phone && !/^\+?[\d\s-]{10,}$/.test(req.body.phone)) {
			return res.status(400).json({ message: 'Invalid phone number format' });
		}

		const updatedStudent = await Student.findOneAndUpdate(
			{ studentId },
			req.body
		);

		const result = await Student.findOne({ studentId });
		res.json(result);
	} catch (error) {
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
