import { useState, useEffect } from 'react';

const FeedbackModal = ({ player, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [recentProgress, setRecentProgress] = useState([]);
  const [selectedProgressId, setSelectedProgressId] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchRecentProgress();
  }, [player]);

  const fetchRecentProgress = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/coach/player/${player._id}/progress?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setRecentProgress(result.data?.progress || []);
        
        // Auto-select the most recent progress entry
        if (result.data?.progress?.length > 0) {
          setSelectedProgressId(result.data.progress[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching recent progress:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProgressId) {
      setError('Please select a workout session');
      return;
    }

    if (!feedback.trim()) {
      setError('Please enter your feedback');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      const response = await fetch(`/api/coach/feedback/${selectedProgressId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ coachFeedback: feedback })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit feedback');
      }

      setSuccess(true);
      setTimeout(() => {
        onSubmit();
      }, 1500);

    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add Feedback</h2>
            <p className="text-sm text-gray-600 mt-1">
              Provide feedback for <span className="font-medium text-gray-900">{player.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Feedback Submitted!</h3>
              <p className="text-gray-600">Your feedback has been successfully added to the workout session.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Select Workout Session */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Workout Session *
                </label>
                
                {recentProgress.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-2">
                    {recentProgress.map((progress) => (
                      <label
                        key={progress._id}
                        className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedProgressId === progress._id
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="progress"
                          value={progress._id}
                          checked={selectedProgressId === progress._id}
                          onChange={(e) => setSelectedProgressId(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {progress.workout?.name || 'Unknown Workout'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {formatDate(progress.completedAt || progress.createdAt)}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                              <span>⏱️ {progress.duration} min</span>
                              <span>🎯 {progress.accuracy?.toFixed(1)}%</span>
                              <span>🔥 {progress.caloriesBurned} cal</span>
                            </div>
                          </div>
                          {progress.coachFeedback && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Has feedback
                            </span>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <svg className="w-12 h-12 mx-auto text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-gray-600">No recent workout sessions found for this player.</p>
                  </div>
                )}
              </div>

              {/* Feedback Text Area */}
              <div className="mb-6">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Provide detailed feedback on the player's performance, areas for improvement, and positive encouragement..."
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {feedback.length} / 500 characters
                </p>
              </div>

              {/* Quick Feedback Templates */}
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Great improvement! Keep it up! 💪',
                    'Focus on maintaining proper form throughout the exercises.',
                    'Excellent accuracy! Try increasing the intensity next time.',
                    'Good effort today. Remember to warm up properly before starting.',
                    'Your consistency is paying off. Well done! 🎯'
                  ].map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFeedback(prev => prev ? `${prev}\n\n${template}` : template)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                      disabled={loading}
                    >
                      {template}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  disabled={loading || !selectedProgressId || !feedback.trim()}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Feedback'
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
