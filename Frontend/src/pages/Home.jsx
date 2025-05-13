import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../components/ThemeContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStudentStats } from '../services/StudentService';

const Home = () => {
	const { darkMode } = useTheme();
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState({
		totalStudents: 0,
		programCounts: {},
		batchYearCounts: {},
	});

	useEffect(() => {
		fetchStats();
	}, []);

	const fetchStats = async () => {
		setLoading(true);
		try {
			const data = await getStudentStats();
			setStats(data);
		} catch (error) {
			console.error('Error fetching statistics:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='container mx-auto px-4 py-8'>
			{/* Hero Section */}
			<div className='bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 mb-10 text-white'>
				<div className='max-w-3xl mx-auto text-center'>
					<h1 className='text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-md'>
						Student Management System
					</h1>
					<p className='text-xl text-blue-100 mb-8'>
						Efficiently manage student records with our comprehensive platform
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-4'>
						<Link
							to='/students'
							className='bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 hover:scale-105'>
							Browse Students
						</Link>
						<Link
							to='/students'
							className='bg-blue-500 bg-opacity-30 hover:bg-opacity-40 text-white border border-blue-300 px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-200 hover:scale-105'>
							Add New Student
						</Link>
					</div>
				</div>
			</div>

			{loading ? (
				<div className='flex justify-center items-center py-20'>
					<LoadingSpinner size='lg' />
				</div>
			) : (
				<>
					{/* Dashboard Cards */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-10'>
						<div
							className={`${
								darkMode
									? 'bg-gray-800 border-blue-600'
									: 'bg-white border-blue-500'
							} rounded-xl shadow-md p-6 border-t-4 hover:shadow-lg transition-shadow duration-300`}>
							<div className='flex items-center justify-between'>
								<div>
									<p
										className={`${
											darkMode ? 'text-gray-400' : 'text-gray-500'
										} text-sm uppercase tracking-wider font-medium`}>
										Total Students
									</p>
									<h2
										className={`text-3xl font-bold ${
											darkMode ? 'text-gray-100' : 'text-gray-800'
										} mt-1`}>
										{stats.totalStudents}
									</h2>
								</div>
								<div
									className={`${
										darkMode ? 'bg-blue-900' : 'bg-blue-100'
									} p-3 rounded-full`}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className={`h-8 w-8 ${
											darkMode ? 'text-blue-400' : 'text-blue-600'
										}`}
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
								</div>
							</div>
							<div className='mt-4'>
								<Link
									to='/students'
									className={`${
										darkMode
											? 'text-blue-400 hover:text-blue-300'
											: 'text-blue-600 hover:text-blue-800'
									} text-sm inline-flex items-center`}>
									View all students
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-4 w-4 ml-1'
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
								</Link>
							</div>
						</div>

						<div
							className={`${
								darkMode
									? 'bg-gray-800 border-green-600'
									: 'bg-white border-green-500'
							} rounded-xl shadow-md p-6 border-t-4 hover:shadow-lg transition-shadow duration-300`}>
							<div className='flex items-center justify-between'>
								<div>
									<p
										className={`${
											darkMode ? 'text-gray-400' : 'text-gray-500'
										} text-sm uppercase tracking-wider font-medium`}>
										Programs Offered
									</p>
									<h2
										className={`text-3xl font-bold ${
											darkMode ? 'text-gray-100' : 'text-gray-800'
										} mt-1`}>
										{Object.keys(stats.programCounts).length}
									</h2>
								</div>
								<div
									className={`${
										darkMode ? 'bg-green-900' : 'bg-green-100'
									} p-3 rounded-full`}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className={`h-8 w-8 ${
											darkMode ? 'text-green-400' : 'text-green-600'
										}`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={1.5}
											d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
										/>
									</svg>
								</div>
							</div>
							<div className='mt-4 grid grid-cols-2 gap-2'>
								{Object.keys(stats.programCounts)
									.slice(0, 4)
									.map((program) => (
										<span
											key={program}
											className={`text-xs ${
												darkMode
													? 'bg-gray-700 text-gray-300'
													: 'bg-gray-100 text-gray-800'
											} px-2 py-1 rounded truncate`}>
											{program}
										</span>
									))}
								{Object.keys(stats.programCounts).length > 4 && (
									<span
										className={`text-xs ${
											darkMode
												? 'bg-gray-700 text-blue-400'
												: 'bg-gray-100 text-blue-600'
										} px-2 py-1 rounded`}>
										+{Object.keys(stats.programCounts).length - 4} more
									</span>
								)}
							</div>
						</div>

						<div
							className={`${
								darkMode
									? 'bg-gray-800 border-purple-500'
									: 'bg-white border-purple-500'
							} rounded-xl shadow-md p-6 border-t-4 hover:shadow-lg transition-shadow duration-300`}>
							<div className='flex items-center justify-between'>
								<div>
									<p
										className={`${
											darkMode ? 'text-gray-400' : 'text-gray-500'
										} text-sm uppercase tracking-wider font-medium`}>
										Batch Years
									</p>
									<h2
										className={`text-3xl font-bold ${
											darkMode ? 'text-gray-100' : 'text-gray-800'
										} mt-1`}>
										{Object.keys(stats.batchYearCounts).length}
									</h2>
								</div>
								<div
									className={`${
										darkMode ? 'bg-purple-900' : 'bg-purple-100'
									} p-3 rounded-full`}>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className={`h-8 w-8 ${
											darkMode ? 'text-purple-400' : 'text-purple-600'
										}`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={1.5}
											d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
										/>
									</svg>
								</div>
							</div>
							<div className='mt-4 flex flex-wrap gap-2'>
								{Object.keys(stats.batchYearCounts)
									.sort()
									.map((year) => (
										<span
											key={year}
											className={`text-sm font-medium ${
												darkMode
													? 'bg-purple-900 text-purple-300'
													: 'bg-purple-100 text-purple-800'
											} px-3 py-1 rounded-full`}>
											{year}
										</span>
									))}
							</div>
						</div>
					</div>

					{/* Program Distribution */}
					<div
						className={`${
							darkMode ? 'bg-gray-800' : 'bg-white'
						} rounded-xl shadow-md p-6 mb-10 hover:shadow-lg transition-shadow duration-300`}>
						<h2
							className={`text-2xl font-bold ${
								darkMode ? 'text-gray-100' : 'text-gray-800'
							} mb-6 flex items-center`}>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className={`h-6 w-6 mr-2 ${
									darkMode ? 'text-blue-400' : 'text-blue-600'
								}`}
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
								/>
							</svg>
							Program Distribution
						</h2>
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
							{Object.entries(stats.programCounts).map(([program, count]) => (
								<div
									key={program}
									className={`${
										darkMode
											? 'border-gray-700 hover:bg-gray-750'
											: 'border hover:shadow-md'
									} rounded-lg p-4 transition-shadow duration-200`}>
									<div className='flex justify-between items-center mb-2'>
										<h3
											className={`font-semibold ${
												darkMode ? 'text-gray-200' : 'text-gray-800'
											}`}>
											{program}
										</h3>
										<span
											className={`${
												darkMode
													? 'bg-blue-900 text-blue-300'
													: 'bg-blue-100 text-blue-800'
											} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
											{count} {count === 1 ? 'student' : 'students'}
										</span>
									</div>
									<div className='w-full'>
										<div
											className={`h-2 ${
												darkMode ? 'bg-gray-700' : 'bg-gray-200'
											} rounded-full`}>
											<div
												className={`h-2 ${
													darkMode ? 'bg-blue-500' : 'bg-blue-600'
												} rounded-full`}
												style={{
													width: `${(count / stats.totalStudents) * 100}%`,
												}}></div>
										</div>
										<p
											className={`text-xs ${
												darkMode ? 'text-gray-400' : 'text-gray-500'
											} mt-1`}>
											{Math.round((count / stats.totalStudents) * 100)}% of
											total
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</>
			)}

			{/* Footer CTA */}
			<div className='bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl shadow-xl p-8 text-center text-white'>
				<div className='max-w-3xl mx-auto'>
					<h2 className='text-3xl font-bold mb-4'>Ready to get started?</h2>
					<p className='text-lg text-blue-100 mb-6'>
						Manage your students efficiently with our powerful tools and
						intuitive interface
					</p>
					<Link
						to='/students'
						className='inline-block bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium shadow-md transition-all duration-200 hover:scale-105'>
						Explore Students
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;
