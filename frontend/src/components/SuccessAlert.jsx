/**
 * Success Alert Component
 * Displays success messages with styling
 */
const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 relative">
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="text-2xl">&times;</span>
        </button>
      )}
    </div>
  );
};

export default SuccessAlert;
