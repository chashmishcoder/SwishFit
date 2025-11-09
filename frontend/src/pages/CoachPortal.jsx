import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { coachService } from '../services';
import PlayerCard from '../components/coach/PlayerCard';
import FeedbackModal from '../components/coach/FeedbackModal';
import AIWorkoutModal from '../components/coach/AIWorkoutModal';
import AssignWorkoutModal from '../components/coach/AssignWorkoutModal';

const CoachPortal = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showAIWorkoutModal, setShowAIWorkoutModal] = useState(false);
  const [showAssignWorkoutModal, setShowAssignWorkoutModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSkillLevel, setFilterSkillLevel] = useState('all');

  useEffect(() => {
    fetchCoachData();
  }, []);

  const fetchCoachData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch assigned players using coachService
      const playersResponse = await coachService.getMyPlayers();
      setPlayers(playersResponse.data.data || []);

      // Fetch dashboard stats using coachService
      try {
        const statsResponse = await coachService.getDashboardStats();
        setDashboardStats(statsResponse.data.data);
      } catch (statsErr) {
        console.warn('Dashboard stats not available:', statsErr);
      }

    } catch (err) {
      console.error('Error fetching coach data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch coach data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProgress = (player) => {
    window.location.href = `/coach/player/${player._id}/progress`;
  };

  const handleAddFeedback = (player) => {
    setSelectedPlayer(player);
    setShowFeedbackModal(true);
  };

  const handleGenerateAIWorkout = (player) => {
    setSelectedPlayer(player);
    setShowAIWorkoutModal(true);
  };

  const handleAssignWorkout = (player) => {
    setSelectedPlayer(player);
    setShowAssignWorkoutModal(true);
  };

  const handleFeedbackSubmitted = () => {
    setShowFeedbackModal(false);
    setSelectedPlayer(null);
    fetchCoachData(); // Refresh data
  };

  const handleWorkoutAssigned = () => {
    setShowAssignWorkoutModal(false);
    setShowAIWorkoutModal(false);
    setSelectedPlayer(null);
    fetchCoachData(); // Refresh data
  };

  // Filter players
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         player.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = filterSkillLevel === 'all' || player.skillLevel === filterSkillLevel;
    return matchesSearch && matchesSkill;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading coach portal...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-center">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Error Loading Portal</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchCoachData}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, Coach Rajesh Kumar! 🏀
                </h1>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-500 text-white">
                  👨‍🏫 Coach
                </span>
              </div>
              <p className="text-gray-700 font-medium">
                Manage your players and track their progress
              </p>
            </div>

            <button
              onClick={() => setShowAIWorkoutModal(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all shadow-lg inline-flex items-center whitespace-nowrap self-start"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate AI Workout
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Players</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats.overview?.totalPlayers || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active This Week</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats.overview?.activeThisWeek || 0}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Workouts</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats.overview?.totalWorkouts || 0}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Completion</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dashboardStats.overview?.avgCompletionRate?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search players by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={filterSkillLevel}
                onChange={(e) => setFilterSkillLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                <option value="all">All Skill Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <button
                onClick={fetchCoachData}
                className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
                title="Refresh data"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <p>
              Showing <span className="font-semibold text-gray-900">{filteredPlayers.length}</span> of <span className="font-semibold text-gray-900">{players.length}</span> players
            </p>
          </div>
        </div>

        {/* Players Grid */}
        {filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map(player => (
              <PlayerCard
                key={player._id}
                player={player}
                onViewProgress={handleViewProgress}
                onAddFeedback={handleAddFeedback}
                onGenerateAIWorkout={handleGenerateAIWorkout}
                onAssignWorkout={handleAssignWorkout}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm || filterSkillLevel !== 'all' ? 'No Players Found' : 'No Players Assigned Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterSkillLevel !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Contact an administrator to assign players to your coaching profile'}
            </p>
            {(searchTerm || filterSkillLevel !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterSkillLevel('all');
                }}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Top Performers Section */}
        {dashboardStats?.topPerformers && dashboardStats.topPerformers.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ⭐ Top Performers This Month
            </h2>
            <div className="space-y-3">
              {dashboardStats.topPerformers.slice(0, 5).map((player, index) => (
                <div key={player._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-200 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{player.name}</p>
                      <p className="text-sm text-gray-600">{player.workoutsCompleted} workouts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-orange-600">
                      {player.avgAccuracy?.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600">accuracy</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFeedbackModal && selectedPlayer && (
        <FeedbackModal
          player={selectedPlayer}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedPlayer(null);
          }}
          onSubmit={handleFeedbackSubmitted}
        />
      )}

      {showAIWorkoutModal && (
        <AIWorkoutModal
          player={selectedPlayer}
          onClose={() => {
            setShowAIWorkoutModal(false);
            setSelectedPlayer(null);
          }}
          onWorkoutCreated={handleWorkoutAssigned}
        />
      )}

      {showAssignWorkoutModal && selectedPlayer && (
        <AssignWorkoutModal
          player={selectedPlayer}
          onClose={() => {
            setShowAssignWorkoutModal(false);
            setSelectedPlayer(null);
          }}
          onAssigned={handleWorkoutAssigned}
        />
      )}
    </div>
  );
};

export default CoachPortal;
