import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Navbar from './components/Navbar';
import Home from './components/Home';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import EditStudent from './components/EditStudent';

function App() {
	return (
		<Router>
			<Navbar />
			<div className='container-fluid py-3'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/students' element={<StudentList />} />
					<Route path='/add-student' element={<AddStudent />} />
					<Route path='/edit-student/:studentId' element={<EditStudent />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
