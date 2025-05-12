import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  getAllStudents,
  deleteStudent,
  getStudentsByProgram,
  createStudent
} from '../services/StudentService';

function Students() {
  // State for student list
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [program, setProgram] = useState('');
  const [programs, setPrograms] = useState([]);
  
  // State for add student form
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    program: '',
    batchYear: '',
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getAllStudents();
      setStudents(data);

      // Extract unique programs for filter dropdown
      const uniquePrograms = [
        ...new Set(data.map((student) => student.program)),
      ];
      setPrograms(uniquePrograms);

      setError(null);
    } catch (err) {
      setError(err.toString());
      toast.error('Failed to fetch students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteStudent(studentId);
        toast.success('Student deleted successfully');
        await fetchStudents();
      } catch (err) {
        setError(err.toString());
        toast.error('Failed to delete student');
      }
    }
  };

  const handleProgramChange = async (e) => {
    const selectedProgram = e.target.value;
    setProgram(selectedProgram);

    setLoading(true);
    try {
      let data;
      if (selectedProgram) {
        data = await getStudentsByProgram(selectedProgram);
        toast.success(`Filtered students by ${selectedProgram} program`);
      } else {
        data = await getAllStudents();
        toast.success('Showing all students');
      }
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(err.toString());
      toast.error('Failed to filter students');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  // Form handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.studentId.trim()) errors.studentId = 'Student ID is required';
    if (!formData.name.trim()) errors.name = 'Name is required';

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone format';
    }

    if (!formData.program.trim()) errors.program = 'Program is required';

    if (!formData.batchYear) {
      errors.batchYear = 'Batch Year is required';
    } else if (
      isNaN(formData.batchYear) ||
      parseInt(formData.batchYear) < 2000
    ) {
      errors.batchYear = 'Invalid batch year';
    }

    return Object.keys(errors).length === 0 ? null : errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors) {
      setFormError(errors);
      toast.error('Please fix the form errors');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      // Convert batchYear to number
      const studentData = {
        ...formData,
        batchYear: parseInt(formData.batchYear),
      };

      await createStudent(studentData);
      toast.success('Student added successfully');
      setShowAddForm(false);
      setFormData({
        studentId: '',
        name: '',
        email: '',
        phone: '',
        program: '',
        batchYear: '',
      });
      await fetchStudents();
    } catch (error) {
      setFormError({ general: error.toString() });
      toast.error('Failed to add student');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center my-12'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  if (error && !showAddForm) {
    return <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4'>Error: {error}</div>;
  }

  return (
    <div className='mt-6'>
      {/* Header with title and actions */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
        <h2 className='text-2xl font-bold text-gray-800 mb-4 md:mb-0'>Student Management</h2>
        <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
          <select
            className='bg-white border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            value={program}
            onChange={handleProgramChange}
            disabled={showAddForm}>
            <option value=''>All Programs</option>
            {programs.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </select>
          <button 
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (!showAddForm) {
                setFormError(null);
              }
            }}
            className={`${showAddForm ? 'bg-gray-500' : 'bg-blue-600'} hover:${showAddForm ? 'bg-gray-600' : 'bg-blue-700'} text-white font-medium py-2 px-4 rounded transition duration-300`}>
            {showAddForm ? 'Cancel' : 'Add New Student'}
          </button>
        </div>
      </div>

      {/* Add Student Form */}
      {showAddForm ? (
        <div className='bg-white shadow-md rounded-lg p-6 mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4'>Add New Student</h3>
          
          {formError?.general && (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>{formError.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor='studentId' className='block text-sm font-medium text-gray-700 mb-1'>
                  Student ID *
                </label>
                <input
                  type='text'
                  className={`w-full border ${formError?.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  id='studentId'
                  name='studentId'
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder='Enter student ID'
                />
                {formError?.studentId && (
                  <p className='text-red-500 text-xs mt-1'>{formError.studentId}</p>
                )}
              </div>

              <div>
                <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
                  Name *
                </label>
                <input
                  type='text'
                  className={`w-full border ${formError?.name ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Enter full name'
                />
                {formError?.name && (
                  <p className='text-red-500 text-xs mt-1'>{formError.name}</p>
                )}
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                  Email *
                </label>
                <input
                  type='email'
                  className={`w-full border ${formError?.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter email address'
                />
                {formError?.email && (
                  <p className='text-red-500 text-xs mt-1'>{formError.email}</p>
                )}
              </div>

              <div>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
                  Phone *
                </label>
                <input
                  type='text'
                  className={`w-full border ${formError?.phone ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder='Enter phone number'
                />
                {formError?.phone && (
                  <p className='text-red-500 text-xs mt-1'>{formError.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor='program' className='block text-sm font-medium text-gray-700 mb-1'>
                  Program *
                </label>
                <input
                  type='text'
                  className={`w-full border ${formError?.program ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  id='program'
                  name='program'
                  value={formData.program}
                  onChange={handleChange}
                  placeholder='Enter program name'
                />
                {formError?.program && (
                  <p className='text-red-500 text-xs mt-1'>{formError.program}</p>
                )}
              </div>

              <div>
                <label htmlFor='batchYear' className='block text-sm font-medium text-gray-700 mb-1'>
                  Batch Year *
                </label>
                <input
                  type='number'
                  className={`w-full border ${formError?.batchYear ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  id='batchYear'
                  name='batchYear'
                  value={formData.batchYear}
                  onChange={handleChange}
                  placeholder='Enter batch year'
                />
                {formError?.batchYear && (
                  <p className='text-red-500 text-xs mt-1'>{formError.batchYear}</p>
                )}
              </div>
            </div>

            <div className='mt-6 flex justify-end'>
              <button
                type='button'
                onClick={() => {
                  setShowAddForm(false);
                  toast.info('Form cancelled');
                }}
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded mr-2 transition duration-300'>
                Cancel
              </button>
              <button
                type='submit'
                disabled={submitting}
                className='bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300 disabled:opacity-50'>
                {submitting ? 'Saving...' : 'Save Student'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Student List
        <>
          {students.length === 0 ? (
            <div className='bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 my-4'>No students found.</div>
          ) : (
            <div className='overflow-x-auto shadow-md rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-800 text-white'>
                  <tr>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Student ID</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Name</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Email</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Phone</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Program</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Batch Year</th>
                    <th scope='col' className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider'>Actions</th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {students.map((student) => (
                    <tr key={student._id || student.studentId} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>{student.studentId}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{student.name}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{student.email}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{student.phone}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{student.program}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{student.batchYear}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <button
                          className='bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-3 rounded transition duration-300'
                          onClick={() => handleDelete(student.studentId)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Students; 