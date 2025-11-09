import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { workoutService, progressService, leaderboardService, coachService } from '../services';
import Loading from '../components/Loading';
import { Link, useNavigate } from 'react-router-dom';

/**
 * Player Dashboard
 * Main dashboard for players showing stats and workouts
 */
const PlayerDashboard = () => {
  const { user, logout } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    workoutsThisWeek: 0,
    currentStreak: 0,
    avgAccuracy: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Check if user is coach/admin for different data fetching
      const isCoach = user?.role === 'coach' || user?.role === 'admin';
      
      if (isCoach) {
        // Fetch coach-specific data
        const [workoutsRes, coachStatsRes] = await Promise.all([
          workoutService.getMyCreated().catch(err => ({ data: [] })),
          coachService.getDashboardStats().catch(err => ({ data: { data: { overview: {} } } }))
        ]);
        
        setWorkouts(workoutsRes.data || []);
        
        const coachStats = coachStatsRes.data?.data?.overview || {};
        
        setStats({
          workoutsThisWeek: coachStats.totalPlayers || 0,
          currentStreak: coachStats.totalWorkouts || 0,
          avgAccuracy: coachStats.avgAccuracy || 0
        });
      } else {
        // Fetch player-specific data
        const [workoutsRes, statsRes, leaderboardRes] = await Promise.all([
          workoutService.getAll().catch(err => ({ data: [] })),
          progressService.getWorkoutStats(user.id).catch(err => ({ data: { data: { overallStats: null } } })),
          leaderboardService.getMyRank().catch(err => ({ data: { data: null } }))
        ]);
        
        setWorkouts(workoutsRes.data || []);
        
        // Calculate workouts this week
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay())); // Start of week (Sunday)
        weekStart.setHours(0, 0, 0, 0);
        
        // Get progress data for this week
        const progressRes = await progressService.getMyProgress({ 
          startDate: weekStart.toISOString() 
        }).catch(err => ({ data: { data: [] } }));
        
        const weeklyWorkouts = progressRes.data?.data?.filter(p => p.completed)?.length || 0;
        
        // Extract stats from responses
        const workoutStats = statsRes.data?.data?.overallStats || statsRes.data?.overallStats;
        const leaderboardData = leaderboardRes.data?.data || leaderboardRes.data;
        
        // Extract playerEntry from leaderboard data
        const playerEntry = leaderboardData?.playerEntry || leaderboardData;
        
        setStats({
          workoutsThisWeek: weeklyWorkouts,
          currentStreak: playerEntry?.currentStreak || 0,
          avgAccuracy: workoutStats?.avgAccuracy ? Math.round(workoutStats.avgAccuracy) : 0
        });
      }
      
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkouts = async () => {
    try {
      const response = await workoutService.getAll();
      setWorkouts(response.data || []);
    } catch (err) {
      console.error('Error fetching workouts:', err);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-3xl mr-3">🏀</span>
              <h1 className="text-2xl font-bold text-court-blue">SwishFit India</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-basketball-orange transition font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/progress"
                className="text-gray-700 hover:text-basketball-orange transition font-medium"
              >
                📊 Progress
              </Link>
              <Link
                to="/ai-analysis"
                className="text-gray-700 hover:text-basketball-orange transition font-medium"
              >
                🤖 AI Analysis
              </Link>
              <Link
                to="/leaderboard"
                className="text-gray-700 hover:text-basketball-orange transition font-medium"
              >
                🏆 Leaderboard
              </Link>
              {(user?.role === 'coach' || user?.role === 'admin') && (
                <Link
                  to="/coach/portal"
                  className="text-gray-700 hover:text-basketball-orange transition font-medium"
                >
                  👨‍🏫 Coach Portal
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-basketball-orange transition font-medium"
                >
                  🛡️ Admin Panel
                </Link>
              )}
              <Link
                to="/workouts"
                className="text-gray-700 hover:text-basketball-orange transition font-medium"
              >
                Workouts
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-basketball-orange transition font-medium"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with Role Badge */}
        <div className={`mb-8 p-6 rounded-xl ${
          user?.role === 'coach' ? 'bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-200' :
          user?.role === 'admin' ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300' :
          'bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name}! 🏀
                </h2>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user?.role === 'coach' ? 'bg-purple-500 text-white' :
                  user?.role === 'admin' ? 'bg-gray-700 text-white' :
                  'bg-basketball-orange text-white'
                }`}>
                  {user?.role === 'coach' ? '👨‍🏫 Coach' :
                   user?.role === 'admin' ? '🛡️ Admin' :
                   '🏀 Player'}
                </span>
              </div>
              <p className="text-gray-700 font-medium">
                {user?.role === 'player' ? 'Ready for your next training session?' : 
                 user?.role === 'coach' ? 'Manage your players and track their progress' :
                 'Full system access - manage users, workouts, and analytics'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Different for Players vs Coaches */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {user?.role === 'player' ? (
            <>
              {/* Player Stats - Workouts This Week */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium uppercase">Workouts This Week</h3>
                  <span className="text-3xl">💪</span>
                </div>
                <p className="text-4xl font-bold text-basketball-orange">{stats.workoutsThisWeek}</p>
                <p className="text-sm text-gray-500 mt-2">Keep it up!</p>
              </div>

              {/* Player Stats - Current Streak */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium uppercase">Current Streak</h3>
                  <span className="text-3xl">🔥</span>
                </div>
                <p className="text-4xl font-bold text-success-green">{stats.currentStreak} days</p>
                <p className="text-sm text-gray-500 mt-2">Amazing consistency!</p>
              </div>

              {/* Player Stats - Average Accuracy */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium uppercase">Avg Accuracy</h3>
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-4xl font-bold text-court-blue">{stats.avgAccuracy}%</p>
                <p className="text-sm text-gray-500 mt-2">Getting better!</p>
              </div>
            </>
          ) : (
            <>
              {/* Coach Stats - Total Players */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium uppercase">Players Managed</h3>
                  <span className="text-3xl">👥</span>
                </div>
                <p className="text-4xl font-bold text-purple-600">{stats.workoutsThisWeek}</p>
                <p className="text-sm text-gray-500 mt-2">Active players</p>
              </div>

              {/* Coach Stats - Workouts Created */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-indigo-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium uppercase">Workouts Created</h3>
                  <span className="text-3xl">📋</span>
                </div>
                <p className="text-4xl font-bold text-indigo-600">{stats.currentStreak}</p>
                <p className="text-sm text-gray-500 mt-2">Training programs</p>
              </div>

              {/* Coach Stats - Player Avg Accuracy */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-500 text-sm font-medium uppercase">Player Avg Accuracy</h3>
                  <span className="text-3xl">🎯</span>
                </div>
                <p className="text-4xl font-bold text-court-blue">{stats.avgAccuracy}%</p>
                <p className="text-sm text-gray-500 mt-2">Team performance</p>
              </div>
            </>
          )}
        </div>

        {/* Quick Access Cards - Phase 3 Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress Charts Card */}
          <Link
            to="/progress"
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Track Your Progress</h3>
              <span className="text-3xl">📊</span>
            </div>
            <p className="text-sm text-blue-100 mb-4">
              View detailed analytics, charts, and insights about your training performance
            </p>
            <div className="flex items-center text-sm font-medium">
              <span>View Charts</span>
              <span className="ml-2">→</span>
            </div>
          </Link>

          {/* AI Analysis Card */}
          <Link
            to="/ai-analysis"
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">AI Performance Analysis</h3>
              <span className="text-3xl">🤖</span>
            </div>
            <p className="text-sm text-purple-100 mb-4">
              Get personalized insights and recommendations powered by AI
            </p>
            <div className="flex items-center text-sm font-medium">
              <span>Get AI Insights</span>
              <span className="ml-2">→</span>
            </div>
          </Link>

          {/* Leaderboard Card */}
          <Link
            to="/leaderboard"
            className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">View Leaderboard</h3>
              <span className="text-3xl">🏆</span>
            </div>
            <p className="text-sm text-yellow-100 mb-4">
              See how you rank against other players and compete for the top spot
            </p>
            <div className="flex items-center text-sm font-medium">
              <span>Check Rankings</span>
              <span className="ml-2">→</span>
            </div>
          </Link>

          {/* Coach Portal Card - Only for Coaches/Admins */}
          {(user?.role === 'coach' || user?.role === 'admin') && (
            <Link
              to="/coach/portal"
              className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 text-white"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Coach Portal</h3>
                <span className="text-3xl">👨‍🏫</span>
              </div>
              <p className="text-sm text-purple-100 mb-4">
                Manage your players, assign workouts, and provide personalized feedback
              </p>
              <div className="flex items-center text-sm font-medium">
                <span>Open Portal</span>
                <span className="ml-2">→</span>
              </div>
            </Link>
          )}

          {/* Admin Dashboard Card - Only for Admins */}
          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-md p-6 hover:shadow-xl transition transform hover:-translate-y-1 text-white"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Admin Dashboard</h3>
                <span className="text-3xl">🛡️</span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                Manage users, workouts, leaderboard, and view system analytics
              </p>
              <div className="flex items-center text-sm font-medium">
                <span>Open Dashboard</span>
                <span className="ml-2">→</span>
              </div>
            </Link>
          )}
        </div>

        {/* Workouts Section - Different for Players vs Coaches */}
        <div className={`bg-white rounded-xl shadow-md ${
          user?.role === 'coach' || user?.role === 'admin' ? 'border-2 border-purple-200' : 'border-2 border-orange-200'
        }`}>
          <div className={`p-6 border-b ${
            user?.role === 'coach' || user?.role === 'admin' ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user?.role === 'coach' || user?.role === 'admin' ? 'My Created Workouts' : 'Your Assigned Workouts'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {user?.role === 'coach' || user?.role === 'admin' 
                    ? 'Workouts you\'ve created for your players' 
                    : 'Training programs assigned to you'}
                </p>
              </div>
              {(user?.role === 'coach' || user?.role === 'admin') && (
                <Link
                  to="/workouts/create"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Create Workout</span>
                </Link>
              )}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loading size="large" text="Loading workouts..." />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={fetchWorkouts}
                  className="px-4 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Try Again
                </button>
              </div>
            ) : workouts.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">
                  {user?.role === 'coach' || user?.role === 'admin' ? '📋' : '🏀'}
                </span>
                <p className="text-gray-500 text-lg mb-4">
                  {user?.role === 'coach' || user?.role === 'admin' 
                    ? 'No workouts created yet.' 
                    : 'No workouts assigned yet.'}
                </p>
                <p className="text-gray-400 text-sm">
                  {user?.role === 'coach' || user?.role === 'admin'
                    ? 'Create your first workout to get started!'
                    : 'Check back soon for new training plans!'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {workouts.map((workout) => (
                  <div
                    key={workout._id}
                    className={`border-2 rounded-lg p-5 hover:shadow-md transition cursor-pointer ${
                      user?.role === 'coach' || user?.role === 'admin'
                        ? 'border-purple-200 hover:border-purple-400 bg-gradient-to-r from-white to-purple-50'
                        : 'border-orange-200 hover:border-orange-400'
                    }`}
                    onClick={() => navigate(`/workouts/${workout._id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {(user?.role === 'coach' || user?.role === 'admin') && (
                            <span className="text-lg">👨‍🏫</span>
                          )}
                          <h3 className="text-xl font-semibold text-gray-900">
                            {workout.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {workout.description}
                        </p>
                        
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          {/* Skill Level Badge */}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            workout.skillLevel === 'beginner' ? 'bg-green-100 text-green-800' :
                            workout.skillLevel === 'intermediate' ? 'bg-blue-100 text-blue-800' :
                            workout.skillLevel === 'advanced' ? 'bg-purple-100 text-purple-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {workout.skillLevel?.charAt(0).toUpperCase() + workout.skillLevel?.slice(1)}
                          </span>
                          
                          {/* Category Badge */}
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                            {workout.category}
                          </span>
                          
                          {/* AI Generated Badge */}
                          {workout.isAIGenerated && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium flex items-center">
                              <span className="mr-1">✨</span>
                              AI Generated
                            </span>
                          )}
                          
                          {/* Public Badge */}
                          {workout.isPublic && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                              Public
                            </span>
                          )}
                        </div>
                        
                        {/* Workout Info */}
                        {workout.exercises && (
                          <p className="text-sm text-gray-500 mt-3">
                            {workout.exercises.length} exercises
                          </p>
                        )}
                      </div>
                      
                      {/* Start Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/workouts/${workout._id}`);
                        }}
                        className="ml-4 px-6 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition font-semibold whitespace-nowrap"
                      >
                        Start
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerDashboard;
