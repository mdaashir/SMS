import axios from 'axios';

// Get the base URL from environment variables or use a default
const API_URL = import.meta.env.VITE_API_URL || '/api';
const TIMEOUT_MS = 15000; // 15 seconds timeout
const MAX_RETRIES = 2;

/**
 * Creates a configured axios instance for API requests
 * @returns {import('axios').AxiosInstance} Configured axios instance
 */
const createApiInstance = () => {
	// Create axios instance with default config
	const instance = axios.create({
		baseURL: API_URL,
		headers: {
			'Content-Type': 'application/json',
		},
		timeout: TIMEOUT_MS,
	});

	// Track retries for each request
	instance.interceptors.request.use(
		(config) => {
			// Initialize retry count if not present
			config.retryCount = config.retryCount || 0;

			// You can add auth tokens here if needed
			// const token = localStorage.getItem('token');
			// if (token) {
			//   config.headers.Authorization = `Bearer ${token}`;
			// }

			if (config.method === 'get') {
				config.params = config.params || {};
				config.params._t = new Date().getTime();
			}

			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	// Response interceptor with retry logic
	instance.interceptors.response.use(
		(response) => {
			if (response.config.retryCount) {
				response.config.retryCount = 0;
			}
			return response;
		},
		async (error) => {
			const { config } = error;

			if (
				config &&
				config.method === 'get' &&
				config.retryCount < MAX_RETRIES
			) {
				// Increment retry count
				config.retryCount += 1;

				const delay = Math.pow(2, config.retryCount) * 1000;

				console.warn(
					`Retrying request (${config.retryCount}/${MAX_RETRIES}) after ${delay}ms: ${config.url}`
				);

				await new Promise((resolve) => setTimeout(resolve, delay));

				// Retry the request
				return instance(config);
			}

			// Handle common errors
			if (error.response) {
				// Server responded with an error status
				const status = error.response.status;

				switch (status) {
					case 401:
						console.error('Authentication error - Please log in again');

						break;
					case 403:
						console.error('Permission denied');
						break;
					case 404:
						console.error('Resource not found');
						break;
					case 500:
						console.error('Server error');
						break;
					default:
						console.error(`Error with status code ${status}`);
				}
			} else if (error.request) {
				// No response received
				if (error.code === 'ECONNABORTED') {
					console.error('Request timeout - server took too long to respond');
				}
			} else {
				// Request setup error
				console.error('API Error:',  error.response.data);
			}

			return Promise.reject(error);
		}
	);

	return instance;
};

// Create and export the API instance
const api = createApiInstance();
export default api;
