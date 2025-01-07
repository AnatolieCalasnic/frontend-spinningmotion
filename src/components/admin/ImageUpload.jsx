import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
const ImageUpload = ({ existingImages = [], onChange, maxImages = 4 }) => {
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadExistingImages = async () => {
      if (existingImages && existingImages.length > 0) {
        const newPreviews = await Promise.all(existingImages.map(async (image) => {
          if (image.id) {
            try {
              const response = await axios.get(
                `http://localhost:8080/records/images/${image.id}`,
                { responseType: 'blob' }
              );
              return URL.createObjectURL(response.data);
            } catch (error) {
              console.error('Error loading image:', error);
              return null;
            }
          }
          return null;
        }));
        setPreviews(newPreviews.filter(url => url !== null));
      }
    };
  
    loadExistingImages();
  
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [existingImages]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of images
    if (files.length + previews.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate each file
    for (const file of files) {
      if (file.size > 5000000) { // 5MB limit
        setError('File too large. Maximum size is 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
    }

    // Create preview URLs for new files
    const newPreviews = await Promise.all(
      files.map(async (file) => URL.createObjectURL(file))
    );

    setPreviews(prev => [...prev, ...newPreviews]);
    setError('');

    // Send files to parent component
    onChange('add', files);
  };

  const removeImage = (index) => {
    // Cleanup preview URL
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }

    // Remove preview
    setPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    // Notify parent
    onChange('remove', index);
  };

  return (
    <div className="border-4 border-black p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold">Record Images</h3>
        <p className="text-sm text-gray-600">First image will be the cover ({previews.length}/{maxImages})</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Existing Images */}
        {previews.map((preview, index) => (
          <div key={index} className="relative border-2 border-black aspect-square group">
            <img 
              src={preview} 
              alt={`Record ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {index === 0 && (
              <div className="absolute top-2 left-2 bg-yellow-400 px-2 py-1 text-xs font-bold">
                COVER
              </div>
            )}
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {previews.length < maxImages && (
          <label className="border-2 border-dashed border-black aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <Upload size={24} />
            <span className="mt-2 text-sm">Upload Image</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
};

export default ImageUpload;