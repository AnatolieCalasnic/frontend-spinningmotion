import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
const ProductCard = ({ product, isList = false }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverImage = async () => {
      try {
        const recordResponse = await axios.get(`http://localhost:8080/records/${product.id}`);
        const record = recordResponse.data;

        if (record.images && record.images.length > 0) {
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
      if (coverImage) URL.revokeObjectURL(coverImage);
    };
  }, [product.id]);

  return (
    <Link 
      to={`/product/${product.id}`}
      className={`block border-2 border-black p-2 hover:bg-gray-100 transition-colors
        ${isList ? 'flex gap-4' : 'flex flex-col'}`}
    >
      <div className={`aspect-square mb-2 overflow-hidden ${isList ? 'w-48' : 'w-full'}`}>
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : coverImage ? (
          <img 
            src={coverImage} 
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-blue-600" />
        )}
      </div>
      <div className={`flex flex-col ${isList ? 'flex-1' : ''}`}>
        <h3 className="font-bold text-sm">{product.title}</h3>
        <p className="text-xs">{product.artist}</p>
        <p className="font-bold text-sm mt-1 bg-yellow-400 inline-block px-2">
          €{product.price.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;