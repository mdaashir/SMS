import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Students from './pages/Students';

function App() {
	return (
		<Router>
			<Navbar />
			<div className='max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/students' element={<Students />} />
				</Routes>
			</div>
			<Toaster 
				position="top-right"
				toastOptions={{
					duration: 3000,
					style: {
						background: '#363636',
						color: '#fff',
					},
					success: {
						duration: 3000,
						style: {
							background: '#22c55e',
							color: '#fff',
						},
					},
					error: {
						duration: 3000,
						style: {
							background: '#ef4444',
							color: '#fff',
						},
					},
				}}
			/>
		</Router>
	);
}

export default App;
