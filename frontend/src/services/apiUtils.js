/**
 * API Utilities
 * Helper functions for API operations
 */

/**
 * Build query string from parameters object
 * @param {Object} params - Query parameters
 * @returns {string} Query string
 */
export const buildQueryString = (params) => {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    });
  
  return filtered.length > 0 ? `?${filtered.join('&')}` : '';
};

/**
 * Format error message from API response
 * @param {Error} error - Error object
 * @returns {string} Formatted error message
 */
export const formatErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error status
    return error.response.data?.message || error.response.data?.error || `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request made but no response
    return 'Network error: Unable to reach server';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred';
  }
};

/**
 * Check if error is authentication related
 * @param {Error} error - Error object
 * @returns {boolean} True if auth error
 */
export const isAuthError = (error) => {
  return error.response?.status === 401 || error.response?.status === 403;
};

/**
 * Check if error is validation related
 * @param {Error} error - Error object
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 400 || error.response?.status === 422;
};

/**
 * Extract validation errors from response
 * @param {Error} error - Error object
 * @returns {Object} Validation errors by field
 */
export const getValidationErrors = (error) => {
  if (error.response?.data?.errors) {
    return error.response.data.errors;
  }
  return {};
};

/**
 * Retry failed request with exponential backoff
 * @param {Function} requestFn - Function that makes the request
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in ms
 * @returns {Promise} Request result
 */
export const retryRequest = async (requestFn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry auth errors
      if (isAuthError(error)) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
};

/**
 * Format date for API requests
 * @param {Date|string} date - Date to format
 * @returns {string} ISO formatted date
 */
export const formatDateForAPI = (date) => {
  if (!date) return null;
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString();
};

/**
 * Parse pagination info from response
 * @param {Object} response - API response
 * @returns {Object} Pagination details
 */
export const parsePagination = (response) => {
  return {
    total: response.data?.total || 0,
    page: response.data?.page || 1,
    limit: response.data?.limit || 10,
    totalPages: response.data?.totalPages || 1,
    hasNextPage: response.data?.hasNextPage || false,
    hasPrevPage: response.data?.hasPrevPage || false,
  };
};

/**
 * Create cancelable request
 * @returns {Object} Cancel token and cancel function
 */
export const createCancelToken = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: (reason) => controller.abort(reason),
  };
};

/**
 * Debounce function for search/filter requests
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, delay = 300) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    return new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve(func(...args));
      }, delay);
    });
  };
};

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Download file from blob
 * @param {Blob} blob - File blob
 * @param {string} filename - File name
 */
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default {
  buildQueryString,
  formatErrorMessage,
  isAuthError,
  isValidationError,
  getValidationErrors,
  retryRequest,
  formatDateForAPI,
  parsePagination,
  createCancelToken,
  debounce,
  formatFileSize,
  downloadFile,
};
