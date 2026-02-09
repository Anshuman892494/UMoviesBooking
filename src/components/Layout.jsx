import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });

    const toggleSidebar = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', newState);
    };

    return (
        <div className="min-h-screen bg-white flex overflow-x-hidden">
            <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 flex flex-col transition-all duration-300 overflow-x-hidden ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                <main className="flex-grow">
                    {children}
                </main>
                <footer className="bg-gray-50 text-gray-700 py-8 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-gray-600">© 2024 LPUMoviesPoint. All rights reserved.</p>
                    </div>
                </footer>
            </div>
            <Toaster position="top-center" />
        </div>
    );
};

export default Layout;
