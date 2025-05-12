import { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import { 
  showSuccessToast, 
  showErrorToast, 
  showLoadingToast, 
  updateToast 
} from '../components/Toast';
import {
  getAllStudents,
  deleteStudent,
  getStudentsByProgram,
  createStudent
} from '../services/StudentService';

function Students() {
  const { darkMode } = useTheme();
  
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
    const loadingToastId = showLoadingToast('Loading students...');
    
    try {
      const data = await getAllStudents();
      setStudents(data);

      // Extract unique programs for filter dropdown
      const uniquePrograms = [
        ...new Set(data.map((student) => student.program)),
      ];
      setPrograms(uniquePrograms);

      setError(null);
      updateToast(loadingToastId, { 
        render: 'Students loaded successfully', 
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
    } catch (err) {
      setError(err.toString());
      setStudents([]);
      updateToast(loadingToastId, { 
        render: 'Failed to fetch students', 
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      const loadingToastId = showLoadingToast('Deleting student...');
      
      try {
        await deleteStudent(studentId);
        updateToast(loadingToastId, { 
          render: 'Student deleted successfully', 
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
        await fetchStudents();
      } catch (err) {
        setError(err.toString());
        updateToast(loadingToastId, { 
          render: 'Failed to delete student', 
          type: 'error',
          isLoading: false,
          autoClose: 3000
        });
      }
    }
  };

  const handleProgramChange = async (e) => {
    const selectedProgram = e.target.value;
    setProgram(selectedProgram);

    setLoading(true);
    const loadingToastId = showLoadingToast('Filtering students...');
    
    try {
      let data;
      if (selectedProgram) {
        data = await getStudentsByProgram(selectedProgram);
        updateToast(loadingToastId, { 
          render: `Filtered students by ${selectedProgram} program`, 
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
      } else {
        data = await getAllStudents();
        updateToast(loadingToastId, { 
          render: 'Showing all students', 
          type: 'success',
          isLoading: false,
          autoClose: 2000
        });
      }
      setStudents(data);
      setError(null);
    } catch (err) {
      setError(err.toString());
      setStudents([]);
      updateToast(loadingToastId, { 
        render: 'Failed to filter students', 
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
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
      showErrorToast('Please fix the form errors');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    const loadingToastId = showLoadingToast('Adding student...');

    try {
      // Convert batchYear to number
      const studentData = {
        ...formData,
        batchYear: parseInt(formData.batchYear),
      };

      await createStudent(studentData);
      updateToast(loadingToastId, { 
        render: 'Student added successfully', 
        type: 'success',
        isLoading: false,
        autoClose: 2000
      });
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
      updateToast(loadingToastId, { 
        render: 'Failed to add student', 
        type: 'error',
        isLoading: false,
        autoClose: 3000
      });
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
    return <div className={`${darkMode ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded my-4 border`}>Error: {error}</div>;
  }

  return (
    <div className='mt-6'>
      {/* Header with title and actions */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4 md:mb-0`}>Student Management</h2>
        <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
          <select
            className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
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
            className={`${showAddForm 
              ? (darkMode ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-500 hover:bg-gray-600') 
              : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded transition duration-300`}>
            {showAddForm ? 'Cancel' : 'Add New Student'}
          </button>
        </div>
      </div>

      {/* Add Student Form */}
      {showAddForm ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-6 mb-8`}>
          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-4`}>Add New Student</h3>
          
          {formError?.general && (
            <div className={`${darkMode ? 'bg-red-900 border-red-800 text-red-200' : 'bg-red-100 border-red-400 text-red-700'} px-4 py-3 rounded mb-4 border`}>{formError.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor='studentId' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Student ID *
                </label>
                <input
                  type='text'
                  className={`w-full ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
                    ${formError?.studentId ? (darkMode ? 'border-red-500' : 'border-red-500') : ''} 
                    border rounded-md py-2 px-3 focus:outline-none focus:ring-2`}
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
                <label htmlFor='name' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Name *
                </label>
                <input
                  type='text'
                  className={`w-full ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
                    ${formError?.name ? (darkMode ? 'border-red-500' : 'border-red-500') : ''} 
                    border rounded-md py-2 px-3 focus:outline-none focus:ring-2`}
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
                <label htmlFor='email' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Email *
                </label>
                <input
                  type='email'
                  className={`w-full ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
                    ${formError?.email ? (darkMode ? 'border-red-500' : 'border-red-500') : ''} 
                    border rounded-md py-2 px-3 focus:outline-none focus:ring-2`}
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
                <label htmlFor='phone' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Phone *
                </label>
                <input
                  type='text'
                  className={`w-full ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
                    ${formError?.phone ? (darkMode ? 'border-red-500' : 'border-red-500') : ''} 
                    border rounded-md py-2 px-3 focus:outline-none focus:ring-2`}
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
                <label htmlFor='program' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Program *
                </label>
                <input
                  type='text'
                  className={`w-full ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
                    ${formError?.program ? (darkMode ? 'border-red-500' : 'border-red-500') : ''} 
                    border rounded-md py-2 px-3 focus:outline-none focus:ring-2`}
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
                <label htmlFor='batchYear' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Batch Year *
                </label>
                <input
                  type='number'
                  className={`w-full ${darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                    : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500'} 
                    ${formError?.batchYear ? (darkMode ? 'border-red-500' : 'border-red-500') : ''} 
                    border rounded-md py-2 px-3 focus:outline-none focus:ring-2`}
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
                  showSuccessToast('Form cancelled');
                }}
                className={`${darkMode ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'} font-medium py-2 px-4 rounded mr-2 transition duration-300`}>
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
            <div className={`${darkMode ? 'bg-blue-900 border-blue-800 text-blue-200' : 'bg-blue-50 border-blue-500 text-blue-700'} p-4 my-4 border-l-4`}>No students found.</div>
          ) : (
            <div className='overflow-x-auto shadow-md rounded-lg'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-800 text-white'}`}>
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
                <tbody className={`${darkMode ? 'bg-gray-700 divide-y divide-gray-600' : 'bg-white divide-y divide-gray-200'}`}>
                  {students.map((student) => (
                    <tr key={student._id || student.studentId} className={`${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}`}>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>{student.studentId}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>{student.name}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>{student.email}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>{student.phone}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>{student.program}</td>
                      <td className={`px-6 py-4 whitespace-nowrap ${darkMode ? 'text-gray-300' : ''}`}>{student.batchYear}</td>
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