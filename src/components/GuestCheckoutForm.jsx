import React, { useState } from 'react';

const GuestCheckoutForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    address: '',
    postalCode: '',
    country: '',
    city: '',
    region: '',
    phonenum: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validation rules matching the backend entity constraints
  const validate = (name, value) => {
    switch (name) {
      case 'fname':
      case 'lname':
        return value.length >= 2 && value.length <= 50 
          ? '' 
          : 'Must be between 2 and 50 characters';
      
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'Please enter a valid email address';
      
      case 'phonenum':
        return value.length >= 6 && value.length <= 15 && /^\+?[\d\s-]+$/.test(value)
          ? ''
          : 'Phone number must be between 6 and 15 digits';
      
      case 'postalCode':
        return /^[A-Z0-9\s-]{3,10}$/i.test(value)
          ? ''
          : 'Please enter a valid postal code';
      
      case 'country':
      case 'city':
      case 'address':
      case 'region':

        return value.trim().length > 0
          ? ''
          : 'This field is required';
            
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

  if (touched[name]) {
    setErrors(prev => ({
      ...prev,
      [name]: validate(name, value)
    }));
  }
};
const handleBlur = (e) => {
  const { name, value } = e.target;
  setTouched(prev => ({
    ...prev,
    [name]: true
  }));
  setErrors(prev => ({
    ...prev,
    [name]: validate(name, value)
  }));
};

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validate(key, formData[key]);
      if (error) {
        validationErrors[key] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all fields as touched
      const touchedFields = {};
      Object.keys(formData).forEach(key => {
        touchedFields[key] = true;
      });
      setTouched(touchedFields);
      return;
    }

    onSubmit(formData);
  };
  const getInputClassName = (fieldName) => {
    const baseClasses = "mt-1 block w-full border-2 p-2";
    if (!touched[fieldName]) return `${baseClasses} border-black`;
    return `${baseClasses} ${
      errors[fieldName] 
        ? "border-red-500 bg-red-50" 
        : "border-green-500 bg-green-50"
    }`;
  };
  

  return (
    <div className="p-6 bg-white">
      <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
            type="text"
            name="fname"
            required
            className={getInputClassName('fname')}
            value={formData.fname}
            onChange={handleChange}
            onBlur={handleBlur}
            />
              {touched.fname && errors.fname && (
              <p className="mt-1 text-sm text-red-600">{errors.fname}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lname"
              required
              className={getInputClassName('lname')}
              value={formData.lname}
              onChange={handleChange}
              onBlur={handleBlur}
            />
              {touched.lname && errors.lname && (
              <p className="mt-1 text-sm text-red-600">{errors.lname}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className={getInputClassName('email')}
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            name="address"
            required
            className={getInputClassName('address')}
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
          />
           {touched.address && errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Postal Code</label>
            <input
              type="text"
              name="postalCode"
              required
              className={getInputClassName('postalCode')}
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
            />
             {touched.postalCode && errors.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              required
              className={getInputClassName('country')}
              value={formData.country}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.country && errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              required
              className={getInputClassName('city')}
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
              {touched.city && errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Region</label>
            <input
              type="text"
              name="region"
              className={getInputClassName('region')}
              value={formData.region}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.region && errors.region && (
            <p className="mt-1 text-sm text-red-600">{errors.region}</p>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phonenum"
            required
            className={getInputClassName('phonenum')}
            value={formData.phonenum}
            onChange={handleChange}
            onBlur={handleBlur}
          />
           {touched.phonenum && errors.phonenum && (
            <p className="mt-1 text-sm text-red-600">{errors.phonenum}</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition-colors"
        >
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default GuestCheckoutForm;