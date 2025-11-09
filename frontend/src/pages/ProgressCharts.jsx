import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services';
import WorkoutProgressChart from '../components/charts/WorkoutProgressChart';
import AccuracyChart from '../components/charts/AccuracyChart';
import WeeklyActivityChart from '../components/charts/WeeklyActivityChart';
import CaloriesChart from '../components/charts/CaloriesChart';

const ProgressCharts = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('30'); // days
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  // Date range options
  const dateRangeOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '14', label: 'Last 2 Weeks' },
    { value: '30', label: 'Last Month' },
    { value: '60', label: 'Last 2 Months' },
    { value: '90', label: 'Last 3 Months' }
  ];

  useEffect(() => {
    fetchProgressData();
  }, [dateRange]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      // Fetch progress data using progressService
      const progressResponse = await progressService.getMyProgress({
        params: {
          startDate: startDate.toISOString(),
          limit: 100
        }
      });

      const progressArray = progressResponse.data?.data || progressResponse.data || [];
      setProgressData(progressArray);

      // Fetch analytics using progressService
      try {
        const analyticsResponse = await progressService.getAnalytics(user.id, {
          params: {
            period: 'monthly'
          }
        });
        setAnalytics(analyticsResponse.data?.data || analyticsResponse.data);
      } catch (analyticsErr) {
        // Analytics is optional, don't fail if it errors
        console.warn('Analytics not available:', analyticsErr);
      }

    } catch (err) {
      console.error('Error fetching progress data:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch progress data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleRefresh = () => {
    fetchProgressData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your progress data...</p>
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
            <h3 className="text-xl font-semibold mb-2">Error Loading Data</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Progress Analytics
              </h1>
              <p className="text-gray-600">
                Track your basketball training progress over time
              </p>
            </div>

            {/* Date Range Filter */}
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={dateRange}
                onChange={handleDateRangeChange}
                className="block w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
                title="Refresh data"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Workouts</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.metrics?.totalWorkouts || 0}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              {analytics.trends && (
                <p className={`text-sm mt-2 ${analytics.trends.workoutCountChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.trends.workoutCountChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.trends.workoutCountChange).toFixed(1)}% from last period
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Accuracy</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.metrics?.averageAccuracy?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              {analytics.trends && (
                <p className={`text-sm mt-2 ${analytics.trends.accuracyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.trends.accuracyChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.trends.accuracyChange).toFixed(1)}% from last period
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.metrics?.completionRate?.toFixed(1) || 0}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              {analytics.trends && (
                <p className={`text-sm mt-2 ${analytics.trends.completionRateChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.trends.completionRateChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.trends.completionRateChange).toFixed(1)}% from last period
                </p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Calories</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {analytics.metrics?.totalCaloriesBurned?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
              </div>
              {analytics.trends && (
                <p className={`text-sm mt-2 ${analytics.trends.caloriesChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {analytics.trends.caloriesChange >= 0 ? '↑' : '↓'} {Math.abs(analytics.trends.caloriesChange).toFixed(1)}% from last period
                </p>
              )}
            </div>
          </div>
        )}

        {/* Charts Grid */}
        {progressData && progressData.length > 0 ? (
          <div className="space-y-6">
            {/* Workout Progress Over Time */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Workout Progress Over Time
              </h2>
              <WorkoutProgressChart data={progressData} dateRange={dateRange} />
            </div>

            {/* Accuracy Trends */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Shooting Accuracy Trends
              </h2>
              <AccuracyChart data={progressData} dateRange={dateRange} />
            </div>

            {/* Weekly Activity */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Weekly Activity Distribution
              </h2>
              <WeeklyActivityChart data={progressData} />
            </div>

            {/* Calories Burned */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Calories Burned Over Time
              </h2>
              <CaloriesChart data={progressData} dateRange={dateRange} />
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Progress Data Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start completing workouts to see your progress charts and analytics.
            </p>
            <button
              onClick={() => window.location.href = '/workouts'}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Start Training
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCharts;
