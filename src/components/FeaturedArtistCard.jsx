import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FeaturedArtistCard = ({ artist }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoverImage = async () => {
      try {
        const recordResponse = await axios.get(`http://localhost:8080/records/${artist.id}`);
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
  }, [artist.id]);

  return (
    <div className="h-64 mb-4 overflow-hidden">
      {loading ? (
        <div className="w-full h-full bg-gray-200 animate-pulse" />
      ) : coverImage ? (
        <img 
          src={coverImage} 
          alt={artist.artist}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-blue-600" />
      )}
    </div>
  );
};

export default FeaturedArtistCard;