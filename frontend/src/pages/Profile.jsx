import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services';
import Loading from '../components/Loading';
import SuccessAlert from '../components/SuccessAlert';

/**
 * Profile Page
 * User can view and edit their profile information
 */
const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    height: '',
    weight: '',
    position: '',
    skillLevel: '',
    team: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      // Backend returns: { success, data: { user: {...}, leaderboard, players } }
      const profileData = response.data?.user || response.data?.data?.user;
      
      if (!profileData) {
        throw new Error('Profile data not found');
      }
      
      // Map backend fields to frontend format
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phoneNumber || '', // Backend uses phoneNumber
        age: profileData.age || '', // This is a virtual field (calculated from dateOfBirth)
        height: profileData.height || '',
        weight: profileData.weight || '',
        position: profileData.position ? formatPosition(profileData.position) : '', // Convert from kebab-case
        skillLevel: profileData.skillLevel || '',
        team: profileData.teamId?.name || '' // Backend uses teamId reference
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.error || err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to format position from kebab-case to Title Case
  const formatPosition = (position) => {
    if (!position || position === 'not-specified') return '';
    return position
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Map frontend field names to backend field names
      const profileUpdateData = {
        name: formData.name,
        phoneNumber: formData.phone?.replace(/\D/g, ''), // Remove non-digits
        skillLevel: formData.skillLevel,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        position: formData.position?.toLowerCase().replace(/\s+/g, '-') || 'not-specified',
      };

      // Remove undefined values
      Object.keys(profileUpdateData).forEach(key => 
        profileUpdateData[key] === undefined && delete profileUpdateData[key]
      );

      const response = await userService.updateProfile(profileUpdateData);
      
      // Backend returns: { success, data: { user: {...} } }
      const updatedUser = response.data?.user || response.data?.data?.user;
      
      // Update user in auth context
      if (updateUserProfile && updatedUser) {
        updateUserProfile(updatedUser);
      }
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMessage = err.response?.data?.errors?.join(', ') || 
                          err.response?.data?.message || 
                          err.error || 
                          'Failed to update profile';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfile(); // Reset form data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="large" text="Loading profile..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 text-gray-600 hover:text-basketball-orange transition"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-court-blue">👤 My Profile</h1>
                <p className="text-sm text-gray-600">View and edit your information</p>
              </div>
            </div>
            {!isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/change-password')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center"
                >
                  🔒 Change Password
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="px-4 py-2 bg-basketball-orange text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Alert */}
        {success && <SuccessAlert message={success} />}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-court-blue to-blue-600 p-8 text-white">
            <div className="flex items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-court-blue">
                {formData.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-6">
                <h2 className="text-3xl font-bold">{formData.name}</h2>
                <p className="text-blue-100">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</p>
                <p className="text-blue-100 text-sm">{formData.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                  <span className="ml-2 text-xs text-gray-500 font-normal">(Cannot be changed)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={true}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Email cannot be changed for security reasons. Contact support if you need to update your email.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="1"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="1"
                  max="300"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="1"
                  max="300"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                >
                  <option value="">Select Position</option>
                  <option value="Point Guard">Point Guard</option>
                  <option value="Shooting Guard">Shooting Guard</option>
                  <option value="Small Forward">Small Forward</option>
                  <option value="Power Forward">Power Forward</option>
                  <option value="Center">Center</option>
                </select>
              </div>

              {/* Skill Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skill Level
                </label>
                <select
                  name="skillLevel"
                  value={formData.skillLevel}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                >
                  <option value="">Select Skill Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Team */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team
                </label>
                <input
                  type="text"
                  name="team"
                  value={formData.team}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Your team name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-basketball-orange focus:border-transparent disabled:bg-gray-100 disabled:text-gray-600"
                />
              </div>
            </div>
          </form>

          {/* Profile Stats */}
          <div className="border-t border-gray-200 p-8 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="text-lg font-medium text-gray-900 capitalize">
                  {user?.role}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-medium text-green-600">
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
