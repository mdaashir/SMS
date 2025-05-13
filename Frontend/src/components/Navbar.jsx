import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const Navbar = () => {
	const location = useLocation();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const { darkMode, toggleDarkMode } = useTheme();
	
	// Determine active link
	const isActive = (path) => {
		return location.pathname === path 
			? 'text-blue-600 border-b-2 border-blue-600 font-medium' 
			: `${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'} hover:border-b-2 hover:border-blue-300`;
	};

	return (
		<nav className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} shadow-md sticky top-0 z-40 transition-colors duration-200`}>
			<div className="container mx-auto px-4">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						<Link to="/" className="flex items-center group">
							<div className="bg-blue-600 text-white p-2 rounded-lg shadow-md mr-2 transform group-hover:scale-110 transition-all duration-200">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path d="M12 14l9-5-9-5-9 5 9 5z" />
									<path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
								</svg>
							</div>
							<span className={`text-xl font-bold ${darkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-800 group-hover:text-blue-600'} transition-colors`}>Student Management System</span>
						</Link>
					</div>
					
					<div className="hidden sm:flex items-center">
						<div className="ml-6 flex items-center space-x-8">
							<Link
								to="/"
								className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/')} transition-all duration-200`}
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
								Home
							</Link>
							<Link
								to="/students"
								className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/students')} transition-all duration-200`}
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
								</svg>
								Students
							</Link>
						</div>
					</div>
					
					<div className="flex items-center">
						<div className="hidden md:flex items-center space-x-4">
							{/* Theme Toggle Button */}
							<button 
								onClick={toggleDarkMode}
								className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} transition-colors`}
								aria-label="Toggle dark mode"
							>
								{darkMode ? (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
									</svg>
								)}
							</button>
							
							<div className="relative group">
								<button className={`${darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} rounded-full p-2 transition-colors`}>
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</button>
								<div className={`absolute right-0 mt-2 w-48 ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-700'} rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right`}>
									<a href="#" className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Your Profile</a>
									<a href="#" className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Settings</a>
									<a href="#" className={`block px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>Sign out</a>
								</div>
							</div>
						</div>
						
						<div className="ml-4 flex md:hidden">
							{/* Mobile Theme Toggle */}
							<button 
								onClick={toggleDarkMode} 
								className={`mr-2 p-2 rounded-md ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-600'}`}
							>
								{darkMode ? (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
									</svg>
								)}
							</button>
							
							<button 
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className={`inline-flex items-center justify-center p-2 rounded-md ${darkMode ? 'text-gray-300 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors`}
							>
								<span className="sr-only">Open main menu</span>
								{isMobileMenuOpen ? (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden">
					<div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-t'}`}>
						<Link
							to="/"
							className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600')}`}
						>
							Home
						</Link>
						<Link
							to="/students"
							className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/students' ? (darkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600') : (darkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600')}`}
						>
							Students
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
