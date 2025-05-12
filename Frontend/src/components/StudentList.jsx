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
			<div className='flex justify-center items-center my-12'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	if (error) {
		return <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4'>Error: {error}</div>;
	}

	return (
		<div className='mt-6'>
			<div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
				<h2 className='text-2xl font-bold text-gray-800 mb-4 md:mb-0'>Student List</h2>
				<div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
					<select
						className='bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
						value={program}
						onChange={handleProgramChange}>
						<option value=''>All Programs</option>
						{programs.map((prog) => (
							<option key={prog} value={prog}>
								{prog}
							</option>
						))}
					</select>
					<Link to='/add-student' className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300'>
						Add New Student
					</Link>
				</div>
			</div>

			{students.length === 0 ? (
				<div className='bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 my-4'>No students found.</div>
			) : (
				<div className='overflow-x-auto shadow-md rounded-lg'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-800 text-white'>
							<tr>
								<th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Student ID</th>
								<th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Name</th>
								<th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Email</th>
								<th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Phone</th>
								<th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Program</th>
								<th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Batch Year</th>
								<th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Actions</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{students.map((student) => (
								<tr key={student._id || student.studentId} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>{student.studentId}</td>
									<td className='px-6 py-4 whitespace-nowrap'>{student.name}</td>
									<td className='px-6 py-4 whitespace-nowrap'>{student.email}</td>
									<td className='px-6 py-4 whitespace-nowrap'>{student.phone}</td>
									<td className='px-6 py-4 whitespace-nowrap'>{student.program}</td>
									<td className='px-6 py-4 whitespace-nowrap'>{student.batchYear}</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<Link
											to={`/edit-student/${student.studentId}`}
											className='bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded mr-2 transition duration-300'>
											Edit
										</Link>
										<button
											className='bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded transition duration-300'
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
