import { lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './components/ThemeContext';
import { ToastContainer } from './components/Toast';
import Navbar from './components/Navbar';
import Suspense from './components/Suspense';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const Students = lazy(() => import('./pages/Students'));

const App = () => {
	const { darkMode } = useTheme();

	return (
		<Router>
			<div className={`flex flex-col min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
			<Navbar />
				<main className="pt-4 pb-8 flex-grow">
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<ErrorBoundary>
							<Suspense>
				<Routes>
					<Route path='/' element={<Home />} />
									<Route path='/students' element={<Students />} />
				</Routes>
							</Suspense>
						</ErrorBoundary>
					</div>
				</main>
				<footer className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-t'} py-4 transition-colors duration-200`}>
					<div className="container mx-auto px-4">
						<p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
							&copy; {new Date().getFullYear()} Student Management System
						</p>
					</div>
				</footer>
				<ToastContainer />
			</div>
		</Router>
	);
};

export default App;
