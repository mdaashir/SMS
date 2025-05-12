const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
	{
		studentId: {
			type: String,
			required: true,
			unique: true,
		},
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: function (v) {
					return /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
				},
				message: (props) => `${props.value} is not a valid email address!`,
			},
		},
		phone: {
			type: String,
			required: true,
			unique: true,
			validate: {
				validator: function (v) {
					return /^\+?[\d\s-]{10,}$/.test(v);
				},
				message: (props) => `${props.value} is not a valid phone number!`,
			},
		},
		program: {
			type: String,
			required: true,
		},
		batchYear: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model('Student', studentSchema);
