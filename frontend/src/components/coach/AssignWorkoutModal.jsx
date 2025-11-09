import { useState, useEffect } from 'react';

const AssignWorkoutModal = ({ player, onClose, onAssigned }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      
      const response = await fetch(`${API_URL}/workouts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setWorkouts(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedWorkout) {
      setError('Please select a workout');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const response = await fetch(`${API_URL}/coach/assign-workout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          playerIds: [player._id],
          workoutId: selectedWorkout._id
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign workout');
      }

      setSuccess(true);
      setTimeout(() => {
        onAssigned();
      }, 1500);

    } catch (err) {
      console.error('Error assigning workout:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter workouts
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || workout.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'all' || workout.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Assign Workout</h2>
            <p className="text-sm text-gray-600 mt-1">
              Select a workout to assign to <span className="font-medium text-gray-900">{player.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Workout Assigned!</h3>
              <p className="text-gray-600">The workout has been successfully assigned to {player.name}.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Search and Filters */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search workouts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
                  >
                    <option value="all">All Categories</option>
                    <option value="shooting">Shooting</option>
                    <option value="dribbling">Dribbling</option>
                    <option value="passing">Passing</option>
                    <option value="defense">Defense</option>
                    <option value="conditioning">Conditioning</option>
                  </select>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <p className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{filteredWorkouts.length}</span> of <span className="font-semibold">{workouts.length}</span> workouts
                </p>
              </div>

              {/* Workouts List */}
              {loading && workouts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading workouts...</p>
                </div>
              ) : filteredWorkouts.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto mb-6">
                  {filteredWorkouts.map((workout) => (
                    <button
                      key={workout._id}
                      onClick={() => setSelectedWorkout(workout)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedWorkout?._id === workout._id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                      disabled={loading}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{workout.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{workout.description}</p>
                        </div>
                        {selectedWorkout?._id === workout._id && (
                          <svg className="w-6 h-6 text-orange-500 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                          ⏱️ {workout.estimatedDuration} min
                        </span>
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full font-medium">
                          🎯 {workout.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(workout.difficulty)}`}>
                          📊 {workout.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                          {workout.exercises?.length || 0} exercises
                        </span>
                      </div>

                      {/* Show exercises if selected */}
                      {selectedWorkout?._id === workout._id && workout.exercises && workout.exercises.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-orange-200">
                          <p className="text-sm font-medium text-gray-700 mb-2">Exercises:</p>
                          <div className="space-y-2">
                            {workout.exercises.slice(0, 3).map((exercise, index) => (
                              <div key={index} className="text-sm text-gray-600 flex items-start">
                                <span className="text-orange-500 mr-2">{index + 1}.</span>
                                <span>{exercise.name}</span>
                              </div>
                            ))}
                            {workout.exercises.length > 3 && (
                              <p className="text-sm text-gray-500 italic">
                                +{workout.exercises.length - 3} more exercises
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Workouts Found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || filterCategory !== 'all' || filterDifficulty !== 'all'
                      ? 'Try adjusting your search or filters'
                      : 'No workouts available to assign'}
                  </p>
                  {(searchTerm || filterCategory !== 'all' || filterDifficulty !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterCategory('all');
                        setFilterDifficulty('all');
                      }}
                      className="text-orange-500 hover:text-orange-600 font-medium text-sm"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={loading || !selectedWorkout}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Assigning...
                    </>
                  ) : (
                    'Assign Workout'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignWorkoutModal;
