import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Navigation Links */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <span className="text-2xl font-bold text-basketball-orange">
                🏀 SwishFit India
              </span>
            </Link>

            <div className="hidden md:flex ml-10 space-x-6">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-basketball-orange transition font-medium px-3 py-2 rounded-md hover:bg-orange-50"
              >
                Dashboard
              </Link>
              <Link
                to="/workouts"
                className="text-gray-700 hover:text-basketball-orange transition font-medium px-3 py-2 rounded-md hover:bg-orange-50"
              >
                Workouts
              </Link>
              <Link
                to="/progress"
                className="text-gray-700 hover:text-basketball-orange transition font-medium px-3 py-2 rounded-md hover:bg-orange-50"
              >
                📊 Progress
              </Link>
              <Link
                to="/leaderboard"
                className="text-gray-700 hover:text-basketball-orange transition font-medium px-3 py-2 rounded-md hover:bg-orange-50"
              >
                🏆 Leaderboard
              </Link>
              {(user?.role === 'coach' || user?.role === 'admin') && (
                <Link
                  to="/coach/portal"
                  className="text-gray-700 hover:text-basketball-orange transition font-medium px-3 py-2 rounded-md hover:bg-orange-50"
                >
                  👨‍🏫 Coach Portal
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="text-gray-700 hover:text-basketball-orange transition font-medium px-3 py-2 rounded-md hover:bg-orange-50"
                >
                  🛡️ Admin
                </Link>
              )}
            </div>
          </div>

          {/* User Profile Dropdown */}
          <div className="flex items-center">
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 rounded-lg transition">
                <img
                  src={user?.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=FF6600&color=fff'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-basketball-orange"
                />
                <div className="hidden sm:block text-left">
                  <p className="font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/profile"
                          className={`${
                            active ? 'bg-gray-100 text-basketball-orange' : 'text-gray-700'
                          } group flex items-center px-4 py-2 text-sm`}
                        >
                          <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Your Profile
                        </Link>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/ai-analysis"
                          className={`${
                            active ? 'bg-gray-100 text-basketball-orange' : 'text-gray-700'
                          } group flex items-center px-4 py-2 text-sm`}
                        >
                          <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          AI Analysis
                        </Link>
                      )}
                    </Menu.Item>

                    {(user?.role === 'coach' || user?.role === 'admin') && (
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/workouts/create"
                            className={`${
                              active ? 'bg-gray-100 text-basketball-orange' : 'text-gray-700'
                            } group flex items-center px-4 py-2 text-sm`}
                          >
                            <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Workout
                          </Link>
                        )}
                      </Menu.Item>
                    )}
                  </div>

                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={handleLogout}
                          className={`${
                            active ? 'bg-gray-100 text-red-600' : 'text-gray-700'
                          } group flex w-full items-center px-4 py-2 text-sm`}
                        >
                          <svg className="mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Sign out
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile Menu (Optional - can be added later) */}
      <div className="md:hidden px-4 pb-3 space-y-1 border-t">
        <Link
          to="/dashboard"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-basketball-orange hover:bg-gray-50"
        >
          Dashboard
        </Link>
        <Link
          to="/workouts"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-basketball-orange hover:bg-gray-50"
        >
          Workouts
        </Link>
        <Link
          to="/progress"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-basketball-orange hover:bg-gray-50"
        >
          📊 Progress
        </Link>
        <Link
          to="/leaderboard"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-basketball-orange hover:bg-gray-50"
        >
          🏆 Leaderboard
        </Link>
        {(user?.role === 'coach' || user?.role === 'admin') && (
          <Link
            to="/coach/portal"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-basketball-orange hover:bg-gray-50"
          >
            👨‍🏫 Coach Portal
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
