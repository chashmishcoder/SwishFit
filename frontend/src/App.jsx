import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

// Lazy load page components for code splitting
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const PlayerDashboard = lazy(() => import('./pages/PlayerDashboard'));
const ProgressCharts = lazy(() => import('./pages/ProgressCharts'));
const AIAnalysis = lazy(() => import('./pages/AIAnalysis'));
const CoachPortal = lazy(() => import('./pages/CoachPortal'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const WorkoutLibrary = lazy(() => import('./pages/WorkoutLibrary'));
const WorkoutDetail = lazy(() => import('./pages/WorkoutDetail'));
const StartWorkout = lazy(() => import('./pages/StartWorkout'));
const CreateWorkout = lazy(() => import('./pages/CreateWorkout'));
const Profile = lazy(() => import('./pages/Profile'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

/**
 * Main App Component
 * Sets up routing and authentication
 * Uses React.lazy() and Suspense for code splitting
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        {/* Suspense wrapper for lazy-loaded components */}
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoadingSpinner size="xl" message="Loading..." />
          </div>
        }>
          <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PlayerDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/workouts"
            element={
              <ProtectedRoute>
                <WorkoutLibrary />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/workouts/:id"
            element={
              <ProtectedRoute>
                <WorkoutDetail />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/workouts/:id/start"
            element={
              <ProtectedRoute>
                <StartWorkout />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/workouts/:id/edit"
            element={
              <ProtectedRoute allowedRoles={['coach', 'admin']}>
                <CreateWorkout />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/progress"
            element={
              <ProtectedRoute>
                <ProgressCharts />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/ai-analysis"
            element={
              <ProtectedRoute>
                <AIAnalysis />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          
          {/* Coach Only Routes */}
          <Route
            path="/coach/portal"
            element={
              <ProtectedRoute allowedRoles={['coach', 'admin']}>
                <CoachPortal />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/workouts/create"
            element={
              <ProtectedRoute allowedRoles={['coach', 'admin']}>
                <CreateWorkout />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Only Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          
          {/* Root - Redirect to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 - Redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
