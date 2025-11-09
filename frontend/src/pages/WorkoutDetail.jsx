import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutService } from '../services';
import Loading from '../components/Loading';

/**
 * Workout Detail Page
 * Displays complete workout information with exercises and allows starting the workout
 */
const WorkoutDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchWorkoutDetail();
  }, [id]);

  const fetchWorkoutDetail = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getById(id);
      // workoutService.getById returns response.data already
      const workoutData = response.data || response;
      setWorkout(workoutData);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError(err.error || err.response?.data?.error || err.message || 'Failed to load workout details');
    } finally {
      setLoading(false);
    }
  };

  const handleStartWorkout = () => {
    // Navigate to workout completion flow
    navigate(`/workouts/${id}/start`);
  };

  const handleEdit = () => {
    navigate(`/workouts/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await workoutService.delete(id);
      navigate('/workouts', { state: { message: 'Workout deleted successfully' } });
    } catch (err) {
      console.error('Error deleting workout:', err);
      setError(err.response?.data?.error || 'Failed to delete workout');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const calculateTotalDuration = () => {
    if (!workout?.exercises || workout.exercises.length === 0) return 0;
    return workout.exercises.reduce((total, ex) => {
      const duration = ex.duration || 0;
      const sets = ex.sets || 1;
      return total + (duration * sets);
    }, 0);
  };

  const canEdit = user?.role === 'coach' || user?.role === 'admin' || workout?.createdBy?._id === user?.id;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="large" text="Loading workout details..." />
      </div>
    );
  }

  if (error && !workout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Error Loading Workout</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/workouts')}
              className="px-6 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition"
            >
              Back to Workouts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/workouts')}
                className="mr-4 text-gray-600 hover:text-basketball-orange transition"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-court-blue">{workout?.title}</h1>
                <p className="text-sm text-gray-600">
                  By {workout?.createdBy?.name || 'Coach'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {canEdit && (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Workout Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <p className="text-gray-700 mb-4">{workout?.description}</p>
              
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  workout?.skillLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                  workout?.skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                  workout?.skillLevel === 'advanced' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {workout?.skillLevel?.charAt(0).toUpperCase() + workout?.skillLevel?.slice(1)}
                </span>
                
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {workout?.category}
                </span>

                {workout?.difficulty && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    workout.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    workout.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                  </span>
                )}

                {workout?.isAIGenerated && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center">
                    <span className="mr-1">✨</span>
                    AI Generated
                  </span>
                )}

                {workout?.isPublic && (
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Public
                  </span>
                )}
              </div>
            </div>

            {/* Start Workout Button */}
            <button
              onClick={handleStartWorkout}
              className="mt-4 md:mt-0 md:ml-6 px-8 py-4 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🏀 Start Workout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-court-blue">
                {workout?.exercises?.length || 0}
              </p>
              <p className="text-sm text-gray-600">Exercises</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-court-blue">
                {calculateTotalDuration()} min
              </p>
              <p className="text-sm text-gray-600">Est. Duration</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-court-blue">
                {workout?.targetCalories || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">Target Calories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-court-blue">
                {workout?.exercises?.reduce((total, ex) => total + (ex.sets || 1), 0) || 0}
              </p>
              <p className="text-sm text-gray-600">Total Sets</p>
            </div>
          </div>
        </div>

        {/* Exercises List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Exercises ({workout?.exercises?.length || 0})
          </h2>

          {workout?.exercises && workout.exercises.length > 0 ? (
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-basketball-orange text-white rounded-full flex items-center justify-center font-bold text-lg mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {exercise.name}
                      </h3>
                      {exercise.description && (
                        <p className="text-gray-600 mb-3">{exercise.description}</p>
                      )}
                      
                      {/* Exercise Details */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        {exercise.sets && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 mr-2">Sets:</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                              {exercise.sets}
                            </span>
                          </div>
                        )}
                        {exercise.reps && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 mr-2">Reps:</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                              {exercise.reps}
                            </span>
                          </div>
                        )}
                        {exercise.duration && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 mr-2">Duration:</span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                              {exercise.duration} min
                            </span>
                          </div>
                        )}
                        {exercise.restBetweenSets && (
                          <div className="flex items-center">
                            <span className="font-medium text-gray-700 mr-2">Rest:</span>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                              {exercise.restBetweenSets} sec
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Instructions */}
                      {exercise.instructions && exercise.instructions.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Instructions:</p>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                            {exercise.instructions.map((instruction, idx) => (
                              <li key={idx}>{instruction}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {/* Equipment */}
                      {exercise.equipment && exercise.equipment.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-2">Equipment:</p>
                          <div className="flex flex-wrap gap-2">
                            {exercise.equipment.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">🏀</span>
              <p className="text-gray-500">No exercises added to this workout yet.</p>
            </div>
          )}
        </div>

        {/* Notes Section */}
        {workout?.notes && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">📝 Notes</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{workout.notes}</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Workout?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{workout?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDetail;
