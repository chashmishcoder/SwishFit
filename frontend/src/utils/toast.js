import { toast } from 'react-toastify';

/**
 * Toast Notification Utilities
 * Provides consistent toast notifications across the application
 */

const defaultOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Show success toast
 * @param {string} message - Success message to display
 * @param {object} options - Optional toast configuration
 */
export const showSuccess = (message, options = {}) => {
  toast.success(message, {
    ...defaultOptions,
    ...options,
    className: 'toast-success',
  });
};

/**
 * Show error toast
 * @param {string} message - Error message to display
 * @param {object} options - Optional toast configuration
 */
export const showError = (message, options = {}) => {
  toast.error(message, {
    ...defaultOptions,
    autoClose: 5000,
    ...options,
    className: 'toast-error',
  });
};

/**
 * Show info toast
 * @param {string} message - Info message to display
 * @param {object} options - Optional toast configuration
 */
export const showInfo = (message, options = {}) => {
  toast.info(message, {
    ...defaultOptions,
    ...options,
    className: 'toast-info',
  });
};

/**
 * Show warning toast
 * @param {string} message - Warning message to display
 * @param {object} options - Optional toast configuration
 */
export const showWarning = (message, options = {}) => {
  toast.warning(message, {
    ...defaultOptions,
    ...options,
    className: 'toast-warning',
  });
};

/**
 * Show loading toast (persists until manually dismissed)
 * @param {string} message - Loading message to display
 * @returns {number} Toast ID for dismissal
 */
export const showLoading = (message = 'Loading...') => {
  return toast.loading(message, {
    position: 'top-right',
    className: 'toast-loading',
  });
};

/**
 * Dismiss a specific toast by ID
 * @param {number} toastId - ID of toast to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Update an existing toast
 * @param {number} toastId - ID of toast to update
 * @param {object} updateOptions - New toast configuration
 */
export const updateToast = (toastId, updateOptions) => {
  toast.update(toastId, {
    ...defaultOptions,
    ...updateOptions,
  });
};

/**
 * Dismiss all active toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showLoading,
  dismissToast,
  updateToast,
  dismissAllToasts,
};
