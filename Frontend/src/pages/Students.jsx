import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../components/ThemeContext';
import StudentTable from '../components/StudentTable';
import StudentModal from '../components/StudentModal';
import ConfirmationDialog from '../components/ConfirmationDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  showSuccessToast,
  showErrorToast,
  showStudentDeletedToast,
  showStudentUpdatedToast
} from '../components/Toast';
import {
  getAllStudents,
  getPaginatedStudents,
  deleteStudent,
  createStudent,
  updateStudent
} from '../services/StudentService';

const Students = () => {
  const { darkMode } = useTheme();

  // State for student list and filtering
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [filterBatchYear, setFilterBatchYear] = useState('');
  const [programs, setPrograms] = useState([]);
  const [batchYears, setBatchYears] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // State for modal and confirmation dialog
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);


  const validTotalPages = useMemo(() =>
    isNaN(totalPages) || totalPages < 0 ? 0 : totalPages,
    [totalPages]
  );

  const paginationInfo = useMemo(() => {
    const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const showingTo = Math.min(currentPage * itemsPerPage, totalItems);
    return { showingFrom, showingTo };
  }, [currentPage, itemsPerPage, totalItems]);

  const fetchPaginatedStudents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Prepare filters for API
      const filters = {};
      if (filterProgram) filters.program = filterProgram;
      if (filterBatchYear) filters.batchYear = filterBatchYear;

      // Fetch paginated data
      const data = await getPaginatedStudents(currentPage, itemsPerPage, filters);

      if (!data || !Array.isArray(data.students)) {
        throw new Error('Invalid response format from server');
      }

      setStudents(data.students);
      setFilteredStudents(data.students);
      setTotalItems(data.totalItems || 0);
      setTotalPages(data.totalPages || 0);

      if (currentPage === 1 && !filterProgram && !filterBatchYear) {
        try {
          const allStudents = await getAllStudents();

          if (Array.isArray(allStudents)) {
            const uniquePrograms = [...new Set(allStudents.map(student => student.program).filter(Boolean))].sort();
            const uniqueBatchYears = [...new Set(allStudents.map(student => student.batchYear).filter(Boolean))].sort();

            setPrograms(uniquePrograms);
            setBatchYears(uniqueBatchYears);
          }
        } catch (filterError) {
          showErrorToast('Failed to load filter data');
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to load students';
      showErrorToast(errorMessage);
      console.error('Error fetching students:', error);
      setError(errorMessage);
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, filterProgram, filterBatchYear]);


  useEffect(() => {
    fetchPaginatedStudents().then();
  }, [fetchPaginatedStudents]);

  useEffect(() => {
    if (students.length === 0) {
      setFilteredStudents([]);
      return;
    }

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = students.filter(student =>
        (student.studentId && student.studentId.toLowerCase().includes(searchTermLower)) ||
        (student.name && student.name.toLowerCase().includes(searchTermLower)) ||
        (student.email && student.email.toLowerCase().includes(searchTermLower)) ||
        (student.phone && student.phone.toLowerCase().includes(searchTermLower))
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [students, searchTerm]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const handleAddStudent = useCallback(() => {
    setSelectedStudent(null);
    setShowModal(true);
  }, []);

  const handleEditStudent = useCallback((student) => {
    setSelectedStudent(student);
    setShowModal(true);
  }, []);

  const handleDeleteClick = useCallback((student) => {
    setStudentToDelete(student);
    setShowConfirmation(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!studentToDelete || !studentToDelete.studentId) {
      showErrorToast('Invalid student data');
      setShowConfirmation(false);
      return;
    }

    try {
      await deleteStudent(studentToDelete.studentId);
      showStudentDeletedToast('Student deleted successfully');
      await fetchPaginatedStudents();
    } catch (error) {
      const errorMessage = error.message || 'Error deleting student';
      showErrorToast(errorMessage);
    } finally {
      setShowConfirmation(false);
      setStudentToDelete(null);
    }
  }, [studentToDelete, fetchPaginatedStudents]);

  const handleFormSubmit = useCallback(async (formData, validationErrors) => {
    if (!formData) {
      if (validationErrors) {
        if (validationErrors.studentId) {
          showErrorToast(`Student ID: ${validationErrors.studentId}`);
        }
        if (validationErrors.name) {
          showErrorToast(`Name: ${validationErrors.name}`);
        }
        if (validationErrors.phone) {
          showErrorToast(`Phone: ${validationErrors.phone}`);
        }
        const otherErrors = Object.entries(validationErrors)
          .filter(([key]) => !['studentId', 'name', 'phone'].includes(key))
          .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`);

        if (otherErrors.length > 0) {
          showErrorToast(otherErrors.join(', '));
        }
        return;
      }
      showErrorToast('Invalid form data');
      return;
    }

    try {
      const isEdit = !!selectedStudent;

      if (isEdit) {
        if (!selectedStudent.studentId) {
          throw new Error('Student ID is missing');
        }
        // Update existing student
        await updateStudent(selectedStudent.studentId, formData);
        showStudentUpdatedToast('Student updated successfully');
      } else {
        // Add new student
        await createStudent(formData);
        showSuccessToast('Student added successfully');
      }

      setShowModal(false);
      await fetchPaginatedStudents();
    } catch (error) {
      const action = selectedStudent ? 'updating' : 'adding';
      const errorMessage = error.message || `Error ${action} student`;
      showErrorToast(errorMessage);
      console.error('Error saving student:', error);
    }
  }, [selectedStudent, fetchPaginatedStudents]);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterProgram('');
    setFilterBatchYear('');
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleProgramFilterChange = useCallback((e) => {
    setFilterProgram(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleBatchYearFilterChange = useCallback((e) => {
    setFilterBatchYear(e.target.value);
    setCurrentPage(1);
  }, []);

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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                onChange={handleSearchChange}
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
              onChange={handleProgramFilterChange}
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
            <select
              id="batch-filter"
              value={filterBatchYear}
              onChange={handleBatchYearFilterChange}
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
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className={`w-full py-2 px-4 border ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
              } rounded-md transition-colors duration-200 flex items-center justify-center`}
              aria-label="Clear all filters"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className={`${darkMode ? 'bg-red-900' : 'bg-red-100'} border ${darkMode ? 'border-red-800' : 'border-red-400'} text-${darkMode ? 'red-200' : 'red-700'} px-4 py-3 rounded mb-6`} role="alert">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            <p>{error}</p>
          </div>
          <button
            onClick={() => fetchPaginatedStudents()}
            className={`mt-2 ${darkMode ? 'bg-red-800 hover:bg-red-700' : 'bg-red-200 hover:bg-red-300'} px-3 py-1 rounded text-sm`}
          >
            Retry
          </button>
        </div>
      )}

      {/* Student Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredStudents.length === 0 && !error ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xl font-medium mb-2">No students found</p>
          <p className="mb-4">Try clearing filters or adding a new student.</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={handleClearFilters}
              className={`px-4 py-2 border rounded-md ${darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-300 bg-gray-100 hover:bg-gray-200'}`}
            >
              Clear Filters
            </button>
            <button
              onClick={handleAddStudent}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Add Student
            </button>
          </div>
        </div>
      ) : (
        <>
          <StudentTable
            students={filteredStudents}
            onEdit={handleEditStudent}
            onDelete={handleDeleteClick}
            currentPage={currentPage}
            totalPages={validTotalPages}
            onPageChange={handlePageChange}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            showingFrom={paginationInfo.showingFrom}
            showingTo={paginationInfo.showingTo}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </>
      )}

      {/* Student Modal */}
      {showModal && (
        <StudentModal
          show={showModal}
          student={selectedStudent}
          onClose={() => setShowModal(false)}
          onSubmit={handleFormSubmit}
          programs={programs}
          batchYears={batchYears}
        />
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog
          show={showConfirmation}
          title="Delete Student"
          message={`Are you sure you want to delete ${studentToDelete?.name || 'this student'}? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteConfirm}
          onClose={() => setShowConfirmation(false)}
          isDangerous={true}
        />
      )}
    </div>
  );
};

export default Students;
