import React, { useState, useEffect } from 'react';
import { useTheme } from '../components/ThemeContext';
import StudentTable from '../components/StudentTable';
import StudentModal from '../components/StudentModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import { 
  showSuccessToast, 
  showErrorToast, 
  showLoadingToast, 
  dismissToast,
  updateToast 
} from '../components/Toast';
import {
  getAllStudents,
  deleteStudent,
  getStudentsByProgram,
  createStudent,
  updateStudent
} from '../services/StudentService';

const Students = () => {
  const { darkMode } = useTheme();
  
  // State for student list and filtering
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterBatchYear, setFilterBatchYear] = useState('');
  const [programs, setPrograms] = useState([]);
  const [batchYears, setBatchYears] = useState([]);

  // State for modal and confirmation dialog
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students when search term or filters change
  useEffect(() => {
    if (students.length === 0) {
      setFilteredStudents([]);
      return;
    }
    
    let result = students;
    
    // Apply search filter
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(student => 
        student.studentId.toLowerCase().includes(searchTermLower) ||
        student.name.toLowerCase().includes(searchTermLower) ||
        student.email.toLowerCase().includes(searchTermLower) ||
        student.phone.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Apply program filter
    if (filterProgram) {
      result = result.filter(student => student.program === filterProgram);
    }
    
    // Apply batch year filter
    if (filterBatchYear) {
      result = result.filter(student => student.batchYear === filterBatchYear);
    }
    
    setFilteredStudents(result);
  }, [students, searchTerm, filterProgram, filterBatchYear]);

  const fetchStudents = async () => {
    setLoading(true);
    const loadingToastId = showLoadingToast('Loading students...');
    
    try {
      const data = await getAllStudents();
      setStudents(data);
      setFilteredStudents(data);

      // Extract unique programs and batch years for filters
      const uniquePrograms = [...new Set(data.map(student => student.program))].sort();
      const uniqueBatchYears = [...new Set(data.map(student => student.batchYear))].sort();
      
      setPrograms(uniquePrograms);
      setBatchYears(uniqueBatchYears);
      
      dismissToast(loadingToastId);
      showSuccessToast('Students loaded successfully');
    } catch (error) {
      dismissToast(loadingToastId);
      showErrorToast('Failed to load students');
      console.error('Error fetching students:', error);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowConfirmation(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const loadingToastId = showLoadingToast('Deleting student...');
      await deleteStudent(studentToDelete._id);
      dismissToast(loadingToastId);
      showSuccessToast('Student deleted successfully');
      await fetchStudents();
    } catch (error) {
      showErrorToast('Error deleting student');
      console.error('Error deleting student:', error);
    } finally {
      setShowConfirmation(false);
      setStudentToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const isEdit = !!selectedStudent;
      const loadingToastId = showLoadingToast(isEdit ? 'Updating student...' : 'Adding student...');
      
      if (isEdit) {
        // Update existing student
        await updateStudent(selectedStudent._id, formData);
        dismissToast(loadingToastId);
        showSuccessToast('Student updated successfully');
      } else {
        // Add new student
        await createStudent(formData);
        dismissToast(loadingToastId);
        showSuccessToast('Student added successfully');
      }
      
      setShowModal(false);
      await fetchStudents();
    } catch (error) {
      showErrorToast(`Error ${selectedStudent ? 'updating' : 'adding'} student`);
      console.error('Error saving student:', error);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterProgram('');
    setFilterBatchYear('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'} transition-colors duration-200`}>Student Management</h1>
        <button 
          onClick={handleAddStudent}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all duration-200 transform hover:scale-105 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Student
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-4 mb-6 transition-colors duration-200`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="search" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, name, email, or phone"
                className={`block w-full pl-10 pr-4 py-2 border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
              />
            </div>
          </div>

          {/* Program Filter */}
          <div>
            <label htmlFor="program-filter" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Program
            </label>
            <select
              id="program-filter"
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className={`block w-full py-2 px-3 border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
            >
              <option value="">All Programs</option>
              {programs.map((program) => (
                <option key={program} value={program}>
                  {program}
                </option>
              ))}
            </select>
          </div>

          {/* Batch Year Filter */}
          <div>
            <label htmlFor="batch-filter" className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Batch Year
            </label>
            <div className="flex space-x-2">
              <select
                id="batch-filter"
                value={filterBatchYear}
                onChange={(e) => setFilterBatchYear(e.target.value)}
                className={`block w-full py-2 px-3 border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
              >
                <option value="">All Years</option>
                {batchYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              
              {(searchTerm || filterProgram || filterBatchYear) && (
                <button
                  onClick={handleClearFilters}
                  className={`flex items-center px-3 py-2 border ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
                  } rounded-md transition-colors duration-200`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className={`flex justify-center items-center py-20 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xl font-medium">Loading students...</span>
        </div>
      ) : (
        <StudentTable 
          students={filteredStudents} 
          onEdit={handleEditStudent} 
          onDelete={handleDeleteClick} 
        />
      )}

      {/* Student Modal */}
      <StudentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        show={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message={`Are you sure you want to delete ${studentToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Students; 