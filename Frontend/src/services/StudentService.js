import api from './api';

// Error handling helper
const handleApiError = (error, defaultMessage) => {
	console.error(`API Error: ${defaultMessage}`, error);
	
	if (error.response?.data?.message) {
		throw new Error(error.response.data.message);
	} else if (error.response?.statusText) {
		throw new Error(`${defaultMessage} (${error.response.status}: ${error.response.statusText})`);
	} else if (error.message) {
		throw new Error(error.message);
	} else {
		throw new Error(defaultMessage);
	}
};

// Create a new student
export const createStudent = async (student) => {
	try {
		if (!student) {
			throw new Error('Student data is required');
		}

		const response = await api.post('/students', student);

		if (!response.data) {
			throw new Error('Server returned empty response');
		}

		return response.data;
	} catch (error) {
		handleApiError(error, 'Error creating student');
	}
};

// Get all students
export const getAllStudents = async () => {
	try {
		const response = await api.get('/students');

		if (!response.data || !Array.isArray(response.data)) {
			throw new Error('Invalid response format');
		}

		return response.data;
	} catch (error) {
		handleApiError(error, 'Error fetching students');
	}
};

// Get paginated students
export const getPaginatedStudents = async (page = 1, limit = 10, filters = {}) => {
	try {
		// Validate inputs
		const validPage = Math.max(1, parseInt(page) || 1);
		const validLimit = Math.max(1, parseInt(limit) || 10);

		// Create params safely
		const params = new URLSearchParams();
		params.append('page', validPage);
		params.append('limit', validLimit);

		// Add filters safely
		if (filters && typeof filters === 'object') {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== null && value !== undefined && value !== '') {
					params.append(key, value);
				}
			});
		}

		const response = await api.get(`/students/paginated?${params.toString()}`);

		// Validate response format
		if (!response.data || !Array.isArray(response.data.students)) {
			throw new Error('Invalid response format');
		}

		return response.data;
	} catch (error) {
		handleApiError(error, 'Error fetching students');
	}
};

// Get students stats for dashboard
export const getStudentStats = async () => {
	try {
		const response = await api.get('/students/stats');

		if (!response.data) {
			throw new Error('Invalid response format');
		}

		return response.data;
	} catch (error) {
		handleApiError(error, 'Error fetching student statistics');
	}
};



// Update a student
export const updateStudent = async (studentId, student) => {
	try {
		if (!studentId) {
			throw new Error('Student ID is required');
		}

		if (!student || typeof student !== 'object') {
			throw new Error('Valid student data is required');
		}

		const response = await api.put(`/students/${studentId}`, student);

		if (!response.data) {
			throw new Error('Server returned empty response');
		}

		return response.data;
	} catch (error) {
		handleApiError(error, 'Error updating student');
	}
};

// Delete a student
export const deleteStudent = async (studentId) => {
	try {
		if (!studentId) {
			throw new Error('Student ID is required');
		}

		const response = await api.delete(`/students/${studentId}`);

		if (!response.data) {
			throw new Error('Server returned empty response');
		}

		return response.data;
	} catch (error) {
		handleApiError(error, 'Error deleting student');
	}
};
