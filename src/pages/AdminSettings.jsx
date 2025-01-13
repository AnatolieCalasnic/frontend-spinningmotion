import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import Switch from '../components/admin/Switch'; 

const AdminSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is already enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Toggle the 'dark' class on the html element
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Save the preference to localStorage
    localStorage.setItem('adminDarkMode', newDarkMode ? 'dark' : 'light');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-8"
      >
        <div className="bg-black p-6">
          <h1 className="text-4xl font-bold text-white">Settings</h1>
        </div>
      </motion.div>

      {/* Settings Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white dark:bg-slate-800 border-8 border-black p-8"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold dark:text-white">Appearance</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Toggle between light and dark mode for the admin panel
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            <Switch 
              checked={isDarkMode}
              onCheckedChange={toggleDarkMode}
            />
            <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminSettings;