import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchResultImage = ({ recordId }) => {
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const abortController = new AbortController();

    const fetchCoverImage = async () => {
      try {
        setIsLoading(true);
        
        // Directly fetch images from record_images table for this record
        const response = await axios.get(
          `http://localhost:8080/records/${recordId}/images`,
          { signal: abortController.signal }
        );

        if (!mounted) return;

        if (response.data && response.data.length > 0) {
          // Get the first image (cover image)
          const imageId = response.data[0].id;
          const imageResponse = await axios.get(
            `http://localhost:8080/records/images/${imageId}`,
            { 
              responseType: 'blob',
              signal: abortController.signal 
            }
          );

          if (!mounted) return;

          const imageUrl = URL.createObjectURL(imageResponse.data);
          setCoverImage(imageUrl);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
          return;
        }
        console.error('Error fetching image:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchCoverImage();

    return () => {
      mounted = false;
      abortController.abort();
      if (coverImage) {
        URL.revokeObjectURL(coverImage);
      }
    };
  }, [recordId]);

  if (isLoading) {
    return (
      <div className="w-12 h-12 bg-gray-200 ml-4 border-2 border-black animate-pulse flex items-center justify-center">
        <span className="text-xs text-gray-500">...</span>
      </div>
    );
  }

  if (!coverImage) {
    return (
      <div className="w-12 h-12 bg-gray-100 ml-4 border-2 border-black flex items-center justify-center">
        <span className="text-xs text-gray-500">No Cover</span>
      </div>
    );
  }

  return (
    <img 
      src={coverImage} 
      alt="Record cover"
      className="w-12 h-12 object-cover ml-4 border-2 border-black"
      onError={() => {
        setCoverImage(null);
      }}
    />
  );
};

export default SearchResultImage;