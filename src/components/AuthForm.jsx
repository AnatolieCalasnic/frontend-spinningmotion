import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthForm = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const initialFormData = {
    email: '',
    password: '',
    fname: '',
    lname: '',
    address: '',
    postalCode: '',
    country: '',
    city: '',
    region: '',
    phonenum: ''
  };
   const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    
    // Basic validation for email and password
    if (!formData.email || !formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    // For registration, validate all required fields
    if (!isLogin) {
      if (!formData.fname || formData.fname.length < 2) {
        newErrors.fname = 'First name must be at least 2 characters.';
      }
      if (!formData.lname || formData.lname.length < 2) {
        newErrors.lname = 'Last name must be at least 2 characters.';
      }
      if (!formData.address) {
        newErrors.address = 'Address is required.';
      }
      if (!formData.postalCode) {
        newErrors.postalCode = 'Postal code is required.';
      }
      if (!formData.country) {
        newErrors.country = 'Country is required.';
      }
      if (!formData.city) {
        newErrors.city = 'City is required.';
      }
      if (!formData.phonenum || formData.phonenum.length < 6 || formData.phonenum.length > 15) {
        newErrors.phonenum = 'Phone number must be between 6 and 15 characters.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clearing error for the field being changed
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isLogin) {
        console.log('Attempting login...');
        await login(formData.email, formData.password);
        console.log('Login successful');
        if (onClose) onClose();
        navigate('/');
      } else {
        // Registration
        const registrationData = {
          ...formData,
          region: formData.region || '',
          isAdmin: false // Set default value for isAdmin
        };

        const response = await fetch('http://localhost:8080/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(registrationData)
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData || 'Registration failed');
        }

        // After successful registration, log in automatically
        await login(formData.email, formData.password);
        if (onClose) onClose();
        navigate('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors(prev => ({
        ...prev,
        form: error.message || 'Authentication failed. Please try again.'
      }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData(initialFormData);
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
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
              />
              {errors.address && (
                <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.address}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="Postal Code"
                  className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
                />
                {errors.postalCode && (
                  <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.postalCode}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
                />
                {errors.country && (
                  <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.country}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
                />
                {errors.city && (
                  <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.city}</p>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="phonenum"
                  value={formData.phonenum}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="w-full p-3 border-4 border-black focus:outline-none focus:ring-4 focus:ring-yellow-400 placeholder-gray-500"
                />
                {errors.phonenum && (
                  <p className="absolute -bottom-5 left-0 text-red-600 text-sm">{errors.phonenum}</p>
                )}
              </div>
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
          onClick=
           {toggleMode} 
         className="text-blue-600 hover:underline font-bold"
        >
          {isLogin ? 'Need to create an account?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;