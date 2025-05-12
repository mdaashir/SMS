import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

function Home() {
	const handleStudentClick = () => {
		toast.success('Navigating to Students page');
	};

	return (
		<div className='max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8'>
			<div className='text-center'>
				<h1 className='text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl'>
					Student Management System
				</h1>
				<p className='mt-5 text-xl text-gray-500'>
					A comprehensive solution for managing student records with easy
					access and maintenance.
				</p>
				<hr className='my-8 border-gray-200' />
				<p className='text-lg text-gray-600'>
					This system allows you to view and manage student information efficiently.
				</p>
				<div className='mt-8 flex flex-wrap justify-center gap-4'>
					<Link 
						to='/students' 
						onClick={handleStudentClick}
						className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300'>
						View Students
					</Link>
				</div>
			</div>

			<div className='mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2'>
				<div className='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
					<div className='p-6'>
						<h3 className='text-xl font-bold text-gray-900 mb-2'>View Students</h3>
						<p className='text-gray-600'>
							Access the complete list of students in the system.
						</p>
					</div>
				</div>
				<div className='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
					<div className='p-6'>
						<h3 className='text-xl font-bold text-gray-900 mb-2'>Manage Records</h3>
						<p className='text-gray-600'>
							View, add, update, and search student information.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home; 