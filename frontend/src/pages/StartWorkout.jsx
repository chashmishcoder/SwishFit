import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutService, progressService } from '../services';
import Loading from '../components/Loading';

/**
 * Start Workout Page
 * Tracks workout progress in real-time and logs completion
 */
const StartWorkout = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [shootingStats, setShootingStats] = useState({}); // { exerciseIndex: { shotsMade, shotsAttempted } }
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [notes, setNotes] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [workoutMetrics, setWorkoutMetrics] = useState({
    caloriesBurned: '',
    distance: '',
    heartRate: '',
    performanceRating: 5
  });

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  useEffect(() => {
    let interval;
    if (isTimerRunning && workoutStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, workoutStartTime]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getById(id);
      // workoutService.getById returns response.data already, so we need response.data not response.data.data
      const workoutData = response.data || response;
      setWorkout(workoutData);
      
      // Initialize completed sets tracking
      const setsTracking = {};
      const shootingTracking = {};
      workoutData.exercises?.forEach((exercise, index) => {
        setsTracking[index] = [];
        shootingTracking[index] = { shotsMade: 0, shotsAttempted: 0 };
      });
      setCompletedSets(setsTracking);
      setShootingStats(shootingTracking);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError(err.error || err.response?.data?.error || err.message || 'Failed to load workout');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    if (!workoutStartTime) {
      setWorkoutStartTime(Date.now());
    }
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSet = (exerciseIndex, setIndex) => {
    setCompletedSets(prev => {
      const exerciseSets = [...(prev[exerciseIndex] || [])];
      const setId = setIndex;
      
      if (exerciseSets.includes(setId)) {
        return {
          ...prev,
          [exerciseIndex]: exerciseSets.filter(s => s !== setId)
        };
      } else {
        return {
          ...prev,
          [exerciseIndex]: [...exerciseSets, setId]
        };
      }
    });

    // Auto-start timer on first set completion
    if (!isTimerRunning && !workoutStartTime) {
      startTimer();
    }
  };

  const isExerciseComplete = (exerciseIndex) => {
    const exercise = workout?.exercises[exerciseIndex];
    if (!exercise) return false;
    
    const sets = exercise.sets || 1;
    const completedCount = completedSets[exerciseIndex]?.length || 0;
    return completedCount >= sets;
  };

  const getTotalProgress = () => {
    if (!workout?.exercises) return 0;
    
    const totalSets = workout.exercises.reduce((sum, ex) => sum + (ex.sets || 1), 0);
    const completedCount = Object.values(completedSets).reduce((sum, sets) => sum + sets.length, 0);
    
    return totalSets > 0 ? Math.round((completedCount / totalSets) * 100) : 0;
  };

  const updateShootingStats = (exerciseIndex, field, value) => {
    setShootingStats(prev => ({
      ...prev,
      [exerciseIndex]: {
        ...prev[exerciseIndex],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const isShootingWorkout = () => {
    return workout?.category === 'shooting';
  };

  const goToNextExercise = () => {
    if (currentExerciseIndex < (workout?.exercises?.length || 0) - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    }
  };

  const goToPreviousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };

  const handleMetricsChange = (e) => {
    setWorkoutMetrics({
      ...workoutMetrics,
      [e.target.name]: e.target.value
    });
  };

  const handleCompleteWorkout = () => {
    pauseTimer();
    setShowCompleteModal(true);
  };

  const submitWorkout = async () => {
    try {
      setSubmitting(true);
      
      const totalCalories = parseInt(workoutMetrics.caloriesBurned) || 0;
      const exerciseCount = workout?.exercises?.length || 1;
      const caloriesPerExercise = Math.floor(totalCalories / exerciseCount);
      
      const progressData = {
        workoutId: id,
        exerciseResults: workout?.exercises?.map((exercise, index) => {
          const baseResult = {
            exerciseId: exercise._id,
            exerciseName: exercise.name,
            completed: isExerciseComplete(index),
            sets: completedSets[index]?.length || 0,
            reps: exercise.reps || 0,
            duration: exercise.duration || 0,
            caloriesBurned: caloriesPerExercise
          };

          // Add shooting stats if it's a shooting workout
          if (isShootingWorkout() && shootingStats[index]) {
            baseResult.shotsMade = shootingStats[index].shotsMade || 0;
            baseResult.shotsAttempted = shootingStats[index].shotsAttempted || 0;
            // Calculate accuracy for this exercise
            if (baseResult.shotsAttempted > 0) {
              baseResult.accuracy = Math.round((baseResult.shotsMade / baseResult.shotsAttempted) * 100);
            }
          }

          return baseResult;
        }) || [],
        playerNotes: notes,
        rating: workoutMetrics.performanceRating ? Math.min(5, Math.ceil(workoutMetrics.performanceRating / 2)) : undefined,
        caloriesBurned: totalCalories,
        heartRateAvg: parseInt(workoutMetrics.heartRate) || undefined,
        startTime: workoutStartTime ? new Date(workoutStartTime).toISOString() : undefined,
        endTime: new Date().toISOString(),
        // completed flag is auto-calculated by backend based on exerciseResults
        completionTime: Math.floor(elapsedTime / 60)
      };

      await progressService.logProgress(progressData);
      
      // Navigate to progress page with success message
      navigate('/progress', { 
        state: { message: 'Workout logged successfully! 🎉' }
      });
    } catch (err) {
      console.error('Error logging workout:', err);
      setError(err.error || err.response?.data?.error || err.message || 'Failed to log workout');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="large" text="Loading workout..." />
      </div>
    );
  }

  if (error && !workout) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-center">
            <p className="text-xl font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate('/workouts')}
              className="px-6 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600"
            >
              Back to Workouts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = workout?.exercises[currentExerciseIndex];
  const progress = getTotalProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Timer */}
      <header className="bg-gradient-to-r from-court-blue to-basketball-orange text-white shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{workout?.title}</h1>
              <p className="text-sm opacity-90">
                Exercise {currentExerciseIndex + 1} of {workout?.exercises?.length}
              </p>
            </div>
            
            {/* Timer */}
            <div className="text-center">
              <div className="text-3xl font-bold font-mono">{formatTime(elapsedTime)}</div>
              <div className="flex gap-2 mt-2">
                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    className="px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    ▶ Start
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-sm"
                  >
                    ⏸ Pause
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
              <div
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentExercise ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Exercise Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold text-court-blue">
                  {currentExercise.name}
                </h2>
                {isExerciseComplete(currentExerciseIndex) && (
                  <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold flex items-center">
                    ✓ Complete
                  </span>
                )}
              </div>
              
              {currentExercise.description && (
                <p className="text-gray-700 text-lg mb-4">{currentExercise.description}</p>
              )}

              {/* Exercise Stats */}
              <div className="flex flex-wrap gap-4 mb-4">
                {currentExercise.sets && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-2">Sets:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-semibold">
                      {currentExercise.sets}
                    </span>
                  </div>
                )}
                {currentExercise.reps && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-2">Reps:</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg font-semibold">
                      {currentExercise.reps}
                    </span>
                  </div>
                )}
                {currentExercise.duration && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-2">Duration:</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg font-semibold">
                      {currentExercise.duration} min
                    </span>
                  </div>
                )}
                {currentExercise.restBetweenSets && (
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 mr-2">Rest:</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
                      {currentExercise.restBetweenSets}s
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Set Tracker */}
            {currentExercise.sets && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Track Your Sets</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {Array.from({ length: currentExercise.sets }, (_, i) => {
                    const isCompleted = completedSets[currentExerciseIndex]?.includes(i);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleSet(currentExerciseIndex, i)}
                        className={`aspect-square rounded-lg font-semibold text-lg transition ${
                          isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-basketball-orange'
                        }`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {completedSets[currentExerciseIndex]?.length || 0} of {currentExercise.sets} sets completed
                </p>
              </div>
            )}

            {/* Shooting Stats Tracker (for shooting workouts) */}
            {isShootingWorkout() && (
              <div className="mb-6 p-4 bg-orange-50 border-2 border-basketball-orange rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  🏀 Shooting Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shots Attempted
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={shootingStats[currentExerciseIndex]?.shotsAttempted || 0}
                      onChange={(e) => updateShootingStats(currentExerciseIndex, 'shotsAttempted', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-basketball-orange"
                      placeholder="Enter total shots attempted"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shots Made
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={shootingStats[currentExerciseIndex]?.shotsAttempted || 999}
                      value={shootingStats[currentExerciseIndex]?.shotsMade || 0}
                      onChange={(e) => updateShootingStats(currentExerciseIndex, 'shotsMade', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-basketball-orange"
                      placeholder="Enter shots made"
                    />
                  </div>
                </div>
                {shootingStats[currentExerciseIndex]?.shotsAttempted > 0 && (
                  <div className="mt-3 p-3 bg-white rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Accuracy:</span>
                      <span className="text-2xl font-bold text-basketball-orange">
                        {Math.round((shootingStats[currentExerciseIndex]?.shotsMade / shootingStats[currentExerciseIndex]?.shotsAttempted) * 100) || 0}%
                      </span>
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-600 mt-2">
                  💡 Track your shooting performance for this exercise
                </p>
              </div>
            )}

            {/* Instructions */}
            {currentExercise.instructions && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">📋 Instructions</h3>
                {Array.isArray(currentExercise.instructions) ? (
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    {currentExercise.instructions.map((instruction, idx) => (
                      <li key={idx} className="leading-relaxed">{instruction}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-gray-700 leading-relaxed">{currentExercise.instructions}</p>
                )}
              </div>
            )}

            {/* Equipment */}
            {currentExercise.equipment && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">🏀 Equipment Needed</h3>
                {Array.isArray(currentExercise.equipment) ? (
                  <div className="flex flex-wrap gap-2">
                    {currentExercise.equipment.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">{currentExercise.equipment}</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                onClick={goToPreviousExercise}
                disabled={currentExerciseIndex === 0}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              {currentExerciseIndex === (workout?.exercises?.length || 0) - 1 ? (
                <button
                  onClick={handleCompleteWorkout}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition shadow-lg"
                >
                  Complete Workout ✓
                </button>
              ) : (
                <button
                  onClick={goToNextExercise}
                  className="px-6 py-3 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No exercises in this workout</p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(`/workouts/${id}`)}
            className="flex-1 px-4 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 transition"
          >
            View Full Workout
          </button>
          <button
            onClick={handleCompleteWorkout}
            className="flex-1 px-4 py-3 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition"
          >
            Finish Early
          </button>
        </div>
      </main>

      {/* Complete Workout Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-court-blue mb-4">
              🎉 Complete Your Workout
            </h2>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-xl font-bold text-court-blue">{formatTime(elapsedTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion</p>
                  <p className="text-xl font-bold text-court-blue">{progress}%</p>
                </div>
              </div>
            </div>

            {/* Metrics Form */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    name="caloriesBurned"
                    value={workoutMetrics.caloriesBurned}
                    onChange={handleMetricsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange"
                    placeholder="e.g., 250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="distance"
                    value={workoutMetrics.distance}
                    onChange={handleMetricsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange"
                    placeholder="e.g., 5.2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Average Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={workoutMetrics.heartRate}
                  onChange={handleMetricsChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange"
                  placeholder="e.g., 145"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Rating: {workoutMetrics.performanceRating}/10
                </label>
                <input
                  type="range"
                  name="performanceRating"
                  min="1"
                  max="10"
                  value={workoutMetrics.performanceRating}
                  onChange={handleMetricsChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange"
                  placeholder="How did you feel? Any observations?"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCompleteModal(false);
                  startTimer();
                }}
                disabled={submitting}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Continue Workout
              </button>
              <button
                onClick={submitWorkout}
                disabled={submitting}
                className="px-6 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save & Finish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartWorkout;
