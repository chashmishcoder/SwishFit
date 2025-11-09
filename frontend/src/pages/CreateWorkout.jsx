import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { workoutService } from '../services';
import Loading from '../components/Loading';

/**
 * Create/Edit Workout Page
 * Allows coaches and admins to create or edit workouts
 */
const CreateWorkout = () => {
  const { id } = useParams(); // If id exists, we're editing
  const { user } = useAuth();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'strength',
    skillLevel: 'intermediate',
    difficulty: 'medium',
    targetCalories: '',
    isPublic: true,
    notes: ''
  });

  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    description: '',
    sets: 3,
    reps: 10,
    duration: '',
    restBetweenSets: 60,
    instructions: [''],
    equipment: ['']
  });

  useEffect(() => {
    if (isEdit) {
      fetchWorkout();
    }
  }, [id]);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getById(id);
      // workoutService.getById returns response.data already
      const workout = response.data || response;
      
      setFormData({
        title: workout.title || '',
        description: workout.description || '',
        category: workout.category || 'strength',
        skillLevel: workout.skillLevel || 'intermediate',
        difficulty: workout.difficulty || 'medium',
        targetCalories: workout.targetCalories || '',
        isPublic: workout.isPublic !== undefined ? workout.isPublic : true,
        notes: workout.notes || ''
      });

      setExercises(workout.exercises || []);
    } catch (err) {
      console.error('Error fetching workout:', err);
      setError(err.error || err.response?.data?.error || err.message || 'Failed to load workout');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExercise({
      ...currentExercise,
      [name]: value
    });
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...currentExercise.instructions];
    newInstructions[index] = value;
    setCurrentExercise({
      ...currentExercise,
      instructions: newInstructions
    });
  };

  const addInstruction = () => {
    setCurrentExercise({
      ...currentExercise,
      instructions: [...currentExercise.instructions, '']
    });
  };

  const removeInstruction = (index) => {
    setCurrentExercise({
      ...currentExercise,
      instructions: currentExercise.instructions.filter((_, i) => i !== index)
    });
  };

  const handleEquipmentChange = (index, value) => {
    const newEquipment = [...currentExercise.equipment];
    newEquipment[index] = value;
    setCurrentExercise({
      ...currentExercise,
      equipment: newEquipment
    });
  };

  const addEquipment = () => {
    setCurrentExercise({
      ...currentExercise,
      equipment: [...currentExercise.equipment, '']
    });
  };

  const removeEquipment = (index) => {
    setCurrentExercise({
      ...currentExercise,
      equipment: currentExercise.equipment.filter((_, i) => i !== index)
    });
  };

  const addExercise = () => {
    if (!currentExercise.name.trim()) {
      setError('Exercise name is required');
      return;
    }

    const exercise = {
      ...currentExercise,
      instructions: currentExercise.instructions.filter(i => i.trim()),
      equipment: currentExercise.equipment.filter(e => e.trim())
    };

    setExercises([...exercises, exercise]);
    
    // Reset current exercise
    setCurrentExercise({
      name: '',
      description: '',
      sets: 3,
      reps: 10,
      duration: '',
      restBetweenSets: 60,
      instructions: [''],
      equipment: ['']
    });

    setError('');
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const moveExerciseUp = (index) => {
    if (index === 0) return;
    const newExercises = [...exercises];
    [newExercises[index - 1], newExercises[index]] = [newExercises[index], newExercises[index - 1]];
    setExercises(newExercises);
  };

  const moveExerciseDown = (index) => {
    if (index === exercises.length - 1) return;
    const newExercises = [...exercises];
    [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
    setExercises(newExercises);
  };

  const generateAIWorkout = async () => {
    if (!formData.description) {
      setError('Please provide a workout description for AI generation');
      return;
    }

    try {
      setGeneratingAI(true);
      setError('');

      const response = await workoutService.generateAI({
        description: formData.description,
        category: formData.category,
        skillLevel: formData.skillLevel,
        difficulty: formData.difficulty
      });

      // workoutService.generateAI returns response.data already
      const generatedWorkout = response.data || response;
      
      if (generatedWorkout.exercises && generatedWorkout.exercises.length > 0) {
        setExercises(generatedWorkout.exercises);
        setSuccess('AI generated exercises successfully! Review and edit as needed.');
      }
    } catch (err) {
      console.error('Error generating AI workout:', err);
      setError(err.error || err.response?.data?.error || err.message || 'Failed to generate AI workout');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      setError('Workout title is required');
      return;
    }

    if (exercises.length === 0) {
      setError('Add at least one exercise to the workout');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const workoutData = {
        ...formData,
        exercises,
        targetCalories: formData.targetCalories ? parseInt(formData.targetCalories) : undefined
      };

      if (isEdit) {
        await workoutService.update(id, workoutData);
        setSuccess('Workout updated successfully!');
      } else {
        const response = await workoutService.create(workoutData);
        setSuccess('Workout created successfully!');
        // workoutService.create returns response.data already
        const createdWorkout = response.data || response;
        const newWorkoutId = createdWorkout._id;
        
        // Redirect to workout detail after 1.5 seconds
        setTimeout(() => {
          navigate(`/workouts/${newWorkoutId}`);
        }, 1500);
      }
    } catch (err) {
      console.error('Error saving workout:', err);
      setError(err.error || err.response?.data?.error || err.message || `Failed to ${isEdit ? 'update' : 'create'} workout`);
    } finally {
      setSubmitting(false);
    }
  };

  // Check permissions
  if (user?.role !== 'coach' && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600 mb-4">Only coaches and admins can create workouts.</p>
          <button
            onClick={() => navigate('/workouts')}
            className="px-6 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600"
          >
            Back to Workouts
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="large" text="Loading workout..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/workouts')}
                className="mr-4 text-gray-600 hover:text-basketball-orange transition"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-court-blue">
                {isEdit ? 'Edit Workout' : 'Create New Workout'}
              </h1>
            </div>
            
            {!isEdit && (
              <button
                onClick={generateAIWorkout}
                disabled={generatingAI || !formData.description}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center"
              >
                {generatingAI ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>✨ Generate with AI</>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Workout Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Workout Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workout Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  placeholder="e.g., Full Court Conditioning"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  placeholder="Describe the workout, its goals, and who it's for..."
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  required
                >
                  <option value="strength">Strength Training</option>
                  <option value="cardio">Cardio</option>
                  <option value="flexibility">Flexibility</option>
                  <option value="skills">Skills Training</option>
                  <option value="conditioning">Conditioning</option>
                  <option value="recovery">Recovery</option>
                </select>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level *
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="elite">Elite</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Target Calories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Calories
                </label>
                <input
                  type="number"
                  name="targetCalories"
                  value={formData.targetCalories}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  placeholder="e.g., 500"
                />
              </div>

              {/* Public/Private */}
              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPublic"
                    checked={formData.isPublic}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-basketball-orange focus:ring-basketball-orange border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Make this workout public (visible to all users)
                  </span>
                </label>
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  placeholder="Any additional tips or considerations..."
                />
              </div>
            </div>
          </div>

          {/* Add Exercise Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Exercise</h2>
            
            <div className="space-y-4">
              {/* Exercise Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exercise Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentExercise.name}
                  onChange={handleExerciseChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  placeholder="e.g., Push-ups"
                />
              </div>

              {/* Exercise Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentExercise.description}
                  onChange={handleExerciseChange}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  placeholder="Brief description of the exercise..."
                />
              </div>

              {/* Sets, Reps, Duration, Rest */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sets
                  </label>
                  <input
                    type="number"
                    name="sets"
                    value={currentExercise.sets}
                    onChange={handleExerciseChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reps
                  </label>
                  <input
                    type="number"
                    name="reps"
                    value={currentExercise.reps}
                    onChange={handleExerciseChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (min)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={currentExercise.duration}
                    onChange={handleExerciseChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rest (sec)
                  </label>
                  <input
                    type="number"
                    name="restBetweenSets"
                    value={currentExercise.restBetweenSets}
                    onChange={handleExerciseChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                    min="0"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instructions
                </label>
                {currentExercise.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={instruction}
                      onChange={(e) => handleInstructionChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                      placeholder={`Step ${index + 1}`}
                    />
                    {currentExercise.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInstruction}
                  className="text-sm text-basketball-orange hover:text-orange-600 font-medium"
                >
                  + Add Instruction
                </button>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment
                </label>
                {currentExercise.equipment.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleEquipmentChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                      placeholder="Equipment item"
                    />
                    {currentExercise.equipment.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEquipment(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEquipment}
                  className="text-sm text-basketball-orange hover:text-orange-600 font-medium"
                >
                  + Add Equipment
                </button>
              </div>

              {/* Add Exercise Button */}
              <button
                type="button"
                onClick={addExercise}
                className="w-full px-4 py-3 bg-court-blue text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                ➕ Add Exercise to Workout
              </button>
            </div>
          </div>

          {/* Exercise List */}
          {exercises.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Exercises ({exercises.length})
              </h2>
              
              <div className="space-y-4">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {index + 1}. {exercise.name}
                        </h3>
                        {exercise.description && (
                          <p className="text-gray-600 text-sm mt-1">{exercise.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                            {exercise.sets} sets
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                            {exercise.reps} reps
                          </span>
                          {exercise.duration && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
                              {exercise.duration} min
                            </span>
                          )}
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                            {exercise.restBetweenSets}s rest
                          </span>
                        </div>
                      </div>
                      
                      {/* Exercise Controls */}
                      <div className="flex gap-1 ml-4">
                        <button
                          type="button"
                          onClick={() => moveExerciseUp(index)}
                          disabled={index === 0}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                          title="Move up"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveExerciseDown(index)}
                          disabled={index === exercises.length - 1}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-30"
                          title="Move down"
                        >
                          ↓
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/workouts')}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || exercises.length === 0}
              className="px-6 py-3 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 font-semibold"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update Workout' : 'Create Workout'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateWorkout;
