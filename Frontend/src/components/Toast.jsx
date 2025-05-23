import React from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTheme } from './ThemeContext';

// Toast container component to be rendered once in the app
export const ToastContainer = () => {
	const { darkMode } = useTheme();

	return (
		<Toaster
			position='top-right'
			toastOptions={ {
				duration: 3000,
				style: {
					borderRadius: '8px',
					background: darkMode ? '#374151' : '#fff', // gray-700 for dark mode
					color: darkMode ? '#f3f4f6' : '#333', // gray-100 for dark mode
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
					padding: '12px 16px',
					marginBottom: '10px',
				},
				success: {
					iconTheme: {
						primary: '#22c55e',
						secondary: darkMode ? '#1f2937' : '#fff', // gray-800 for dark mode
					},
					style: {
						border: darkMode ? '1px solid #065f46' : '1px solid #dcfce7', // emerald-800 for dark mode
						backgroundColor: darkMode ? '#064e3b' : '#f0fdf4', // emerald-900 for dark mode
					},
				},
				error: {
					iconTheme: {
						primary: '#ef4444',
						secondary: darkMode ? '#1f2937' : '#fff', // gray-800 for dark mode
					},
					style: {
						border: darkMode ? '1px solid #991b1b' : '1px solid #fee2e2', // red-800 for dark mode
						backgroundColor: darkMode ? '#7f1d1d' : '#fef2f2', // red-900 for dark mode
					},
					duration: 4000,
				},
				loading: {
					iconTheme: {
						primary: '#3b82f6',
						secondary: darkMode ? '#1f2937' : '#fff', // gray-800 for dark mode
					},
					style: {
						border: darkMode ? '1px solid #1e40af' : '1px solid #dbeafe', // blue-800 for dark mode
						backgroundColor: darkMode ? '#1e3a8a' : '#eff6ff', // blue-900 for dark mode
					},
				},
			} }
			gutter={ 10 }
		>
			{(t) => (
				<div
					className={`${
						t.visible ? 'animate-enter' : 'animate-leave'
					} relative flex max-w-md items-center justify-between rounded-lg shadow-lg`}
					style={t.style}>
					<div className='flex items-center'>
						{t.icon}
						<p className='px-2'>{t.message}</p>
					</div>
					<button
						onClick={() => toast.dismiss(t.id)}
						className={`rounded-full p-1 ${
							darkMode
								? 'text-gray-300 hover:bg-gray-600 hover:text-gray-100'
								: 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
						} transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300`}
						aria-label='Close toast'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-4 w-4'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M6 18L18 6M6 6l12 12'
							/>
						</svg>
					</button>
				</div>
			)}
		</Toaster>
	);
};

// Function to show success toast
export const showSuccessToast = (message) => {
	toast.success(message);
};

// Function to show error toast
export const showErrorToast = (message) => {
	toast.error(message);
};

export const showStudentDeletedToast = (message) => {
	return toast.success(message, {
		style: {
			border: '1px solid #dc2626',
			backgroundColor: '#b91c1c',
			color: '#ffffff',
		},
		iconTheme: {
			primary: '#ffffff',
			secondary: '#dc2626',
		},
	});
};

export const showStudentUpdatedToast = (message) => {
	// Get the current dark mode setting
	const isDarkMode = document.documentElement.classList.contains('dark') ||
		document.querySelector('div[class*="bg-gray-900"]') !== null;

	return toast.success(message, {
		style: {
			border: isDarkMode ? '1px solid #eab308' : '1px solid #ca8a04',
			backgroundColor: isDarkMode ? '#854d0e' : '#fef9c3',
			color: isDarkMode ? '#fef9c3' : '#854d0e',
		},
		iconTheme: {
			primary: '#eab308',
			secondary: isDarkMode ? '#1f2937' : '#ffffff',
		},
	});
};
