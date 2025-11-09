import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services';
import Loading from '../components/Loading';

/**
 * Workout Library Page
 * Displays all available workouts with filtering and search
 */
const WorkoutLibrary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSkillLevel, setFilterSkillLevel] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const response = await workoutService.getAll();
      setWorkouts(response.data.data || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError(err.response?.data?.error || 'Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  // Filter workouts based on search and filters
  const filteredWorkouts = workouts.filter(workout => {
    const matchesSearch = workout.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workout.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || workout.category === filterCategory;
    const matchesSkillLevel = filterSkillLevel === 'all' || workout.skillLevel === filterSkillLevel;
    const matchesDifficulty = filterDifficulty === 'all' || workout.difficulty === filterDifficulty;
    
    return matchesSearch && matchesCategory && matchesSkillLevel && matchesDifficulty;
  });

  const handleWorkoutClick = (workoutId) => {
    navigate(`/workouts/${workoutId}`);
  };

  const handleCreateWorkout = () => {
    navigate('/workouts/create');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="large" text="Loading workouts..." />
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
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-600 hover:text-basketball-orange transition"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-court-blue">🏀 Workout Library</h1>
                <p className="text-sm text-gray-600">{filteredWorkouts.length} workouts available</p>
              </div>
            </div>
            {(user?.role === 'coach' || user?.role === 'admin') && (
              <button
                onClick={handleCreateWorkout}
                className="px-4 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition"
              >
                + Create Workout
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-4">
              <input
                type="text"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="shooting">Shooting</option>
              <option value="dribbling">Dribbling</option>
              <option value="defense">Defense</option>
              <option value="conditioning">Conditioning</option>
              <option value="full-body">Full Body</option>
            </select>

            {/* Skill Level Filter */}
            <select
              value={filterSkillLevel}
              onChange={(e) => setFilterSkillLevel(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
            >
              <option value="all">All Skill Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>

            {/* Difficulty Filter */}
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            {/* Clear Filters */}
            {(searchTerm || filterCategory !== 'all' || filterSkillLevel !== 'all' || filterDifficulty !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterSkillLevel('all');
                  setFilterDifficulty('all');
                }}
                className="px-4 py-2 text-gray-600 hover:text-basketball-orange transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Workouts Grid */}
        {filteredWorkouts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkouts.map((workout) => (
              <div
                key={workout._id}
                onClick={() => handleWorkoutClick(workout._id)}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition cursor-pointer overflow-hidden"
              >
                {/* Workout Header */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {workout.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {workout.description}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* Skill Level */}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      workout.skillLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                      workout.skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                      workout.skillLevel === 'advanced' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {workout.skillLevel?.charAt(0).toUpperCase() + workout.skillLevel?.slice(1)}
                    </span>

                    {/* Category */}
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {workout.category}
                    </span>

                    {/* AI Generated */}
                    {workout.isAIGenerated && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center">
                        <span className="mr-1">✨</span>
                        AI
                      </span>
                    )}

                    {/* Public */}
                    {workout.isPublic && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Workout Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {workout.exercises?.length || 0} exercises
                    </span>
                    {workout.duration && (
                      <span>
                        ⏱️ {workout.duration} min
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    By {workout.createdBy?.name || 'Coach'}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWorkoutClick(workout._id);
                    }}
                    className="px-4 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <span className="text-6xl mb-4 block">🏀</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterCategory !== 'all' || filterSkillLevel !== 'all' || filterDifficulty !== 'all'
                ? 'No workouts match your filters'
                : 'No workouts available yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterCategory !== 'all' || filterSkillLevel !== 'all' || filterDifficulty !== 'all'
                ? 'Try adjusting your search or filters'
                : (user?.role === 'coach' || user?.role === 'admin')
                  ? 'Create your first workout to get started'
                  : 'Check back soon for new training plans'}
            </p>
            {(searchTerm || filterCategory !== 'all' || filterSkillLevel !== 'all' || filterDifficulty !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterSkillLevel('all');
                  setFilterDifficulty('all');
                }}
                className="px-6 py-3 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkoutLibrary;
