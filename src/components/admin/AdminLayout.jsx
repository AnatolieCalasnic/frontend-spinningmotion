import React, { useEffect } from 'react';
import SidebarAdmin from './SidebarAdmin';
import { AdminNotificationCenter } from '../notifications/AdminNotificationCenter';


const AdminLayout = ({ children }) => {
  useEffect(() => {
    const darkMode = localStorage.getItem('adminDarkMode');
    document.documentElement.classList.toggle('dark', darkMode === 'dark');

    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, []);
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-slate-800 transition-colors duration-200">
        <SidebarAdmin />
        <div className="flex-1 ml-64"> {/* Added margin to account for fixed sidebar */}
        <AdminNotificationCenter />
          {children}
        </div>
      </div>
    );
  };
export default AdminLayout;