import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarItem {
  name: string;
  path: string;
  icon: string;
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Tasks', path: '/tasks', icon: '✓' },
  { name: 'Projects', path: '/projects', icon: '📁' },
  { name: 'Inventory', path: '/inventory', icon: '📦' },
  { name: 'Time Tracking', path: '/time', icon: '⏰' },
  { name: 'Accounting', path: '/accounting', icon: '💰', roles: ['admin', 'accountant'] },
  { name: 'Reports', path: '/reports', icon: '📈' },
  { name: 'Users', path: '/users', icon: '👥', roles: ['admin'] },
];

const MainLayout: React.FC = () => {
  const { user, logout, isAdmin, isAccountant } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canAccessItem = (item: SidebarItem): boolean => {
    if (!item.roles) return true;
    return item.roles.some(role => 
      role === user?.role || (role === 'admin' && isAdmin()) || (role === 'accountant' && isAccountant())
    );
  };

  const filteredSidebarItems = sidebarItems.filter(canAccessItem);

  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'accountant': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        {/* Logo/Brand */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              W
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-xl font-semibold text-gray-800">Workline</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {filteredSidebarItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {sidebarOpen && (
                      <span className="ml-3 font-medium">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <span className="text-lg">{sidebarOpen ? '◀' : '▶'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                {filteredSidebarItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-500 hover:text-gray-700 relative">
                <span className="text-lg">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name ? getUserInitials(user.name) : 'U'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getRoleColor(user?.role || '')}`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-400">▼</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                    {user?.email}
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    👤 Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    ⚙️ Settings
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 