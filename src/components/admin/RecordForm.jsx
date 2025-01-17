import ImageUpload from "./ImageUpload";
import React, { useState, useEffect } from 'react';

const RecordForm = ({ record, index, isEdit, onChange, genres }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    validateAllFields();
  }, [record]);

  const validateAllFields = () => {
    const allErrors = {
      title: validate('title', record.title),
      artist: validate('artist', record.artist),
      genreId: validate('genreId', record.genreId),
      price: validate('price', record.price),
      year: validate('year', record.year),
      condition: validate('condition', record.condition),
      quantity: validate('quantity', record.quantity)
    };
    setErrors(allErrors);
    
    // Return true if no errors, false if there are any errors
    return !Object.values(allErrors).some(error => error);
  };

  // Validation rules matching backend entity constraints
  const validate = (name, value) => {
    switch (name) {
      case 'title':
        if (!value?.trim()) return "Title is required";
        if (value.length < 1 || value.length > 255) 
          return "Title must be between 1 and 255 characters";
        return '';

      case 'artist':
        if (!value?.trim()) return "Artist name is required";
        if (value.length < 1 || value.length > 255) 
          return "Artist name must be between 1 and 255 characters";
        return '';

      case 'genreId':
        return !value ? 'Genre is required' : '';

      case 'price':
        if (!value) return 'Price is required';
        const priceNum = parseFloat(value);
        return priceNum < 0.01 ? 'Price must be at least €0.01' : '';

      case 'year':
        if (!value) return 'Release year is required';  
        const yearNum = parseInt(value, 10);
        return yearNum < 1900 ? 'Release year must be 1900 or later' : '';

      case 'condition':
        if (!value) return 'Condition is required';
        const validConditions = ['Mint', 'Near Mint', 'Very Good', 'Good'];
        return !validConditions.includes(value) 
          ? 'Condition must be one of: Mint, Near Mint, Very Good, Good' 
          : '';

      case 'quantity':
        if (!value && value !== 0) return 'Quantity is required';
        const quantityNum = parseInt(value, 10);
        return quantityNum < 1 ? 'Quantity must be at least 1' : '';

      default:
        return '';
    }
  };
  const handleChange = (field, value) => {
    // Always validate on change
    const error = validate(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    
    // Handle specific field validations and formatting
    switch (field) {
      case 'year':
        if (value === '' || /^\d{0,4}$/.test(value)) {
          onChange(index, field, value === '' ? null : parseInt(value, 10));
        }
        break;
        
      case 'price':
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
          onChange(index, field, value);
        }
        break;
        
      case 'quantity':
        if (value === '' || /^\d+$/.test(value)) {
          onChange(index, field, value);
        }
        break;
        
      default:
        onChange(index, field, value);
    }
    validateAllFields();
  };

    const handleImagesChange = (action, payload) => {
      console.log('handleImagesChange:', { action, payload, record });

      if (action === 'add') {
        // Ensure newImages exists and is an array
        const currentNewImages = record.newImages || [];
        console.log('Current newImages:', currentNewImages);
        console.log('Adding images:', payload);

        // For new images being added
        onChange(index, 'newImages', [...currentNewImages, ...payload]);
        
      } else if (action === 'remove') {
        const imageIndex = payload;
        const currentImages = record.images || [];
        
        // If removing existing image, mark for deletion
        if (imageIndex < currentImages.length) {
          const removedImage = currentImages[imageIndex];
          if (removedImage.id) {
            onChange(index, 'imagesToDelete', [...(record.imagesToDelete || []), removedImage.id]);
          }
          // Update current images array
          const updatedImages = [...currentImages];
          updatedImages.splice(imageIndex, 1);
          onChange(index, 'images', updatedImages);
        } else {
          // Remove from new images
          const newImageIndex = imageIndex - currentImages.length;
          const updatedNewImages = [...(record.newImages || [])];
          updatedNewImages.splice(newImageIndex, 1);
          onChange(index, 'newImages', updatedNewImages);
        }
      }
    };
    const handleBlur = (field, value) => {
      setTouched(prev => ({
        ...prev,
        [field]: true
      }));
      const error = validate(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    };
  
    const getInputClassName = (fieldName) => {
      const baseClasses = "w-full border-2 p-2";
      if (!touched[fieldName]) return `${baseClasses} border-black`;
      return `${baseClasses} ${
        errors[fieldName] 
          ? "border-red-500 bg-red-50" 
          : "border-green-500 bg-green-50"
      }`;
    };
    return (
      <div className="grid grid-cols-2 gap-4 p-4 border-4 border-black mb-4">
         <div className="col-span-2">
        <ImageUpload 
          existingImages={record.images || []}
          onChange={handleImagesChange}
          maxImages={4}
        />
      </div>
        <div className="col-span-2 md:col-span-1">
          <label className="block font-bold mb-2">Title</label>
          <input
            type="text"
            value={record.title || ''}
            onChange={e => handleChange('title', e.target.value)}
          onBlur={e => handleBlur('title', e.target.value)}
          className={getInputClassName('title')}
            required
          />
          {touched.title && errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>
  
        <div className="col-span-2 md:col-span-1">
          <label className="block font-bold mb-2">Artist</label>
          <input
            type="text"
            value={record.artist || ''}
            onChange={e => handleChange('artist', e.target.value)}
            onBlur={e => handleBlur('artist', e.target.value)}
            className={getInputClassName('artist')}
            required
          />
          {touched.artist && errors.artist && (
          <p className="mt-1 text-sm text-red-600">{errors.artist}</p>
          )}
        </div>
  
        <div>
          <label className="block font-bold mb-2">Genre</label>
          <select
            value={record.genreId || ''}
            onChange={e => handleChange('genreId', e.target.value)}
            onBlur={e => handleBlur('genreId', e.target.value)}
            className={getInputClassName('genreId')}
            required
          >
            <option value="">Select Genre</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          {touched.genreId && errors.genreId && (
          <p className="mt-1 text-sm text-red-600">{errors.genreId}</p>
        )}
        </div>
  
        <div>
          <label className="block font-bold mb-2">Price (€)</label>
          <input
            type="text"
            value={record.price || ''}
            onChange={e => handleChange('price', e.target.value)}
            onBlur={e => handleBlur('price', e.target.value)}
            className={getInputClassName('price')}
            required
            placeholder="0.00"
          />
           {touched.price && errors.price && (
          <p className="mt-1 text-sm text-red-600">{errors.price}</p>
           )}
        </div>
  
        <div>
          <label className="block font-bold mb-2">Release Year</label>
          <input
            type="text"
            value={record.year || ''}
            onChange={e => handleChange('year', e.target.value)}
            onBlur={e => handleBlur('year', e.target.value)}
            maxLength="4"
            className={getInputClassName('year')}
            placeholder="YYYY"
            required
          />
           {touched.year && errors.year && (
          <p className="mt-1 text-sm text-red-600">{errors.year}</p>
           )}
        </div>
  
        <div>
          <label className="block font-bold mb-2">Condition</label>
          <select
            value={record.condition || ''}
            onChange={e => handleChange('condition', e.target.value)}
            onBlur={e => handleBlur('condition', e.target.value)}
            className={getInputClassName('condition')}
            required
          >
            <option value="">Select Condition</option>
            <option value="Mint">Mint</option>
            <option value="Near Mint">Near Mint</option>
            <option value="Very Good">Very Good</option>
            <option value="Good">Good</option>
          </select>
          {touched.condition && errors.condition && (
          <p className="mt-1 text-sm text-red-600">{errors.condition}</p>
          )}
        </div>
  
        <div className="col-span-2">
          <label className="block font-bold mb-2">Quantity</label>
          <input
            type="text"
            value={record.quantity || ''}
            onChange={e => handleChange('quantity', e.target.value)}
            onBlur={e => handleBlur('quantity', e.target.value)}
            className={getInputClassName('quantity')}
            required
            placeholder="0"
          />
          {touched.quantity && errors.quantity && (
          <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default RecordForm;