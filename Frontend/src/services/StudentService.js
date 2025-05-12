import axios from 'axios';

const API_URL = 'http://localhost:5000/api/students';

// Create a new student
export const createStudent = async (student) => {
	try {
		const response = await axios.post(API_URL, student);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Error creating student';
	}
};

// Get all students
export const getAllStudents = async () => {
	try {
		const response = await axios.get(API_URL);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Error fetching students';
	}
};

// Get students by program
export const getStudentsByProgram = async (program) => {
	try {
		const encodedProgram = encodeURIComponent(program);
		const response = await axios.get(`${API_URL}/program/${encodedProgram}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching students by program:', error);
		throw error.response?.data?.message || 'Error fetching students by program';
	}
};

// Update a student
export const updateStudent = async (studentId, student) => {
	try {
		const response = await axios.put(`${API_URL}/${studentId}`, student);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Error updating student';
	}
};

// Delete a student
export const deleteStudent = async (studentId) => {
	try {
		const response = await axios.delete(`${API_URL}/${studentId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Error deleting student';
	}
};
