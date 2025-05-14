const swaggerJsdoc = require('swagger-jsdoc');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Student Management System API',
			version: '1.0.0',
			description: 'A simple API for managing student records',
			contact: {
				name: 'mdaashir',
				email: 's.mohamedaashir@gmail.com',
			},
		},
		servers: [
			{
				url: 'http://localhost:5000',
				description: 'Development server',
			},
		],
		components: {
			schemas: {
				Student: {
					type: 'object',
					required: [
						'studentId',
						'name',
						'email',
						'phone',
						'program',
						'batchYear',
					],
					properties: {
						studentId: {
							type: 'string',
							description: 'The unique identifier for the student',
							example: 'ST12345',
						},
						name: {
							type: 'string',
							description: 'The name of the student',
							example: 'John Doe',
						},
						email: {
							type: 'string',
							description: 'The email address of the student',
							example: 'john@example.com',
						},
						phone: {
							type: 'string',
							description: 'The phone number of the student',
							example: '+1234567890',
						},
						program: {
							type: 'string',
							description: 'The program the student is enrolled in',
							example: 'Computer Science',
						},
						batchYear: {
							type: 'number',
							description: 'The batch year of the student',
							example: 2023,
						},
						createdAt: {
							type: 'string',
							format: 'date-time',
							description: 'Timestamp when the record was created',
						},
						updatedAt: {
							type: 'string',
							format: 'date-time',
							description: 'Timestamp when the record was last updated',
						},
					},
				},
				Error: {
					type: 'object',
					properties: {
						message: {
							type: 'string',
							description: 'Error message',
							example: 'Student not found',
						},
					},
				},
			},
		},
	},
	apis: ['./routes/*.js'], // Path to the API routes files
};

const specs = swaggerJsdoc(options);

module.exports = specs;
