import { useState } from 'react';

const AIWorkoutModal = ({ player, onClose, onWorkoutCreated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedWorkout, setGeneratedWorkout] = useState(null);
  const [assignToAll, setAssignToAll] = useState(false);
  const [workoutParams, setWorkoutParams] = useState({
    focusArea: 'shooting',
    difficulty: player?.skillLevel || 'intermediate',
    duration: 30
  });

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      
      // Generate AI workout using the workout generation endpoint
      const response = await fetch(`${API_URL}/workouts/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category: workoutParams.focusArea,
          skillLevel: workoutParams.difficulty,
          duration: workoutParams.duration,
          playerName: player?.name || 'Player'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate workout');
      }

      const result = await response.json();
      
      // Validate response structure
      if (!result || !result.data) {
        throw new Error('Invalid response from server');
      }
      
      if (!result.data._id) {
        console.error('Generated workout missing _id:', result.data);
        throw new Error('Generated workout is missing ID');
      }
      
      setGeneratedWorkout(result.data);

    } catch (err) {
      console.error('Error generating workout:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    // Validate workout and player data
    if (!generatedWorkout) {
      setError('No workout generated yet');
      return;
    }
    
    if (!generatedWorkout._id) {
      setError('Generated workout is missing ID');
      return;
    }
    
    // If no player is selected, automatically assign to all players
    const shouldAssignToAll = !player || assignToAll;
    
    if (!shouldAssignToAll && (!player || !player._id)) {
      setError('Player information is missing');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      
      // Assign workout to player(s)
      const endpoint = shouldAssignToAll 
        ? `${API_URL}/coach/assign-workout-all`
        : `${API_URL}/coach/assign-workout`;
      
      const body = shouldAssignToAll
        ? { workoutId: generatedWorkout._id }
        : { playerIds: [player._id], workoutId: generatedWorkout._id };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || errorData.message || 'Failed to assign workout');
      }

      onWorkoutCreated();

    } catch (err) {
      console.error('Error assigning workout:', err);
      // Extract the most helpful error message
      const errorMessage = err.message || 'Failed to assign workout';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const focusAreas = [
    { value: 'shooting', label: '🎯 Shooting', description: 'Focus on accuracy and shot mechanics' },
    { value: 'dribbling', label: '⚡ Dribbling', description: 'Ball handling and control' },
    { value: 'passing', label: '🎾 Passing', description: 'Precision and decision making' },
    { value: 'defense', label: '🛡️ Defense', description: 'Positioning and footwork' },
    { value: 'conditioning', label: '💪 Conditioning', description: 'Endurance and stamina' },
    { value: 'full-body', label: '🏀 Full Body', description: 'Complete basketball workout' }
  ];

  const difficulties = [
    { value: 'beginner', label: 'Beginner', color: 'green' },
    { value: 'intermediate', label: 'Intermediate', color: 'blue' },
    { value: 'advanced', label: 'Advanced', color: 'purple' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Workout Generator
            </h2>
            {player && (
              <p className="text-sm text-white/90 mt-1">
                Generating personalized workout for <span className="font-medium">{player.name}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {!generatedWorkout ? (
            <>
              {/* Configuration Section */}
              <div className="space-y-6">
                {/* Focus Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Focus Area *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {focusAreas.map((area) => (
                      <button
                        key={area.value}
                        type="button"
                        onClick={() => setWorkoutParams({ ...workoutParams, focusArea: area.value })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          workoutParams.focusArea === area.value
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        disabled={loading}
                      >
                        <p className="font-medium text-gray-900 mb-1">{area.label}</p>
                        <p className="text-xs text-gray-600">{area.description}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Difficulty Level *
                  </label>
                  <div className="flex space-x-3">
                    {difficulties.map((diff) => (
                      <button
                        key={diff.value}
                        type="button"
                        onClick={() => setWorkoutParams({ ...workoutParams, difficulty: diff.value })}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                          workoutParams.difficulty === diff.value
                            ? `border-${diff.color}-500 bg-${diff.color}-50 text-${diff.color}-700`
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                        disabled={loading}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration: {workoutParams.duration} minutes
                  </label>
                  <input
                    type="range"
                    min="15"
                    max="90"
                    step="15"
                    value={workoutParams.duration}
                    onChange={(e) => setWorkoutParams({ ...workoutParams, duration: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    disabled={loading}
                  />
                  <div className="flex justify-between text-xs text-gray-600 mt-1">
                    <span>15 min</span>
                    <span>30 min</span>
                    <span>45 min</span>
                    <span>60 min</span>
                    <span>75 min</span>
                    <span>90 min</span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-700">
                      <p className="font-medium mb-1">AI-Powered Workout Generation</p>
                      <p>Our AI will create a personalized workout plan based on the selected parameters and the player's current skill level.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating Workout...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Generate AI Workout
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Generated Workout Display */}
              <div className="space-y-6">
                {/* Workout Header */}
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{generatedWorkout.title}</h3>
                  <p className="text-gray-700 mb-4">{generatedWorkout.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                      ⏱️ {generatedWorkout.duration || 30} minutes
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
                      🎯 {generatedWorkout.category}
                    </span>
                    <span className={`px-3 py-1 bg-white rounded-full text-sm font-medium border ${
                      generatedWorkout.skillLevel === 'beginner' ? 'text-green-700 border-green-300' :
                      generatedWorkout.skillLevel === 'intermediate' ? 'text-blue-700 border-blue-300' :
                      'text-purple-700 border-purple-300'
                    }`}>
                      📊 {generatedWorkout.skillLevel}
                    </span>
                  </div>
                </div>

                {/* Exercises List */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Exercises ({generatedWorkout.exercises?.length || 0})</h4>
                  <div className="space-y-3">
                    {generatedWorkout.exercises?.map((exercise, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600 mr-3 flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 mb-1">{exercise.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {exercise.sets && (
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded">
                                  {exercise.sets} sets
                                </span>
                              )}
                              {exercise.reps && (
                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded">
                                  {exercise.reps} reps
                                </span>
                              )}
                              {exercise.duration && (
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded">
                                  {exercise.duration} sec
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assignment Options */}
                {player && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignToAll}
                        onChange={(e) => setAssignToAll(e.target.checked)}
                        className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        disabled={loading}
                      />
                      <div>
                        <p className="font-medium text-gray-900">Assign to all my players</p>
                        <p className="text-sm text-gray-600">This workout will be assigned to all players you coach</p>
                      </div>
                    </label>
                  </div>
                )}

                {/* Assignment Options - Show "Assign to All" when no specific player */}
                {!player && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Workout Ready to Assign</p>
                        <p>Click the button below to assign this workout to all your players.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setGeneratedWorkout(null)}
                    className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                    disabled={loading}
                  >
                    Generate New
                  </button>
                  
                  {(player || !player) && (
                    <button
                      onClick={handleAssign}
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      disabled={loading}
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
                        <>
                          {!player ? 'Assign to All Players' : (assignToAll ? 'Assign to All Players' : 'Assign to Player')}
                          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWorkoutModal;
