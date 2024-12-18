import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    phonenum: '',
    address: '',
    postalCode: '',
    country: '',
    city: '',
    region: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.userId) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/user/${user.userId}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        const userData = response.data;
        setFormData({
          fname: userData.fname || '',
          lname: userData.lname || '',
          email: userData.email || '',
          phonenum: userData.phonenum || '',
          address: userData.address || '',
          postalCode: userData.postalCode || '',
          country: userData.country || '',
          city: userData.city || '',
          region: userData.region || ''
        });

        // Update the complete user data in context
        const updatedUser = { 
          ...user, 
          ...userData,
          userId: user.userId // Ensure we keep the userId
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Check if it's an authentication error
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?.userId, navigate, setUser]);

  const handleChange = (e) => {
    setFormData(prev => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }));
    if (errors[e.target.name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[e.target.name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8080/user/${user.userId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      const updatedUserData = response.data;
      const updatedUser = {
        ...user,
        ...updatedUserData,
        userId: user.userId // Ensure we keep the userId
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data || 'An error occurred while updating the profile';
      alert(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:8080/user/${user.userId}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
      } catch (error) {
        console.error('Delete error:', error);
        const errorMessage = error.response?.data || 'An error occurred while deleting the account';
        alert(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
      }
    }
  };

  if (!user) return null;
  if (isLoading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 mb-16"> 
      <div className="max-w-2xl mx-auto bg-white rounded-none border-8 border-black p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-black">Profile Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <input
              type="text"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
              required
            />
            <input
              type="text"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
            required
          />
          <input
            type="tel"
            name="phonenum"
            value={formData.phonenum}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
          />
          <div className="grid grid-cols-2 gap-6">
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
            />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
            />
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              placeholder="Region"
              className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
            />
          </div>
          <button type="submit" className="w-full p-3 bg-red-600 text-white font-bold hover:bg-red-700 transition duration-300 border-4 border-black">
            Update Profile
          </button>
        </form>
        
        <div className="mt-8 space-y-6">
          <Link to="/my-orders" className="block w-full p-3 bg-blue-500 text-white text-center font-bold hover:bg-blue-600 transition duration-300 border-4 border-black">
            My Orders
          </Link>
          <Link to="/my-coupons" className="block w-full p-3 bg-yellow-400 text-black text-center font-bold hover:bg-yellow-500 transition duration-300 border-4 border-black">
            My Coupons
          </Link>
        </div>

        <button onClick={handleDelete} className="w-full p-3 mt-8 bg-black text-white font-bold hover:bg-gray-800 transition duration-300 border-4 border-white">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;