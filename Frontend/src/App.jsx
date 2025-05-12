import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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
		</Router>
	);
}

export default App;
