import PropTypes from 'prop-types';

/**
 * WorkoutFilter Component
 * Provides filtering and search functionality for workouts
 * @param {object} filters - Current filter values
 * @param {function} onFilterChange - Callback when filters change
 */
const WorkoutFilter = ({ filters, onFilterChange }) => {
  const handleReset = () => {
    onFilterChange('skillLevel', '');
    onFilterChange('category', '');
    onFilterChange('search', '');
    onFilterChange('isAIGenerated', '');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Workouts</h3>
        <button
          onClick={handleReset}
          className="text-sm text-basketball-orange hover:text-orange-600 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search Workouts
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
            />
          </div>
        </div>

        {/* Skill Level Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skill Level
          </label>
          <select
            value={filters.skillLevel || ''}
            onChange={(e) => onFilterChange('skillLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange focus:border-transparent bg-white"
          >
            <option value="">All Levels</option>
            <option value="beginner">🟢 Beginner</option>
            <option value="intermediate">🟡 Intermediate</option>
            <option value="advanced">🔴 Advanced</option>
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            <option value="shooting">🎯 Shooting</option>
            <option value="dribbling">⚡ Dribbling</option>
            <option value="defense">🛡️ Defense</option>
            <option value="conditioning">💪 Conditioning</option>
            <option value="passing">🤝 Passing</option>
            <option value="full-body">🏀 Full Body</option>
          </select>
        </div>

        {/* AI Generated Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <select
            value={filters.isAIGenerated || ''}
            onChange={(e) => onFilterChange('isAIGenerated', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-basketball-orange focus:border-transparent bg-white"
          >
            <option value="">All Workouts</option>
            <option value="true">✨ AI Generated</option>
            <option value="false">👤 Coach Created</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.search || filters.skillLevel || filters.category || filters.isAIGenerated) && (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-600">Active filters:</span>
          
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Search: "{filters.search}"
              <button
                onClick={() => onFilterChange('search', '')}
                className="ml-2 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.skillLevel && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              {filters.skillLevel.charAt(0).toUpperCase() + filters.skillLevel.slice(1)}
              <button
                onClick={() => onFilterChange('skillLevel', '')}
                className="ml-2 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              {filters.category.charAt(0).toUpperCase() + filters.category.slice(1)}
              <button
                onClick={() => onFilterChange('category', '')}
                className="ml-2 hover:text-purple-900"
              >
                ×
              </button>
            </span>
          )}
          
          {filters.isAIGenerated && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              {filters.isAIGenerated === 'true' ? 'AI Generated' : 'Coach Created'}
              <button
                onClick={() => onFilterChange('isAIGenerated', '')}
                className="ml-2 hover:text-orange-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

WorkoutFilter.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    skillLevel: PropTypes.string,
    category: PropTypes.string,
    isAIGenerated: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default WorkoutFilter;
