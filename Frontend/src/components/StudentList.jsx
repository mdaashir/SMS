import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	getAllStudents,
	deleteStudent,
	getStudentsByProgram,
} from '../services/StudentService';

function StudentList() {
	const [students, setStudents] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [program, setProgram] = useState('');
	const [programs, setPrograms] = useState([]);

	useEffect(() => {
		fetchStudents();
	}, []);

	const fetchStudents = async () => {
		setLoading(true);
		try {
			const data = await getAllStudents();
			setStudents(data);

			// Extract unique programs for filter dropdown
			const uniquePrograms = [
				...new Set(data.map((student) => student.program)),
			];
			setPrograms(uniquePrograms);

			setError(null);
		} catch (err) {
			setError(err.toString());
			setStudents([]);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (studentId) => {
		if (window.confirm('Are you sure you want to delete this student?')) {
			try {
				await deleteStudent(studentId);
				await fetchStudents();
			} catch (err) {
				setError(err.toString());
			}
		}
	};

	const handleProgramChange = async (e) => {
		const selectedProgram = e.target.value;
		setProgram(selectedProgram);

		setLoading(true);
		try {
			let data;
			if (selectedProgram) {
				data = await getStudentsByProgram(selectedProgram);
			} else {
				data = await getAllStudents();
			}
			setStudents(data);
			setError(null);
		} catch (err) {
			setError(err.toString());
			setStudents([]);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='text-center my-5'>
				<div className='spinner-border' role='status'></div>
			</div>
		);
	}

	if (error) {
		return <div className='alert alert-danger my-3'>Error: {error}</div>;
	}

	return (
		<div className='container mt-4'>
			<div className='row mb-4'>
				<div className='col-md-6'>
					<h2>Student List</h2>
				</div>
				<div className='col-md-6 text-end'>
					<div className='d-flex justify-content-end'>
						<div className='me-3'>
							<select
								className='form-select'
								value={program}
								onChange={handleProgramChange}>
								<option value=''>All Programs</option>
								{programs.map((prog) => (
									<option key={prog} value={prog}>
										{prog}
									</option>
								))}
							</select>
						</div>
						<Link to='/add-student' className='btn btn-primary'>
							Add New Student
						</Link>
					</div>
				</div>
			</div>

			{students.length === 0 ? (
				<div className='alert alert-info'>No students found.</div>
			) : (
				<div className='table-responsive'>
					<table className='table table-striped table-hover'>
						<thead className='table-dark'>
							<tr>
								<th>Student ID</th>
								<th>Name</th>
								<th>Email</th>
								<th>Phone</th>
								<th>Program</th>
								<th>Batch Year</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{students.map((student) => (
								<tr key={student._id || student.studentId}>
									<td>{student.studentId}</td>
									<td>{student.name}</td>
									<td>{student.email}</td>
									<td>{student.phone}</td>
									<td>{student.program}</td>
									<td>{student.batchYear}</td>
									<td>
										<Link
											to={`/edit-student/${student.studentId}`}
											className='btn btn-sm btn-warning me-2'>
											Edit
										</Link>
										<button
											className='btn btn-sm btn-danger'
											onClick={() => handleDelete(student.studentId)}>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default StudentList;
