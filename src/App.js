// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/site_navigation/Navbar';
import Footer from './components/site_navigation/Footer';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Product from './pages/Product';
import Basket from './pages/Basket';
import SingleProduct from './pages/SingleProduct';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import OverallProduct from './pages/OverallProduct';  
import AdminRecords from './pages/AdminRecords';  
import SuccessPage from './return/page';
import AdminOrderDetailsPage from './pages/AdminOrderDetailsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';  
import SidebarAdmin from './components/admin/SidebarAdmin';
import AdminLayout from './components/admin/AdminLayout';  
import { ToastContainer } from 'react-toastify';
import WebSocketNotifications from './components/websocket/WebSocketNotifications';
import 'react-toastify/dist/ReactToastify.css';


const PublicLayout = ({ children }) => {
  const { user } = useAuth();
  
  if (user?.isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="App flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
        <WebSocketNotifications />
        <Routes>
         {/* Admin Routes */}
         <Route
            path="/admin/*"
            element={
              <ProtectedRoute adminRequired={true}>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="records" element={<AdminRecords />} />
                    <Route path="orders" element={<AdminOrdersPage />} />
                    <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
                    <Route path="/" element={<Navigate to="dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <PublicLayout>
                <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route 
                    path="profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="genre/:genre" element={<Product />} />
                  <Route path="product/:id" element={<SingleProduct />} />
                  <Route path="products" element={<OverallProduct />} />
                  <Route path="basket" element={<Basket />} />
                  <Route path="success" element={<SuccessPage />} />
                </Routes>
              </PublicLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;