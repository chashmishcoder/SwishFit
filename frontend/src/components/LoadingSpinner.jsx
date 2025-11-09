import PropTypes from 'prop-types';

/**
 * LoadingSpinner Component
 * Displays an animated spinner with optional message
 * @param {string} size - Size of spinner: 'sm', 'md', 'lg' (default: 'md')
 * @param {string} message - Optional loading message to display
 * @param {string} color - Color theme: 'orange', 'blue', 'purple' (default: 'orange')
 */
const LoadingSpinner = ({ size = 'md', message = 'Loading...', color = 'orange' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
    xl: 'w-20 h-20 border-4'
  };

  const colorClasses = {
    orange: 'border-basketball-orange',
    blue: 'border-court-blue',
    purple: 'border-purple-600',
    green: 'border-success-green'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      ></div>
      {message && (
        <p className="mt-4 text-gray-600 text-center animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  message: PropTypes.string,
  color: PropTypes.oneOf(['orange', 'blue', 'purple', 'green'])
};

export default LoadingSpinner;
