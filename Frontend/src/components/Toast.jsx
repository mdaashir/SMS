import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from './ThemeContext';

// Toast container component to be rendered once in the app
export const ToastContainer = () => {
  const { darkMode } = useTheme();
  
  return <Toaster 
    position="top-right"
    toastOptions={{
      duration: 5000,
      style: {
        borderRadius: '8px',
        background: darkMode ? '#374151' : '#fff',  // gray-700 for dark mode
        color: darkMode ? '#f3f4f6' : '#333',       // gray-100 for dark mode
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        padding: '12px 16px',
      },
      success: {
        iconTheme: {
          primary: '#22c55e',
          secondary: darkMode ? '#1f2937' : '#fff',  // gray-800 for dark mode
        },
        style: {
          border: darkMode ? '1px solid #065f46' : '1px solid #dcfce7',  // emerald-800 for dark mode
          backgroundColor: darkMode ? '#064e3b' : '#f0fdf4',             // emerald-900 for dark mode
        },
      },
      error: {
        iconTheme: {
          primary: '#ef4444',
          secondary: darkMode ? '#1f2937' : '#fff',  // gray-800 for dark mode
        },
        style: {
          border: darkMode ? '1px solid #991b1b' : '1px solid #fee2e2',  // red-800 for dark mode
          backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2',             // red-900 for dark mode
        },
      },
      loading: {
        iconTheme: {
          primary: '#3b82f6',
          secondary: darkMode ? '#1f2937' : '#fff',  // gray-800 for dark mode
        },
        style: {
          border: darkMode ? '1px solid #1e40af' : '1px solid #dbeafe',  // blue-800 for dark mode
          backgroundColor: darkMode ? '#1e3a8a' : '#eff6ff',             // blue-900 for dark mode
        },
      },
    }}
  >
    {(t) => (
      <div
        className={`${t.visible ? 'animate-enter' : 'animate-leave'} relative flex max-w-md items-center justify-between rounded-lg shadow-lg`}
        style={{
          ...t.style,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div className="flex items-center">
          {t.icon}
          <p className="px-2">{t.message}</p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className={`rounded-full p-1 ${
            darkMode 
              ? 'text-gray-300 hover:bg-gray-600 hover:text-gray-100' 
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
          } transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300`}
          aria-label="Close toast"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    )}
  </Toaster>;
};

// Function to show success toast
export const showSuccessToast = (message) => {
  toast.success(message);
};

// Function to show error toast
export const showErrorToast = (message) => {
  toast.error(message);
};

// Function to show loading toast
export const showLoadingToast = (message) => {
  return toast.loading(message);
};

// Function to update toast
export const updateToast = (id, options) => {
  toast.update(id, options);
};

// Function to dismiss toast
export const dismissToast = (id) => {
  toast.dismiss(id);
};

// Function to dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
}; 