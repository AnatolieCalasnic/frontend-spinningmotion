import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Profile = ({ user, setUser }) => {
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setFormData({
        fname: user.fname || '',
        lname: user.lname || '',
        email: user.email || '',
        phonenum: user.phonenum || '',
        address: user.address || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
        city: user.city || '',
        region: user.region || '',
      });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/user/${user.id}`, formData);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      alert(error.response?.data || 'An error occurred');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await axios.delete(`http://localhost:8080/user/${user.id}`);
        setUser(null);
        localStorage.removeItem('user');
        navigate('/');
      } catch (error) {
        console.error('Delete error:', error);
        alert(error.response?.data || 'An error occurred');
      }
    }
  };

  if (!user) return null;

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