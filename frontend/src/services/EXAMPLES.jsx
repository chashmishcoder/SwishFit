/**
 * Service Usage Examples
 * Demonstrates how to use the services layer in React components
 */

import React, { useState, useEffect } from 'react';
import { 
  workoutService, 
  progressService, 
  leaderboardService,
  apiUtils 
} from '@/services';

// ============================================
// Example 1: Fetching Data with Loading & Error States
// ============================================

export const WorkoutList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await workoutService.getAllWorkouts({
        difficulty: 'intermediate',
        limit: 20
      });
      
      setWorkouts(response.data || []);
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {workouts.map(workout => (
        <div key={workout._id}>{workout.name}</div>
      ))}
    </div>
  );
};

// ============================================
// Example 2: Form Submission with Validation
// ============================================

export const ProgressLogger = () => {
  const [formData, setFormData] = useState({
    workout: '',
    duration: 0,
    exerciseResults: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setErrors({});
      setSuccess(false);
      
      const response = await progressService.logProgress(formData);
      
      setSuccess(true);
      setFormData({ workout: '', duration: 0, exerciseResults: [] });
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      if (apiUtils.isValidationError(err)) {
        setErrors(apiUtils.getValidationErrors(err));
      } else {
        setErrors({ general: apiUtils.formatErrorMessage(err) });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && <div className="error">{errors.general}</div>}
      {success && <div className="success">Progress logged successfully!</div>}
      
      {/* Form fields */}
      <input
        type="number"
        value={formData.duration}
        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
      />
      {errors.duration && <span className="error">{errors.duration}</span>}
      
      <button type="submit" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Log Progress'}
      </button>
    </form>
  );
};

// ============================================
// Example 3: Search with Debouncing
// ============================================

export const WorkoutSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Create debounced search function
  const debouncedSearch = apiUtils.debounce(async (term) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    
    try {
      setSearching(true);
      const response = await workoutService.searchWorkouts(term);
      setResults(response.data || []);
    } catch (err) {
      console.error('Search error:', apiUtils.formatErrorMessage(err));
    } finally {
      setSearching(false);
    }
  }, 300);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search workouts..."
      />
      {searching && <div>Searching...</div>}
      <div>
        {results.map(workout => (
          <div key={workout._id}>{workout.name}</div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// Example 4: Pagination
// ============================================

export const PaginatedLeaderboard = () => {
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 25,
    totalPages: 1
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, [pagination.page]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      const response = await leaderboardService.getGlobalLeaderboard({
        page: pagination.page,
        limit: pagination.limit
      });
      
      setData(response.data || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.totalPages || 1
      }));
      
    } catch (err) {
      console.error(apiUtils.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {data.map(entry => (
            <div key={entry._id}>{entry.player?.name}</div>
          ))}
        </div>
      )}
      
      <div className="pagination">
        <button onClick={prevPage} disabled={pagination.page === 1}>
          Previous
        </button>
        <span>Page {pagination.page} of {pagination.totalPages}</span>
        <button onClick={nextPage} disabled={pagination.page === pagination.totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

// ============================================
// Example 5: Retry Failed Requests
// ============================================

export const RobustDataFetcher = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchDataWithRetry();
  }, []);

  const fetchDataWithRetry = async () => {
    try {
      setRetrying(true);
      setError(null);
      
      const response = await apiUtils.retryRequest(
        () => progressService.getMyProgress(),
        3, // max 3 retries
        1000 // 1 second base delay
      );
      
      setData(response.data);
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    } finally {
      setRetrying(false);
    }
  };

  return (
    <div>
      {retrying && <div>Retrying request...</div>}
      {error && (
        <div>
          Error: {error}
          <button onClick={fetchDataWithRetry}>Retry</button>
        </div>
      )}
      {data && <div>Data loaded successfully</div>}
    </div>
  );
};

// ============================================
// Example 6: Cancelable Requests
// ============================================

export const CancelableDataFetch = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { signal, cancel } = apiUtils.createCancelToken();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await workoutService.getAllWorkouts();
        
        // Only update state if request wasn't cancelled
        if (!signal.aborted) {
          setData(response.data || []);
        }
      } catch (err) {
        if (!signal.aborted) {
          console.error(apiUtils.formatErrorMessage(err));
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    // Cancel request on component unmount
    return () => cancel('Component unmounted');
  }, []);

  return <div>{loading ? 'Loading...' : `${data.length} workouts`}</div>;
};

// ============================================
// Example 7: Multiple Parallel Requests
// ============================================

export const DashboardStats = () => {
  const [stats, setStats] = useState({
    progress: null,
    rank: null,
    leaderboard: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all data in parallel
      const [progressRes, rankRes, leaderboardRes] = await Promise.all([
        progressService.getMyProgress({ limit: 10 }),
        leaderboardService.getMyRank(),
        leaderboardService.getGlobalLeaderboard({ limit: 10 })
      ]);
      
      setStats({
        progress: progressRes.data,
        rank: rankRes.data,
        leaderboard: leaderboardRes.data
      });
      
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div>Recent Progress: {stats.progress?.length || 0} entries</div>
      <div>My Rank: #{stats.rank?.globalRank || 'N/A'}</div>
      <div>Top Players: {stats.leaderboard?.length || 0} shown</div>
    </div>
  );
};

// ============================================
// Example 8: Custom Hook for Service
// ============================================

const useWorkouts = (filters = {}) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await workoutService.getAllWorkouts(filters);
      setWorkouts(response.data || []);
    } catch (err) {
      setError(apiUtils.formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [JSON.stringify(filters)]);

  return { workouts, loading, error, refetch: fetchWorkouts };
};

// Usage of custom hook
export const WorkoutListWithHook = () => {
  const { workouts, loading, error, refetch } = useWorkouts({
    difficulty: 'intermediate'
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      {workouts.map(w => <div key={w._id}>{w.name}</div>)}
    </div>
  );
};

// ============================================
// Example 9: Optimistic Updates
// ============================================

export const OptimisticProgressLogger = () => {
  const [progressList, setProgressList] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const logProgress = async (progressData) => {
    // Optimistically add to list with temporary ID
    const tempProgress = { 
      ...progressData, 
      _id: 'temp-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    
    setProgressList(prev => [tempProgress, ...prev]);
    
    try {
      setSubmitting(true);
      const response = await progressService.logProgress(progressData);
      
      // Replace temporary entry with real data
      setProgressList(prev => 
        prev.map(item => 
          item._id === tempProgress._id ? response.data : item
        )
      );
      
    } catch (err) {
      // Remove temporary entry on error
      setProgressList(prev => 
        prev.filter(item => item._id !== tempProgress._id)
      );
      alert(apiUtils.formatErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <button onClick={() => logProgress({ duration: 30 })} disabled={submitting}>
        Log Workout
      </button>
      {progressList.map(p => (
        <div key={p._id}>{p.duration} minutes</div>
      ))}
    </div>
  );
};

export default {
  WorkoutList,
  ProgressLogger,
  WorkoutSearch,
  PaginatedLeaderboard,
  RobustDataFetcher,
  CancelableDataFetch,
  DashboardStats,
  WorkoutListWithHook,
  OptimisticProgressLogger
};
