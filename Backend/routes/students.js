const express = require('express');
const router = express.Router();
const Student = require('../models/student');

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

// Get all students
router.get('/', async (req, res) => {
	try {
		const students = await Student.find();
		res.json(students);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get students by program
router.get('/program/:program', async (req, res) => {
	try {
		const students = await Student.find({ program: req.params.program });
		res.json(students);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update student by studentId
router.put('/:studentId', async (req, res) => {
	try {
		const studentId = req.params.studentId;

		const updatedStudent = await Student.findOneAndUpdate(
			{ studentId },
			req.body
		);

		if (!updatedStudent) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.json(updatedStudent);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Delete student by studentId
router.delete('/:studentId', async (req, res) => {
	try {
		const studentId = req.params.studentId;

		const deletedStudent = await Student.findOneAndDelete({ studentId });

		if (!deletedStudent) {
			return res.status(404).json({ message: 'Student not found' });
		}

		res.json({ message: 'Student deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
