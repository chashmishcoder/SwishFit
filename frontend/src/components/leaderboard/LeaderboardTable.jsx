const LeaderboardTable = ({ data, currentUserId, onCompare, getTrophyIcon, loading }) => {
  const getSkillLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRankRowColor = (rank, isCurrentUser) => {
    if (isCurrentUser) return 'bg-orange-50 border-l-4 border-orange-500';
    if (rank === 1) return 'bg-yellow-50';
    if (rank === 2) return 'bg-gray-50';
    if (rank === 3) return 'bg-orange-50';
    return '';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toLocaleString() || 0;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading rankings...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rank
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Skill Level
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Points
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Workouts
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Accuracy
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((entry, index) => {
            // Backend populates playerId field, frontend might use player
            const player = entry.playerId || entry.player;
            const rank = entry.displayRank || entry.globalRank || entry.teamRank || entry.rank || index + 1;
            const isCurrentUser = player?._id === currentUserId || entry._id === currentUserId;
            const trophy = getTrophyIcon(rank);

            return (
              <tr
                key={entry._id || player?._id}
                className={`hover:bg-gray-50 transition-colors ${getRankRowColor(rank, isCurrentUser)}`}
              >
                {/* Rank */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`text-2xl font-bold ${
                      rank === 1 ? 'text-yellow-600' :
                      rank === 2 ? 'text-gray-500' :
                      rank === 3 ? 'text-orange-600' :
                      'text-gray-900'
                    }`}>
                      {trophy ? (
                        <span className="text-3xl">{trophy}</span>
                      ) : (
                        `#${rank}`
                      )}
                    </div>
                  </div>
                </td>

                {/* Player */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white font-semibold">
                        {player?.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        {player?.name || 'Unknown'}
                        {isCurrentUser && (
                          <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {player?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Skill Level */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSkillLevelColor(player?.skillLevel)}`}>
                    {player?.skillLevel || 'N/A'}
                  </span>
                </td>

                {/* Points */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-bold text-gray-900">
                    {formatNumber(entry.points || entry.totalPoints || 0)}
                  </div>
                  <div className="text-xs text-gray-500">
                    W: {entry.weeklyPoints || 0} | M: {entry.monthlyPoints || 0}
                  </div>
                </td>

                {/* Workouts */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-gray-900">
                    {entry.totalWorkoutsCompleted || entry.workoutsCompleted || 0}
                  </div>
                </td>

                {/* Accuracy */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center">
                    <div className="text-sm font-semibold text-orange-600">
                      {entry.avgAccuracy ? `${entry.avgAccuracy.toFixed(1)}%` : 'N/A'}
                    </div>
                  </div>
                  {entry.avgAccuracy && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-orange-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(entry.avgAccuracy, 100)}%` }}
                      />
                    </div>
                  )}
                </td>

                {/* Duration */}
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-blue-600">
                    {entry.totalDuration ? `${Math.round(entry.totalDuration)}m` : '0m'}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  {!isCurrentUser && (
                    <button
                      onClick={() => onCompare(player)}
                      className="text-orange-600 hover:text-orange-900 transition-colors inline-flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Compare
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
