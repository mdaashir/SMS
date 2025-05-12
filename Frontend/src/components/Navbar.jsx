import { Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<nav className='bg-gray-800'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<Link className='text-white font-bold text-xl' to='/'>
							Student Management System
						</Link>
					</div>
					<div className='hidden md:block'>
						<div className='ml-10 flex items-baseline space-x-4'>
							<Link className='text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium' to='/'>
								Home
							</Link>
							<Link className='text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium' to='/students'>
								Students
							</Link>
						</div>
					</div>
					<div className='md:hidden'>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
							aria-expanded='false'>
							<span className='sr-only'>Open main menu</span>
							<svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
							</svg>
							<svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
							</svg>
						</button>
					</div>
				</div>
			</div>

			<div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
				<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
					<Link className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium' to='/'>
						Home
					</Link>
					<Link className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium' to='/students'>
						Students
					</Link>
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
