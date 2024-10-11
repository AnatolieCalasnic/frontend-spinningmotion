import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ setUser, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fname: '',
    lname: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    if (!formData.email.includes('@')) {
      newErrors.email = 'Please include an "@" in the email address.';
    }
    if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }
    if (!isLogin && !formData.fname) {
      newErrors.fname = 'First name is required.';
    }
    if (!isLogin && !formData.lname) {
      newErrors.lname = 'Last name is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        `http://localhost:8080/${isLogin ? 'login' : 'user'}`,
        formData,
        
      );
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      onClose();
    } catch (error) {
      console.error('Authentication error:', error);
      setErrors({ form: error.response?.data || 'An error occurred' });
    }
  };

  return (
    <div className="bg-white p-8 rounded-none border-8 border-black">
      <h2 className="text-3xl font-bold text-center mb-6 text-black">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
          />
          {errors.email && (
            <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.email}</p>
          )}
        </div>
        <div className="relative">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
          />
          {errors.password && (
            <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.password}</p>
          )}
        </div>
        {!isLogin && (
          <>
            <div className="relative">
              <input
                type="text"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
              />
              {errors.fname && (
                <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.fname}</p>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
              />
              {errors.lname && (
                <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.lname}</p>
              )}
            </div>
          </>
        )}
        {errors.form && <p className="text-red-600 text-sm text-center">{errors.form}</p>}
        <button
          type="submit"
          className="w-full p-3 bg-red-600 text-white font-bold hover:bg-red-700 transition duration-300 border-4 border-black"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 hover:underline font-bold"
        >
          {isLogin ? 'Need to create an account?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;