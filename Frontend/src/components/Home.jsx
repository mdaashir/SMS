import { Link } from 'react-router-dom';

function Home() {
	return (
		<div className='container mt-5'>
			<div className='row'>
				<div className='col-md-8 offset-md-2 text-center'>
					<div className='jumbotron'>
						<h1 className='display-4'>Student Management System</h1>
						<p className='lead'>
							A comprehensive solution for managing student records with easy
							access and maintenance.
						</p>
						<hr className='my-4' />
						<p>
							This system allows you to add, view, update and delete student
							information efficiently.
						</p>
						<div className='d-flex justify-content-center gap-2 mt-4'>
							<Link to='/students' className='btn btn-primary btn-lg'>
								View Students
							</Link>
							<Link to='/add-student' className='btn btn-success btn-lg'>
								Add New Student
							</Link>
						</div>
					</div>

					<div className='row mt-5'>
						<div className='col-md-4'>
							<div className='card mb-4'>
								<div className='card-body'>
									<h3 className='card-title'>Create</h3>
									<p className='card-text'>
										Add new student records with validation.
									</p>
								</div>
							</div>
						</div>
						<div className='col-md-4'>
							<div className='card mb-4'>
								<div className='card-body'>
									<h3 className='card-title'>Manage</h3>
									<p className='card-text'>
										Update and maintain student information.
									</p>
								</div>
							</div>
						</div>
						<div className='col-md-4'>
							<div className='card mb-4'>
								<div className='card-body'>
									<h3 className='card-title'>Search</h3>
									<p className='card-text'>Filter students by program.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
