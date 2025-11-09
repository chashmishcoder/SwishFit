import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import Loading from '../components/Loading';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, usersData, workoutsData, leaderboardData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllUsers({ limit: 100 }),
        adminService.getAllWorkouts({ limit: 50 }),
        adminService.getLeaderboard({ limit: 20 })
      ]);

      setStats(statsData);
      setUsers(usersData.data || []);
      setWorkouts(workoutsData.data || []);
      setLeaderboard(leaderboardData.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const analyticsData = await adminService.getAnalytics();
      setAnalytics(analyticsData.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    if (!confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      await adminService.deleteWorkout(workoutId);
      setWorkouts(workouts.filter(w => w._id !== workoutId));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete workout');
    }
  };

  const handleUpdateRankings = async () => {
    try {
      setLoading(true);
      await adminService.updateRankings();
      alert('Rankings updated successfully!');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update rankings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetWeekly = async () => {
    if (!confirm('Are you sure you want to reset all weekly points?')) return;
    
    try {
      await adminService.resetWeeklyPoints();
      alert('Weekly points reset successfully!');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reset weekly points');
    }
  };

  const handleResetMonthly = async () => {
    if (!confirm('Are you sure you want to reset all monthly points?')) return;
    
    try {
      await adminService.resetMonthlyPoints();
      alert('Monthly points reset successfully!');
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to reset monthly points');
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const userData = await adminService.getUserById(userId);
      setSelectedUser(userData.data);
      setShowUserModal(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to load user details');
    }
  };

  const handleAssignCoach = async (playerId, coachId) => {
    try {
      await adminService.assignCoach(playerId, coachId);
      alert('Coach assigned successfully!');
      fetchDashboardData();
      setShowUserModal(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to assign coach');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading && activeTab === 'overview') {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">System management and analytics</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {stats.totalPlayers || 0} players, {stats.totalCoaches || 0} coaches
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Workouts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalWorkouts || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Available in system</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeUsers || 0}</p>
              </div>
              <div className="w-12 h-12 bg-basketball-orange bg-opacity-20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-basketball-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Users with activity</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">System Health</p>
                <p className="text-3xl font-bold text-green-600">Good</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">All systems operational</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {['overview', 'users', 'workouts', 'leaderboard', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    if (tab === 'analytics' && !analytics) {
                      fetchAnalytics();
                    }
                  }}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab
                      ? 'border-basketball-orange text-basketball-orange'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={handleUpdateRankings}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-basketball-orange hover:bg-orange-50 transition-colors text-left"
                    >
                      <svg className="w-6 h-6 text-basketball-orange mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <p className="font-semibold text-gray-900">Update Rankings</p>
                      <p className="text-sm text-gray-600">Recalculate leaderboard</p>
                    </button>

                    <button
                      onClick={handleResetWeekly}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-basketball-orange hover:bg-orange-50 transition-colors text-left"
                    >
                      <svg className="w-6 h-6 text-basketball-orange mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-semibold text-gray-900">Reset Weekly</p>
                      <p className="text-sm text-gray-600">Clear weekly points</p>
                    </button>

                    <button
                      onClick={handleResetMonthly}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-basketball-orange hover:bg-orange-50 transition-colors text-left"
                    >
                      <svg className="w-6 h-6 text-basketball-orange mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-semibold text-gray-900">Reset Monthly</p>
                      <p className="text-sm text-gray-600">Clear monthly points</p>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Top Performers</h3>
                  <div className="space-y-3">
                    {leaderboard.slice(0, 5).map((user, index) => (
                      <div key={user._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.stats?.totalWorkouts || 0} workouts</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-basketball-orange">{user.totalPoints || 0} pts</p>
                          <p className="text-sm text-gray-600">{user.stats?.completionRate || 0}% completion</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                {/* Search and Filter */}
                <div className="mb-6 flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                    />
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent"
                  >
                    <option value="all">All Roles</option>
                    <option value="player">Players</option>
                    <option value="coach">Coaches</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Level</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              user.role === 'coach' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.skillLevel || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewUser(user._id)}
                              className="text-basketball-orange hover:text-orange-700 mr-3"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No users found matching your criteria</p>
                  </div>
                )}
              </div>
            )}

            {/* Workouts Tab */}
            {activeTab === 'workouts' && (
              <div>
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-900">All Workouts</h3>
                  <p className="text-sm text-gray-600">{workouts.length} total workouts</p>
                </div>

                <div className="space-y-4">
                  {workouts.map((workout) => (
                    <div key={workout._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{workout.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{workout.description}</p>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {workout.category}
                            </span>
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {workout.difficulty}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              {workout.exercises?.length || 0} exercises
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteWorkout(workout._id)}
                          className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {workouts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No workouts available</p>
                  </div>
                )}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Global Leaderboard</h3>
                  <p className="text-sm text-gray-600">Top performers across all metrics</p>
                </div>

                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div key={user._id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-600' :
                          'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">
                            {user.stats?.totalWorkouts || 0} workouts · {user.stats?.completionRate || 0}% completion
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-basketball-orange">{user.totalPoints || 0}</p>
                        <p className="text-sm text-gray-600">points</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                {!analytics ? (
                  <Loading />
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                        <p className="text-sm opacity-90 mb-1">Total Workouts Completed</p>
                        <p className="text-4xl font-bold">{analytics.totalWorkouts}</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                        <p className="text-sm opacity-90 mb-1">Avg Completion Rate</p>
                        <p className="text-4xl font-bold">{analytics.avgCompletionRate}%</p>
                      </div>
                      <div className="bg-gradient-to-br from-basketball-orange to-orange-600 rounded-lg p-6 text-white">
                        <p className="text-sm opacity-90 mb-1">Active Today</p>
                        <p className="text-4xl font-bold">{analytics.activeToday}</p>
                      </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Workout Categories Distribution</h3>
                      <div className="space-y-3">
                        {Object.entries(analytics.categoryDistribution || {}).map(([category, count]) => (
                          <div key={category} className="flex items-center">
                            <div className="w-32 text-sm text-gray-600 capitalize">{category}</div>
                            <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                              <div
                                className="h-full bg-basketball-orange flex items-center justify-end px-3 text-white text-sm font-semibold"
                                style={{ width: `${(count / Math.max(...Object.values(analytics.categoryDistribution))) * 100}%` }}
                              >
                                {count}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity Trend */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Activity Trend (Last 7 Days)</h3>
                      <div className="flex items-end justify-between h-64 space-x-2">
                        {analytics.activityTrend?.map((day, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="w-full bg-basketball-orange rounded-t-lg" style={{ height: `${(day.count / 60) * 100}%` }}></div>
                            <p className="text-xs text-gray-600 mt-2">{day.date}</p>
                            <p className="text-xs font-semibold text-gray-900">{day.count}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="font-semibold text-gray-900 capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Skill Level</p>
                  <p className="font-semibold text-gray-900">{selectedUser.skillLevel || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone Number</p>
                  <p className="font-semibold text-gray-900">{selectedUser.phoneNumber || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
