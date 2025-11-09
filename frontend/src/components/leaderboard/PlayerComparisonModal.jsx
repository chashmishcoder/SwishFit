import { useState, useEffect } from 'react';

const PlayerComparisonModal = ({ player, currentUser, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  useEffect(() => {
    fetchComparisonData();
  }, [player, currentUser]);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/leaderboard/compare/${player._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch comparison data');
      }

      const result = await response.json();
      setComparisonData(result.data);

    } catch (err) {
      console.error('Error fetching comparison:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getComparisonIndicator = (myValue, theirValue) => {
    if (myValue > theirValue) {
      return { icon: '↑', color: 'text-green-600', bg: 'bg-green-50' };
    } else if (myValue < theirValue) {
      return { icon: '↓', color: 'text-red-600', bg: 'bg-red-50' };
    }
    return { icon: '=', color: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const ComparisonMetric = ({ label, myValue, theirValue, format = 'number' }) => {
    const indicator = getComparisonIndicator(myValue, theirValue);
    
    const formatValue = (val) => {
      if (format === 'percentage') return `${val.toFixed(1)}%`;
      if (format === 'duration') return `${Math.round(val)} min`;
      return val.toLocaleString();
    };

    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600 mb-3 font-medium">{label}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">You</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(myValue)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-1">{player.name?.split(' ')[0]}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(theirValue)}</p>
          </div>
        </div>
        <div className={`mt-3 text-center py-2 rounded-lg ${indicator.bg}`}>
          <span className={`text-lg font-bold ${indicator.color}`}>
            {indicator.icon} {Math.abs((myValue - theirValue)).toFixed(format === 'percentage' ? 1 : 0)}
            {format === 'percentage' ? '%' : ''}
          </span>
          <span className="text-xs text-gray-600 ml-2">difference</span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <svg className="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Player Comparison
            </h2>
            <p className="text-sm text-white/90 mt-1">
              Comparing your performance with {player.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/90 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading comparison...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-600">{error}</p>
            </div>
          ) : comparisonData ? (
            <>
              {/* Player Headers */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-orange-50 border-2 border-orange-500 rounded-lg p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{currentUser?.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{currentUser?.email}</p>
                  <div className="flex items-center justify-center space-x-4">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
                      Rank #{comparisonData.currentUser?.globalRank || 'N/A'}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
                      {currentUser?.skillLevel || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {player.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{player.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{player.email}</p>
                  <div className="flex items-center justify-center space-x-4">
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
                      Rank #{comparisonData.comparedPlayer?.globalRank || 'N/A'}
                    </span>
                    <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700">
                      {player.skillLevel || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comparison Metrics */}
              <div className="space-y-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ComparisonMetric
                    label="Total Points"
                    myValue={comparisonData.currentUser?.totalPoints || 0}
                    theirValue={comparisonData.comparedPlayer?.totalPoints || 0}
                  />
                  
                  <ComparisonMetric
                    label="Workouts Completed"
                    myValue={comparisonData.currentUser?.workoutsCompleted || 0}
                    theirValue={comparisonData.comparedPlayer?.workoutsCompleted || 0}
                  />
                  
                  <ComparisonMetric
                    label="Average Accuracy"
                    myValue={comparisonData.currentUser?.avgAccuracy || 0}
                    theirValue={comparisonData.comparedPlayer?.avgAccuracy || 0}
                    format="percentage"
                  />
                  
                  <ComparisonMetric
                    label="Total Duration"
                    myValue={comparisonData.currentUser?.totalDuration || 0}
                    theirValue={comparisonData.comparedPlayer?.totalDuration || 0}
                    format="duration"
                  />
                  
                  <ComparisonMetric
                    label="Weekly Points"
                    myValue={comparisonData.currentUser?.weeklyPoints || 0}
                    theirValue={comparisonData.comparedPlayer?.weeklyPoints || 0}
                  />
                  
                  <ComparisonMetric
                    label="Monthly Points"
                    myValue={comparisonData.currentUser?.monthlyPoints || 0}
                    theirValue={comparisonData.comparedPlayer?.monthlyPoints || 0}
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Summary</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  {comparisonData.currentUser?.totalPoints > comparisonData.comparedPlayer?.totalPoints ? (
                    <p>✅ You have <span className="font-semibold text-green-600">more total points</span> than {player.name}!</p>
                  ) : (
                    <p>📈 {player.name} is ahead by <span className="font-semibold text-orange-600">{(comparisonData.comparedPlayer?.totalPoints - comparisonData.currentUser?.totalPoints).toLocaleString()} points</span>. Keep training!</p>
                  )}
                  
                  {comparisonData.currentUser?.avgAccuracy > comparisonData.comparedPlayer?.avgAccuracy ? (
                    <p>🎯 Your accuracy is <span className="font-semibold text-green-600">{(comparisonData.currentUser?.avgAccuracy - comparisonData.comparedPlayer?.avgAccuracy).toFixed(1)}% higher</span>!</p>
                  ) : (
                    <p>🎯 Focus on accuracy to catch up with {player.name}.</p>
                  )}
                  
                  {comparisonData.currentUser?.workoutsCompleted > comparisonData.comparedPlayer?.workoutsCompleted ? (
                    <p>💪 You've completed <span className="font-semibold text-green-600">{comparisonData.currentUser?.workoutsCompleted - comparisonData.comparedPlayer?.workoutsCompleted} more workouts</span>!</p>
                  ) : (
                    <p>💪 Complete more workouts to improve your ranking.</p>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerComparisonModal;
