import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { leaderboardService } from '../services';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import PlayerComparisonModal from '../components/leaderboard/PlayerComparisonModal';
import AchievementsBadge from '../components/leaderboard/AchievementsBadge';

const Leaderboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [stats, setStats] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonPlayer, setComparisonPlayer] = useState(null);
  
  // Filters
  const [leaderboardType, setLeaderboardType] = useState('global'); // global, team, skill
  const [period, setPeriod] = useState('all'); // all, weekly, monthly
  const [skillLevel, setSkillLevel] = useState('all'); // for skill-based leaderboard
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    fetchLeaderboardData();
  }, [leaderboardType, period, skillLevel, limit]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      let leaderboardResponse;
      let warningMessage = null;
      const queryParams = { limit };
      
      if (period !== 'all') {
        queryParams.period = period;
      }

      // Fetch leaderboard based on type
      if (leaderboardType === 'global') {
        leaderboardResponse = await leaderboardService.getGlobalLeaderboard(queryParams);
      } else if (leaderboardType === 'team') {
        // Check if user has a team
        if (user?.teamId || user?.team) {
          const teamId = user.teamId?._id || user.teamId || user.team?._id || user.team;
          leaderboardResponse = await leaderboardService.getTeamLeaderboard(teamId, queryParams);
        } else {
          // Fallback to global if user has no team
          warningMessage = 'You are not assigned to a team. Showing global leaderboard instead.';
          leaderboardResponse = await leaderboardService.getGlobalLeaderboard(queryParams);
          // Switch back to global view
          setLeaderboardType('global');
        }
      } else if (leaderboardType === 'skill') {
        if (skillLevel !== 'all') {
          leaderboardResponse = await leaderboardService.getSkillLevelLeaderboard(skillLevel, queryParams);
        } else {
          // If 'all' is selected, show global leaderboard instead
          warningMessage = 'Showing global leaderboard for all skill levels.';
          leaderboardResponse = await leaderboardService.getGlobalLeaderboard(queryParams);
        }
      }

      // Extract data from response
      const data = leaderboardResponse?.data?.data || leaderboardResponse?.data || [];
      setLeaderboardData(Array.isArray(data) ? data : []);

      // Fetch my rank
      try {
        const rankResponse = await leaderboardService.getMyRank();
        const myRankData = rankResponse?.data?.data || rankResponse?.data;
        setMyRank(myRankData);
      } catch (rankErr) {
        console.warn('Rank not available:', rankErr);
        setMyRank(null);
      }

      // Fetch stats
      try {
        const statsResponse = await leaderboardService.getLeaderboardStats();
        const statsData = statsResponse?.data?.data || statsResponse?.data;
        setStats(statsData);
      } catch (statsErr) {
        console.warn('Stats not available:', statsErr);
        setStats(null);
      }

      // Show warning message if any
      if (warningMessage) {
        setError(warningMessage);
        // Clear warning after 5 seconds
        setTimeout(() => setError(null), 5000);
      }

    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = (player) => {
    setComparisonPlayer(player);
    setShowComparison(true);
  };

  const getTrophyIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  if (loading && !leaderboardData.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
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
            <h3 className="text-xl font-semibold mb-2">Error Loading Leaderboard</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchLeaderboardData}
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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                🏆 Leaderboard
              </h1>
              <p className="text-gray-600">
                Compete with players and track your ranking
              </p>
            </div>

            <button
              onClick={fetchLeaderboardData}
              className="mt-4 sm:mt-0 px-4 py-2 text-orange-600 hover:text-orange-700 transition-colors flex items-center"
              disabled={loading}
            >
              <svg className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* My Rank Card - Show for players only, info message for coaches/admins */}
        {myRank && !myRank.isNonPlayer && (
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                  {getTrophyIcon(myRank.rank) || '👤'}
                </div>
                <div>
                  <p className="text-white/90 text-sm">Your Rank</p>
                  <p className="text-4xl font-bold">#{myRank.rank || 'N/A'}</p>
                  <p className="text-white/90 text-sm mt-1">{myRank.playerEntry?.playerId?.name || user?.name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 sm:mt-0">
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Total Points</p>
                  <p className="text-2xl font-bold">{myRank.playerEntry?.points?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Weekly Points</p>
                  <p className="text-2xl font-bold">{myRank.playerEntry?.weeklyPoints?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Monthly Points</p>
                  <p className="text-2xl font-bold">{myRank.playerEntry?.monthlyPoints?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white/80 text-xs mb-1">Workouts</p>
                  <p className="text-2xl font-bold">{myRank.playerEntry?.totalWorkoutsCompleted || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Info message for coaches/admins */}
        {myRank?.isNonPlayer && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  👨‍🏫 Viewing as {user?.role === 'coach' ? 'Coach' : 'Admin'}
                </h3>
                <p className="text-blue-800">
                  {myRank.message || 'Leaderboard rankings are only available for players. You can view the global leaderboard below to see how your players are performing.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Players</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.overall?.totalPlayers || 0}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Workouts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.overall?.totalWorkouts?.toLocaleString() || 0}</p>
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
                  <p className="text-sm text-gray-600 mb-1">Avg Points</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.overall?.avgPoints?.toFixed(0) || 0}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Top Score</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.topThree?.[0]?.points?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Leaderboard Type */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 mr-2">Type:</label>
              <div className="flex space-x-2">
                {[
                  { value: 'global', label: '🌍 Global' },
                  { value: 'team', label: '👥 Team' },
                  { value: 'skill', label: '📊 Skill Level' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setLeaderboardType(type.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      leaderboardType === type.value
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Period Filter (for global and team) */}
            {(leaderboardType === 'global' || leaderboardType === 'team') && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 mr-2">Period:</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  <option value="all">All Time</option>
                  <option value="weekly">This Week</option>
                  <option value="monthly">This Month</option>
                </select>
              </div>
            )}

            {/* Skill Level Filter (for skill leaderboard) */}
            {leaderboardType === 'skill' && (
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium text-gray-700 mr-2">Skill:</label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            )}

            {/* Limit */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 mr-2">Show:</label>
              <select
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white text-sm"
              >
                <option value="25">Top 25</option>
                <option value="50">Top 50</option>
                <option value="100">Top 100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <LeaderboardTable
            data={leaderboardData}
            currentUserId={user?._id}
            onCompare={handleCompare}
            getTrophyIcon={getTrophyIcon}
            loading={loading}
          />
        </div>

        {/* Empty State */}
        {!loading && leaderboardData.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Leaderboard Data</h3>
            <p className="text-gray-600 mb-6">
              Complete workouts to appear on the leaderboard
            </p>
          </div>
        )}
      </div>

      {/* Player Comparison Modal */}
      {showComparison && comparisonPlayer && (
        <PlayerComparisonModal
          player={comparisonPlayer}
          currentUser={user}
          onClose={() => {
            setShowComparison(false);
            setComparisonPlayer(null);
          }}
        />
      )}
    </div>
  );
};

export default Leaderboard;
