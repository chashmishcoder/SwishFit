import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

/**
 * Authentication Context
 * Provides authentication state and methods throughout the app
 */
const AuthContext = createContext(null);

/**
 * Custom hook to use auth context
 * @returns {Object} Auth context value
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * Wraps the app and provides auth state to all children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Load user from localStorage on mount
   */
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        const token = authService.getToken();
        
        if (currentUser && token) {
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Register new user
   * @param {Object} userData - Registration data
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.success) {
        setUser(response.data.user);
        return response;
      }
    } catch (err) {
      const errorMessage = err.error || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user
   * @param {Object} credentials - Email and password
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.data.user);
        return response;
      }
    } catch (err) {
      const errorMessage = err.error || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh user data from backend
   */
  const refreshUser = async () => {
    try {
      const response = await authService.getMe();
      
      if (response.success) {
        setUser(response.data);
        return response.data;
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
      // If refresh fails with 401, logout user
      if (err.status === 401) {
        logout();
      }
      throw err;
    }
  };

  /**
   * Update user profile
   * @param {Object} updates - Profile updates
   */
  const updateUserProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  /**
   * Clear any auth errors
   */
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isPlayer: user?.role === 'player',
    isCoach: user?.role === 'coach',
    isAdmin: user?.role === 'admin',
    register,
    login,
    logout,
    refreshUser,
    updateUserProfile,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
