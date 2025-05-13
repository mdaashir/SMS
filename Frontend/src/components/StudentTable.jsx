import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from './ThemeContext';
import ReactPaginate from 'react-paginate';

const StudentTable = ({
	students,
	onEdit,
	onDelete,
	currentPage,
	totalPages,
	onPageChange,
	totalItems,
	itemsPerPage,
	showingFrom,
	showingTo,
	onItemsPerPageChange,
}) => {
	const [hoveredRow, setHoveredRow] = useState(null);
	const { darkMode } = useTheme();

	if (students.length === 0) {
		return (
			<div
				className={`${
					darkMode ? 'bg-gray-800 text-gray-200' : 'bg-white'
				} rounded-xl shadow-md p-8 text-center transition-colors duration-200`}>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className={`h-16 w-16 mx-auto ${
						darkMode ? 'text-gray-500' : 'text-gray-400'
					} mb-4`}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
					/>
				</svg>
				<p
					className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>
					No students found. Add your first student!
				</p>
			</div>
		);
	}

	const handlePageClick = (event) => {
		onPageChange(event.selected + 1);
	};

	return (
		<div
			className={`overflow-hidden ${
				darkMode ? 'bg-gray-800' : 'bg-white'
			} rounded-xl shadow-md transition-colors duration-200 mb-20`}>
			<div className='overflow-x-auto'>
				<table
					className={`min-w-full divide-y ${
						darkMode ? 'divide-gray-700' : 'divide-gray-200'
					}`}>
					<thead>
						<tr
							className={
								darkMode
									? 'bg-gray-900'
									: 'bg-gradient-to-r from-gray-50 to-gray-100'
							}>
							<th
								className={`group px-6 py-4 text-left sticky top-0 z-10 bg-opacity-75 backdrop-blur-sm`}>
								<div
									className={`flex items-center text-xs font-medium ${
										darkMode ? 'text-gray-400' : 'text-gray-500'
									} uppercase tracking-wider`}>
									Student ID
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 9l4-4 4 4m0 6l-4 4-4-4'
										/>
									</svg>
								</div>
							</th>
							<th
								className={`group px-6 py-4 text-left sticky top-0 z-10 bg-opacity-75 backdrop-blur-sm`}>
								<div
									className={`flex items-center text-xs font-medium ${
										darkMode ? 'text-gray-400' : 'text-gray-500'
									} uppercase tracking-wider`}>
									Name
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 9l4-4 4 4m0 6l-4 4-4-4'
										/>
									</svg>
								</div>
							</th>
							<th
								className={`group px-6 py-4 text-left sticky top-0 z-10 bg-opacity-75 backdrop-blur-sm`}>
								<div
									className={`flex items-center text-xs font-medium ${
										darkMode ? 'text-gray-400' : 'text-gray-500'
									} uppercase tracking-wider`}>
									Email
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 9l4-4 4 4m0 6l-4 4-4-4'
										/>
									</svg>
								</div>
							</th>
							<th
								className={`group px-6 py-4 text-left sticky top-0 z-10 bg-opacity-75 backdrop-blur-sm`}>
								<div
									className={`flex items-center text-xs font-medium ${
										darkMode ? 'text-gray-400' : 'text-gray-500'
									} uppercase tracking-wider`}>
									Phone
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 9l4-4 4 4m0 6l-4 4-4-4'
										/>
									</svg>
								</div>
							</th>
							<th
								className={`group px-6 py-4 text-left sticky top-0 z-10 bg-opacity-75 backdrop-blur-sm`}>
								<div
									className={`flex items-center text-xs font-medium ${
										darkMode ? 'text-gray-400' : 'text-gray-500'
									} uppercase tracking-wider`}>
									Program
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 9l4-4 4 4m0 6l-4 4-4-4'
										/>
									</svg>
								</div>
							</th>
							<th
								className={`group px-6 py-4 text-left sticky top-0 z-10 bg-opacity-75 backdrop-blur-sm`}>
								<div
									className={`flex items-center text-xs font-medium ${
										darkMode ? 'text-gray-400' : 'text-gray-500'
									} uppercase tracking-wider`}>
									Batch Year
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='ml-1 h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M8 9l4-4 4 4m0 6l-4 4-4-4'
										/>
									</svg>
								</div>
							</th>
							<th
								className={`px-6 py-4 text-right sticky top-0 z-10 bg-opacity-75 backdrop-blur-sm text-xs font-medium ${
									darkMode ? 'text-gray-400' : 'text-gray-500'
								} uppercase tracking-wider`}>
								Actions
							</th>
						</tr>
					</thead>
					<tbody
						className={`${darkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${
							darkMode ? 'divide-gray-700' : 'divide-gray-200'
						}`}>
						{students.map((student, index) => (
							<tr
								key={student.studentId}
								className={`${
									hoveredRow === student.studentId
										? darkMode
											? 'bg-gray-700'
											: 'bg-blue-50'
										: darkMode
										? index % 2 === 0
											? 'bg-gray-800'
											: 'bg-gray-750'
										: index % 2 === 0
										? 'bg-white'
										: 'bg-gray-50'
								} transition-colors duration-150`}
								onMouseEnter={() => setHoveredRow(student.studentId)}
								onMouseLeave={() => setHoveredRow(null)}>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div
											className={`flex-shrink-0 h-10 w-10 rounded-full ${
												darkMode ? 'bg-blue-900' : 'bg-blue-100'
											} flex items-center justify-center`}>
											<span
												className={`text-sm font-semibold ${
													darkMode ? 'text-blue-300' : 'text-blue-600'
												}`}>
												{student.studentId.slice(-2)}
											</span>
										</div>
										<div className='ml-4'>
											<div
												className={`text-sm font-medium ${
													darkMode ? 'text-gray-200' : 'text-gray-900'
												}`}>
												{student.studentId}
											</div>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div
										className={`text-sm font-semibold ${
											darkMode ? 'text-gray-200' : 'text-gray-900'
										}`}>
										{student.name}
									</div>
								</td>
								<td
									className={`px-6 py-4 whitespace-nowrap text-sm ${
										darkMode ? 'text-gray-300' : 'text-gray-600'
									}`}>
									<a
										href={`mailto:${student.email}`}
										className={`${
											darkMode
												? 'text-blue-400 hover:text-blue-300'
												: 'text-blue-600 hover:text-blue-800'
										} hover:underline transition-colors flex items-center group`}>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className={`h-4 w-4 mr-1 ${
												darkMode
													? 'text-gray-500 group-hover:text-blue-400'
													: 'text-gray-400 group-hover:text-blue-500'
											} transition-colors`}
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
											/>
										</svg>
										{student.email}
									</a>
								</td>
								<td
									className={`px-6 py-4 whitespace-nowrap text-sm ${
										darkMode ? 'text-gray-300' : 'text-gray-600'
									}`}>
									<a
										href={`tel:${student.phone}`}
										className={`${
											darkMode
												? 'text-blue-400 hover:text-blue-300'
												: 'text-blue-600 hover:text-blue-800'
										} hover:underline transition-colors flex items-center group`}>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className={`h-4 w-4 mr-1 ${
												darkMode
													? 'text-gray-500 group-hover:text-blue-400'
													: 'text-gray-400 group-hover:text-blue-500'
											} transition-colors`}
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
											/>
										</svg>
										{student.phone}
									</a>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
											darkMode
												? 'bg-blue-900 text-blue-200 border-blue-800'
												: 'bg-blue-100 text-blue-800 border border-blue-200'
										}`}>
										{student.program}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
											darkMode
												? 'bg-gray-700 text-gray-200'
												: 'bg-gray-100 text-gray-800'
										}`}>
										{student.batchYear}
									</span>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
									<div
										className={`flex justify-end space-x-3 transition-opacity duration-200 ${
											hoveredRow === student.studentId
												? 'opacity-100'
												: 'opacity-70'
										}`}>
										<button
											onClick={() => onEdit(student)}
											className={`${
												darkMode
													? 'text-indigo-400 hover:text-indigo-300 bg-indigo-900 hover:bg-indigo-800'
													: 'text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100'
											} rounded-lg px-3 py-1.5 transition-colors flex items-center shadow-sm hover:shadow`}>
											<span className='flex items-center'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-4 w-4 mr-1'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
													/>
												</svg>
												Edit
											</span>
										</button>
										<button
											onClick={() => onDelete(student)}
											className={`${
												darkMode
													? 'text-red-400 hover:text-red-300 bg-red-900 hover:bg-red-800'
													: 'text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100'
											} rounded-lg px-3 py-1.5 transition-colors flex items-center shadow-sm hover:shadow`}>
											<span className='flex items-center'>
												<svg
													xmlns='http://www.w3.org/2000/svg'
													className='h-4 w-4 mr-1'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
													/>
												</svg>
												Delete
											</span>
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Table Footer with Pagination */}
			<div
				className={`${
					darkMode
						? 'bg-gray-900 border-gray-700'
						: 'bg-gray-50 border-gray-200'
				} px-4 py-3 border-t sm:px-6`}>
				<div className='flex flex-wrap items-center justify-between gap-4'>
					<div className='flex items-center gap-3'>
						{/* Items per page selector */}
						<div className='flex items-center gap-2'>
							<span
								className={`text-sm ${
									darkMode ? 'text-gray-400' : 'text-gray-700'
								}`}>
								Show:
							</span>
							<select
								value={itemsPerPage}
								onChange={onItemsPerPageChange}
								className={`h-8 rounded-md border px-2 py-1 text-sm ${
									darkMode
										? 'bg-gray-800 border-gray-700 text-gray-300'
										: 'bg-white border-gray-300 text-gray-700'
								} focus:outline-none focus:ring-1 focus:ring-blue-500`}>
								<option value='5'>5</option>
								<option value='10'>10</option>
								<option value='25'>25</option>
								<option value='50'>50</option>
							</select>
						</div>

						<p
							className={`text-sm ${
								darkMode ? 'text-gray-400' : 'text-gray-700'
							}`}>
							Showing <span className='font-medium'>{showingFrom}</span> to{' '}
							<span className='font-medium'>{showingTo}</span> of{' '}
							<span className='font-medium'>{totalItems}</span> results
						</p>
					</div>

					<ReactPaginate
						previousLabel={
							<div className='flex items-center gap-1'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 19l-7-7 7-7'
									/>
								</svg>
								<span>Previous</span>
							</div>
						}
						nextLabel={
							<div className='flex items-center gap-1'>
								<span>Next</span>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-4 w-4'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 5l7 7-7 7'
									/>
								</svg>
							</div>
						}
						breakLabel='...'
						pageCount={totalPages}
						marginPagesDisplayed={1}
						pageRangeDisplayed={3}
						onPageChange={handlePageClick}
						forcePage={currentPage - 1} // react-paginate uses 0-based indexing
						containerClassName={`flex items-center space-x-1`}
						pageClassName={`h-8 w-8 flex items-center justify-center rounded-md ${
							darkMode
								? 'hover:bg-gray-700 text-gray-300'
								: 'hover:bg-gray-100 text-gray-700'
						}`}
						pageLinkClassName='w-full h-full flex items-center justify-center'
						previousClassName={`px-2 py-1 rounded-md ${
							darkMode
								? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
								: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
						} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
						nextClassName={`px-2 py-1 rounded-md ${
							darkMode
								? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
								: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
						} ${
							currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
						}`}
						breakClassName={`px-2 py-1 ${
							darkMode ? 'text-gray-400' : 'text-gray-700'
						}`}
						activeClassName={`${
							darkMode ? 'bg-blue-800 text-white' : 'bg-blue-600 text-white'
						}`}
						disabledClassName='opacity-50 cursor-not-allowed'
						renderOnZeroPageCount={null}
					/>
				</div>
			</div>
		</div>
	);
};

StudentTable.propTypes = {
	students: PropTypes.array.isRequired,
	onEdit: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
	totalItems: PropTypes.number.isRequired,
	itemsPerPage: PropTypes.number.isRequired,
	showingFrom: PropTypes.number.isRequired,
	showingTo: PropTypes.number.isRequired,
	onItemsPerPageChange: PropTypes.func,
};

export default StudentTable;
