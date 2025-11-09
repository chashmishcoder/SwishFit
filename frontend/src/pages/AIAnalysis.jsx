import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService } from '../services';
import Loading from '../components/Loading';

const AIAnalysis = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [days, setDays] = useState(30);

  const daysOptions = [
    { value: 7, label: 'Last 7 Days' },
    { value: 14, label: 'Last 2 Weeks' },
    { value: 30, label: 'Last Month' },
    { value: 60, label: 'Last 2 Months' },
    { value: 90, label: 'Last 3 Months' }
  ];

  const analyzePerformance = async () => {
    try {
      setAnalyzing(true);
      setError(null);

      const response = await progressService.analyzePerformance(null, { days });

      // Backend returns: { success, data: { analysis, metrics, playerInfo, analyzedPeriod } }
      const responseData = response.data?.data || response.data;
      
      // Extract the actual analysis object from the nested structure
      const analysisData = responseData?.analysis || responseData;
      
      // Add additional metadata if available
      if (responseData.metrics) {
        analysisData.metrics = responseData.metrics;
      }
      if (responseData.playerInfo) {
        analysisData.playerInfo = responseData.playerInfo;
      }
      if (responseData.analyzedPeriod) {
        analysisData.analyzedPeriod = responseData.analyzedPeriod;
      }
      
      console.log('Analysis Data:', analysisData); // Debug log
      setAnalysis(analysisData);
    } catch (err) {
      console.error('Error analyzing performance:', err);
      setError(err.response?.data?.error || err.message || 'Failed to analyze performance');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDaysChange = (e) => {
    setDays(parseInt(e.target.value));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="large" text="Loading AI Analysis..." />
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
                🤖 AI Performance Analysis
              </h1>
              <p className="text-gray-600">
                Get personalized insights and recommendations powered by AI
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <select
                value={days}
                onChange={handleDaysChange}
                className="block w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white"
              >
                {daysOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <button
                onClick={analyzePerformance}
                disabled={analyzing}
                className="px-6 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {analyzing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Analyze Performance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Welcome / No Analysis State */}
        {!analysis && !error && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-basketball-orange to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to Unlock Your Potential?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our AI-powered analysis will review your performance data from the past {days} days 
              and provide personalized insights, identify strengths, highlight areas for improvement, 
              and recommend tailored workouts to help you reach your goals.
            </p>
            <button
              onClick={analyzePerformance}
              disabled={analyzing}
              className="px-8 py-3 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition-colors text-lg font-semibold disabled:bg-gray-400"
            >
              Get AI Analysis
            </button>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-r from-basketball-orange to-orange-600 rounded-lg shadow-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-3">Performance Summary</h2>
              {(analysis.motivationalMessage || analysis.summary) && (
                <p className="text-lg leading-relaxed">{analysis.motivationalMessage || analysis.summary}</p>
              )}
              {(analysis.overallScore || analysis.overallRating) && (
                <div className="mt-4 flex items-center">
                  <span className="text-sm font-medium mr-2">Overall Rating:</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      // Convert overallScore (0-100) to stars (0-5) if needed
                      const rating = analysis.overallRating || (analysis.overallScore / 20);
                      return (
                        <svg
                          key={i}
                          className={`w-6 h-6 ${i < Math.round(rating) ? 'text-yellow-300' : 'text-white opacity-30'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    })}
                    <span className="ml-2 text-lg font-bold">
                      {analysis.overallScore ? `${analysis.overallScore}/100` : `${analysis.overallRating?.toFixed(1)}/5`}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Strengths */}
            {analysis.strengths && analysis.strengths.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Your Strengths
                </h3>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                      <p className="text-gray-700">{strength}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement / Weaknesses */}
            {(analysis.weaknesses || analysis.areasForImprovement) && (analysis.weaknesses?.length > 0 || analysis.areasForImprovement?.length > 0) && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-yellow-600 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Areas for Improvement
                </h3>
                <ul className="space-y-3">
                  {(analysis.weaknesses || analysis.areasForImprovement)?.map((area, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></span>
                      <p className="text-gray-700">{area}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations && analysis.recommendations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Personalized Recommendations
                </h3>
                <ul className="space-y-3">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                      <p className="text-gray-700">{recommendation}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggested Workouts */}
            {analysis.suggestedWorkouts && analysis.suggestedWorkouts.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-purple-600 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Suggested Workouts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.suggestedWorkouts.map((workout, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-purple-500 transition-colors">
                      <h4 className="font-semibold text-gray-900 mb-2">{workout.name || workout.title || `Workout ${index + 1}`}</h4>
                      <p className="text-sm text-gray-600 mb-2">{workout.description || workout.reason}</p>
                      {workout.category && (
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {workout.category}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Goals & Milestones */}
            {analysis.goals && analysis.goals.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-basketball-orange mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Recommended Goals
                </h3>
                <ul className="space-y-3">
                  {analysis.goals.map((goal, index) => (
                    <li key={index} className="flex items-start p-3 bg-orange-50 rounded-lg">
                      <span className="flex-shrink-0 font-bold text-basketball-orange mr-3">{index + 1}.</span>
                      <p className="text-gray-700">{goal}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Analysis Metadata */}
            <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Analysis Period:</span> Last {days} days
                </div>
                {analysis.timestamp && (
                  <div>
                    <span className="font-medium">Generated:</span> {new Date(analysis.timestamp).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {/* Re-analyze Button */}
            <div className="text-center">
              <button
                onClick={analyzePerformance}
                disabled={analyzing}
                className="px-6 py-2 bg-white border-2 border-basketball-orange text-basketball-orange rounded-lg hover:bg-basketball-orange hover:text-white transition-colors disabled:bg-gray-200 disabled:border-gray-400 disabled:text-gray-400"
              >
                Refresh Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysis;
