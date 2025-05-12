const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// Create a new student
router.post('/', async (req, res) => {
	try {
		const student = new Student(req.body);
		await student.save();
		res.status(201).json(student);
	} catch (error) {
		if (error.code === 11000) {
			res.status(400).json({ message: 'Duplicate studentId or email' });
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
		const student = await Student.findOneAndUpdate(
			{ studentId: req.params.studentId },
			req.body,
			{ new: true, runValidators: true }
		);
		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}
		res.json(student);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Delete student by studentId
router.delete('/:studentId', async (req, res) => {
	try {
		const student = await Student.findOneAndDelete({
			studentId: req.params.studentId,
		});
		if (!student) {
			return res.status(404).json({ message: 'Student not found' });
		}
		res.json({ message: 'Student deleted successfully' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

module.exports = router;
