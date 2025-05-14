import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';

const StudentModal = ({ show, onClose, onSubmit, student, programs = [], batchYears = [] }) => {
  const { darkMode } = useTheme();
  const initialFormData = {
    studentId: '',
    name: '',
    email: '',
    phone: '',
    program: '',
    batchYear: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or student changes
  useEffect(() => {
    if (show) {
      if (student) {
        setFormData(student);
      } else {
        setFormData(initialFormData);
      }
      setErrors({});
    }
  }, [show, student]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const validationResults = {};

    // Student ID validation
    if (!formData.studentId && !student) {
      newErrors.studentId = 'Student ID is required';
      validationResults.studentId = 'Student ID is required';
    } else if (formData.studentId && !/^[A-Za-z0-9-_]+$/.test(formData.studentId)) {
      newErrors.studentId = 'ID should only contain letters, numbers, hyphens and underscores';
      validationResults.studentId = 'ID should only contain letters, numbers, hyphens and underscores';
    }

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required';
      validationResults.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
      validationResults.name = 'Name must be at least 2 characters long';
    } else if (!/^[A-Za-z\s.'-]+$/.test(formData.name)) {
      newErrors.name = 'Name contains invalid characters';
      validationResults.name = 'Name contains invalid characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      validationResults.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      validationResults.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
      validationResults.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number should only contain digits, spaces, and +()-';
      validationResults.phone = 'Phone number should only contain digits, spaces, and +()-';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Phone number must have at least 10 digits';
      validationResults.phone = 'Phone number must have at least 10 digits';
    }

    // Program validation
    if (!formData.program) {
      newErrors.program = 'Program is required';
      validationResults.program = 'Program is required';
    }

    // Batch year validation
    if (!formData.batchYear) {
      newErrors.batchYear = 'Batch year is required';
      validationResults.batchYear = 'Batch year is required';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, validationResults };
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { isValid, validationResults } = validate();
    
    if (isValid) {
      const cleanFormData = {
        studentId: formData.studentId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        batchYear: formData.batchYear
      };

      onSubmit(cleanFormData);
    } else {
      // Return validation errors to parent component
      onSubmit(null, validationResults);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl w-full max-w-md p-6 mx-4 transform transition-all`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {student ? 'Edit Student' : 'Add New Student'}
          </h2>
          <button
            onClick={onClose}
            className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold mb-2`} htmlFor="studentId">
              Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              disabled={!!student}
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.studentId
                  ? 'border-red-500 focus:ring-red-500'
                  : darkMode
                    ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
                    : 'border-gray-300 focus:ring-blue-500'
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all ${student ? (darkMode ? 'bg-gray-600' : 'bg-gray-100') : ''}`}
              placeholder="Enter student ID"
            />
            {errors.studentId && (
              <p className="text-red-500 text-xs mt-1">{errors.studentId}</p>
            )}
          </div>

          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold mb-2`} htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.name
                  ? 'border-red-500 focus:ring-red-500'
                  : darkMode
                    ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
                    : 'border-gray-300 focus:ring-blue-500'
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
              placeholder="Enter full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold mb-2`} htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.email
                  ? 'border-red-500 focus:ring-red-500'
                  : darkMode
                    ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
                    : 'border-gray-300 focus:ring-blue-500'
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold mb-2`} htmlFor="phone">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.phone
                  ? 'border-red-500 focus:ring-red-500'
                  : darkMode
                    ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
                    : 'border-gray-300 focus:ring-blue-500'
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
              placeholder="Enter phone number"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold mb-2`} htmlFor="program">
              Program
            </label>
            <select
              id="program"
              name="program"
              value={formData.program}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.program
                  ? 'border-red-500 focus:ring-red-500'
                  : darkMode
                    ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
                    : 'border-gray-300 focus:ring-blue-500'
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
            >
              <option value="">Select program</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
            </select>
            {errors.program && (
              <p className="text-red-500 text-xs mt-1">{errors.program}</p>
            )}
          </div>

          <div>
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-semibold mb-2`} htmlFor="batchYear">
              Batch Year
            </label>
            <select
              id="batchYear"
              name="batchYear"
              value={formData.batchYear}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg ${
                errors.batchYear
                  ? 'border-red-500 focus:ring-red-500'
                  : darkMode
                    ? 'border-gray-600 focus:ring-blue-500 bg-gray-700 text-white'
                    : 'border-gray-300 focus:ring-blue-500'
              } focus:border-transparent focus:outline-none focus:ring-2 transition-all`}
            >
              <option value="">Select batch year</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
            </select>
            {errors.batchYear && (
              <p className="text-red-500 text-xs mt-1">{errors.batchYear}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 text-sm font-medium ${
                darkMode
                  ? 'text-gray-300 bg-gray-700 hover:bg-gray-600'
                  : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 text-sm font-medium text-white ${
                darkMode
                  ? 'bg-blue-700 hover:bg-blue-800'
                  : 'bg-blue-600 hover:bg-blue-700'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all flex items-center`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {student ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
