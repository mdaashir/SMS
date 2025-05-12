import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../services/StudentService';

function AddStudent() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		studentId: '',
		name: '',
		email: '',
		phone: '',
		program: '',
		batchYear: '',
	});
	const [error, setError] = useState(null);
	const [submitting, setSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const validateForm = () => {
		const errors = {};

		if (!formData.studentId.trim()) errors.studentId = 'Student ID is required';
		if (!formData.name.trim()) errors.name = 'Name is required';

		if (!formData.email.trim()) {
			errors.email = 'Email is required';
		} else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
			errors.email = 'Invalid email format';
		}

		if (!formData.phone.trim()) {
			errors.phone = 'Phone is required';
		} else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
			errors.phone = 'Invalid phone format';
		}

		if (!formData.program.trim()) errors.program = 'Program is required';

		if (!formData.batchYear) {
			errors.batchYear = 'Batch Year is required';
		} else if (
			isNaN(formData.batchYear) ||
			parseInt(formData.batchYear) < 2000
		) {
			errors.batchYear = 'Invalid batch year';
		}

		return Object.keys(errors).length === 0 ? null : errors;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const errors = validateForm();
		if (errors) {
			setError(errors);
			return;
		}

		setSubmitting(true);
		setError(null);

		try {
			// Convert batchYear to number
			const studentData = {
				...formData,
				batchYear: parseInt(formData.batchYear),
			};

			await createStudent(studentData);
			navigate('/students');
		} catch (error) {
			setError({ general: error.toString() });
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className='container mt-4'>
			<div className='row'>
				<div className='col-md-8 offset-md-2'>
					<div className='card'>
						<div className='card-header bg-primary text-white'>
							<h3 className='mb-0'>Add New Student</h3>
						</div>
						<div className='card-body'>
							{error?.general && (
								<div className='alert alert-danger'>{error.general}</div>
							)}

							<form onSubmit={handleSubmit}>
								<div className='mb-3'>
									<label htmlFor='studentId' className='form-label'>
										Student ID *
									</label>
									<input
										type='text'
										className={`form-control ${
											error?.studentId ? 'is-invalid' : ''
										}`}
										id='studentId'
										name='studentId'
										value={formData.studentId}
										onChange={handleChange}
										placeholder='Enter student ID'
									/>
									{error?.studentId && (
										<div className='invalid-feedback'>{error.studentId}</div>
									)}
								</div>

								<div className='mb-3'>
									<label htmlFor='name' className='form-label'>
										Name *
									</label>
									<input
										type='text'
										className={`form-control ${
											error?.name ? 'is-invalid' : ''
										}`}
										id='name'
										name='name'
										value={formData.name}
										onChange={handleChange}
										placeholder='Enter full name'
									/>
									{error?.name && (
										<div className='invalid-feedback'>{error.name}</div>
									)}
								</div>

								<div className='mb-3'>
									<label htmlFor='email' className='form-label'>
										Email *
									</label>
									<input
										type='email'
										className={`form-control ${
											error?.email ? 'is-invalid' : ''
										}`}
										id='email'
										name='email'
										value={formData.email}
										onChange={handleChange}
										placeholder='Enter email address'
									/>
									{error?.email && (
										<div className='invalid-feedback'>{error.email}</div>
									)}
								</div>

								<div className='mb-3'>
									<label htmlFor='phone' className='form-label'>
										Phone *
									</label>
									<input
										type='text'
										className={`form-control ${
											error?.phone ? 'is-invalid' : ''
										}`}
										id='phone'
										name='phone'
										value={formData.phone}
										onChange={handleChange}
										placeholder='Enter phone number'
									/>
									{error?.phone && (
										<div className='invalid-feedback'>{error.phone}</div>
									)}
								</div>

								<div className='mb-3'>
									<label htmlFor='program' className='form-label'>
										Program *
									</label>
									<input
										type='text'
										className={`form-control ${
											error?.program ? 'is-invalid' : ''
										}`}
										id='program'
										name='program'
										value={formData.program}
										onChange={handleChange}
										placeholder='Enter program name'
									/>
									{error?.program && (
										<div className='invalid-feedback'>{error.program}</div>
									)}
								</div>

								<div className='mb-3'>
									<label htmlFor='batchYear' className='form-label'>
										Batch Year *
									</label>
									<input
										type='number'
										className={`form-control ${
											error?.batchYear ? 'is-invalid' : ''
										}`}
										id='batchYear'
										name='batchYear'
										value={formData.batchYear}
										onChange={handleChange}
										placeholder='Enter batch year'
										min='2000'
									/>
									{error?.batchYear && (
										<div className='invalid-feedback'>{error.batchYear}</div>
									)}
								</div>

								<div className='d-grid gap-2 d-md-flex justify-content-md-end'>
									<button
										type='button'
										className='btn btn-secondary me-md-2'
										onClick={() => navigate('/students')}>
										Cancel
									</button>
									<button
										type='submit'
										className='btn btn-primary'
										disabled={submitting}>
										{submitting ? (
											<>
												<span
													className='spinner-border spinner-border-sm me-1'
													role='status'
													aria-hidden='true'></span>
												Saving...
											</>
										) : (
											'Save Student'
										)}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddStudent;
