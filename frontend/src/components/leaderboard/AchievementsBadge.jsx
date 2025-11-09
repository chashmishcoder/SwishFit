const AchievementsBadge = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  const getAchievementIcon = (type) => {
    const icons = {
      'first_workout': '🎯',
      'week_streak': '🔥',
      'accuracy_master': '🎪',
      'endurance_king': '⚡',
      'top_10': '🏆',
      'top_3': '🥇',
      'workout_milestone': '💪',
      'perfect_score': '⭐',
      'consistency': '📅',
      'improvement': '📈'
    };
    return icons[type] || '🎖️';
  };

  const getAchievementColor = (type) => {
    const colors = {
      'first_workout': 'bg-blue-100 text-blue-700 border-blue-300',
      'week_streak': 'bg-orange-100 text-orange-700 border-orange-300',
      'accuracy_master': 'bg-purple-100 text-purple-700 border-purple-300',
      'endurance_king': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'top_10': 'bg-green-100 text-green-700 border-green-300',
      'top_3': 'bg-pink-100 text-pink-700 border-pink-300',
      'workout_milestone': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      'perfect_score': 'bg-red-100 text-red-700 border-red-300',
      'consistency': 'bg-teal-100 text-teal-700 border-teal-300',
      'improvement': 'bg-cyan-100 text-cyan-700 border-cyan-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="flex flex-wrap gap-2">
      {achievements.slice(0, 5).map((achievement, index) => (
        <div
          key={index}
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getAchievementColor(achievement.type)}`}
          title={achievement.description}
        >
          <span className="mr-1">{getAchievementIcon(achievement.type)}</span>
          {achievement.name}
        </div>
      ))}
      {achievements.length > 5 && (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
          +{achievements.length - 5} more
        </div>
      )}
    </div>
  );
};

export default AchievementsBadge;
