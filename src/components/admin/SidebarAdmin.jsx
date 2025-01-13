import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Disc, 
  Settings,
  LogOut
} from 'lucide-react';

const SidebarAdmin = () => {
  const location = useLocation();
  const { logout } = useAuth()
  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/admin/records', icon: Disc, label: 'Records' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-white border-r-8 border-black">
      {/* Logo Area */}
      <div className="p-6 bg-red-600 border-b-8 border-black">
        <h1 className="text-white text-2xl font-bold">ADMIN PANEL</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-6 py-3 space-x-3 hover:bg-yellow-400 transition-colors
              ${location.pathname === item.path 
                ? 'bg-yellow-400 text-black border-r-8 border-red-600' 
                : 'text-black'}`}
          >
            <item.icon className="h-5 w-5" />
            <span className="font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-6 border-t-8 border-black mt-auto">
        <button 
          onClick={logout} 
          className="flex items-center justify-center space-x-2 w-full bg-black text-white p-3 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold">LOGOUT</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;