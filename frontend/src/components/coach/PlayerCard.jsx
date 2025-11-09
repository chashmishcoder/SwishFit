import { useState } from 'react';

const PlayerCard = ({ player, onViewProgress, onAddFeedback, onGenerateAIWorkout, onAssignWorkout }) => {
  const [showActions, setShowActions] = useState(false);

  const getSkillLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRankBadgeColor = (rank) => {
    if (rank <= 10) return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    if (rank <= 50) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getActivityStatus = () => {
    if (!player.lastActive) return { text: 'Never active', color: 'text-gray-500' };
    
    const lastActiveDate = new Date(player.lastActive);
    const now = new Date();
    const daysDiff = Math.floor((now - lastActiveDate) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) return { text: 'Active today', color: 'text-green-600' };
    if (daysDiff === 1) return { text: 'Active yesterday', color: 'text-green-500' };
    if (daysDiff <= 7) return { text: `Active ${daysDiff} days ago`, color: 'text-blue-600' };
    if (daysDiff <= 30) return { text: `Active ${daysDiff} days ago`, color: 'text-gray-600' };
    return { text: 'Inactive', color: 'text-red-500' };
  };

  const activityStatus = getActivityStatus();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative">
      {/* Player Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {player.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{player.name}</h3>
            <p className="text-sm text-gray-600">{player.email}</p>
          </div>
        </div>

        <button
          onClick={() => setShowActions(!showActions)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-600 mb-1">Skill Level</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(player.skillLevel)}`}>
            {player.skillLevel || 'Not set'}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Global Rank</p>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getRankBadgeColor(player.globalRank)}`}>
            #{player.globalRank || 'N/A'}
          </span>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Performance Metrics</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Workouts Completed</span>
            <span className="text-sm font-semibold text-gray-900">
              {player.workoutsCompleted || 0}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Duration</span>
            <span className="text-sm font-semibold text-gray-900">
              {player.totalDuration ? `${Math.round(player.totalDuration)} min` : '0 min'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Avg Accuracy</span>
            <span className="text-sm font-semibold text-orange-600">
              {player.avgAccuracy ? `${player.avgAccuracy.toFixed(1)}%` : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Points</span>
            <span className="text-sm font-semibold text-blue-600">
              {player.totalPoints || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Status */}
      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-600">Last Active:</span>
        <span className={`font-medium ${activityStatus.color}`}>
          {activityStatus.text}
        </span>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div className="absolute top-14 right-6 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-2 w-56">
          <button
            onClick={() => {
              onViewProgress(player);
              setShowActions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm text-gray-700">View Progress</span>
          </button>

          <button
            onClick={() => {
              onAddFeedback(player);
              setShowActions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span className="text-sm text-gray-700">Add Feedback</span>
          </button>

          <button
            onClick={() => {
              onAssignWorkout(player);
              setShowActions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-sm text-gray-700">Assign Workout</span>
          </button>

          <button
            onClick={() => {
              onGenerateAIWorkout(player);
              setShowActions(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-gray-700">AI Workout</span>
          </button>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onViewProgress(player)}
          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        >
          View Progress
        </button>
        <button
          onClick={() => onAddFeedback(player)}
          className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium"
        >
          Add Feedback
        </button>
      </div>

      {/* Close actions menu when clicking outside */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(false)}
        />
      )}
    </div>
  );
};

export default PlayerCard;
