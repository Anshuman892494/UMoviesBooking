import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useStore from '../store/useStore';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
    const { user, logout } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside className={`fixed left-0 top-0 h-screen bg-white border-r-2 border-green-500 shadow-lg z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="p-6 border-b border-gray-200">
                    <Link to="/" className="flex items-center gap-3">
                        <i className="fas fa-film text-green-600 text-3xl"></i>
                        {!isCollapsed && (
                            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                                LPUMoviesPoint
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 overflow-y-auto">
                    <div className="space-y-2 px-3">
                        <Link
                            to="/"
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/')
                                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                                : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                }`}
                        >
                            <i className="fas fa-home text-xl"></i>
                            {!isCollapsed && <span className="font-medium">Home</span>}
                        </Link>

                        {user && (
                            <Link
                                to="/my-bookings"
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive('/my-bookings')
                                    ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/30'
                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                    }`}
                            >
                                <i className="fas fa-ticket-alt text-xl"></i>
                                {!isCollapsed && <span className="font-medium">My Bookings</span>}
                            </Link>
                        )}
                    </div>
                </nav>

                {/* User Section / Auth Buttons */}
                <div className="border-t border-gray-200 p-4">
                    {user ? (
                        <div className="space-y-3">
                            <div className={`flex items-center gap-3 px-3 py-2 bg-green-50 rounded-lg ${isCollapsed ? 'justify-center' : ''}`}>
                                <i className="fas fa-user text-green-600"></i>
                                {!isCollapsed && (
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleLogout}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <i className="fas fa-sign-out-alt"></i>
                                {!isCollapsed && <span className="font-medium">Logout</span>}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                to="/login"
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-600 transition font-medium ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <i className="fas fa-sign-in-alt"></i>
                                {!isCollapsed && <span>Login</span>}
                            </Link>
                            <Link
                                to="/register"
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 transition font-medium shadow-lg shadow-green-500/30 ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <i className="fas fa-user-plus"></i>
                                {!isCollapsed && <span>Sign Up</span>}
                            </Link>
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="p-3 border-t border-gray-200 text-gray-600 hover:text-green-600 hover:bg-green-50 transition"
                >
                    <i className={`fas fa-chevron-${isCollapsed ? 'right' : 'left'}`}></i>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
