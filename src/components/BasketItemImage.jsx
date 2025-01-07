import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BasketItemImage = ({ recordId }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverImage = async () => {
      try {
        // First fetch the record details to get the images array
        const recordResponse = await axios.get(`http://localhost:8080/records/${recordId}`);
        const record = recordResponse.data;

        if (record.images && record.images.length > 0) {
          // Then fetch the cover image
          const imageResponse = await axios.get(
            `http://localhost:8080/records/images/${record.images[0].id}`,
            { responseType: 'blob' }
          );    
          const imageUrl = URL.createObjectURL(imageResponse.data);
          setCoverImage(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching cover image:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoverImage();

    return () => {
      if (coverImage) {
        URL.revokeObjectURL(coverImage);
      }
    };
  }, [recordId]);

  if (loading) {
    return <div className="aspect-square bg-gray-200 animate-pulse border-4 border-black" />;
  }

  return coverImage ? (
    <img 
      src={coverImage} 
      alt="Record cover"
      className="w-full h-full object-cover border-4 border-black"
    />
  ) : (
    <div className="aspect-square bg-blue-600 border-4 border-black flex items-center justify-center">
      <span className="text-white font-bold">No Cover</span>
    </div>
  );
};

export default BasketItemImage;