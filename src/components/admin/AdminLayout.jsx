import React from 'react';
import SidebarAdmin from './SidebarAdmin';

const AdminLayout = ({ children }) => {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SidebarAdmin />
        <div className="flex-1 ml-64"> {/* Added margin to account for fixed sidebar */}
          {children}
        </div>
      </div>
    );
  };
export default AdminLayout;