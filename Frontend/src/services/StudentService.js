import api from './api';

// Create a new student
export const createStudent = async (student) => {
	try {
		const response = await api.post('/students', student);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Error creating student';
	}
};

// Get all students
export const getAllStudents = async () => {
	try {
		const response = await api.get('/students');
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Error fetching students';
	}
};

// Get students by program
export const getStudentsByProgram = async (program) => {
	try {
		const encodedProgram = encodeURIComponent(program);
		const response = await api.get(`/students/program/${encodedProgram}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching students by program:', error);
		throw error.response?.data?.message || 'Error fetching students by program';
	}
};

// Update a student
export const updateStudent = async (studentId, student) => {
	try {
		const response = await api.put(`/students/${studentId}`, student);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Error updating student';
	}
};

// Delete a student
export const deleteStudent = async (studentId) => {
	try {
		const response = await api.delete(`/students/${studentId}`);
		return response.data;
	} catch (error) {
		throw error.response?.data?.message || 'Error deleting student';
	}
};
