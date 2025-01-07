import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const NewReleases = ({ genre, limit }) => {
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        // Use the genre-specific endpoint
        const url = genre 
          ? `http://localhost:8080/records/new-releases/${genre.toLowerCase()}`
          : 'http://localhost:8080/records/new-releases';
          
        const response = await axios.get(url);
        setNewReleases(response.data);
      } catch (err) {
        console.error('Error fetching new releases:', err);
        setError('Failed to load new releases');
      } finally {
        setLoading(false);
      }
    };

    fetchNewReleases();
  }, [genre]);

  if (loading) {
    return <div className="flex justify-center items-center h-24">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (newReleases.length === 0) {
    return null;
  }

  const displayedReleases = limit ? newReleases.slice(0, limit) : newReleases;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {displayedReleases.map(record => (
        <ProductCard key={record.id} product={record} />
      ))}
    </div>
  );
};

export default NewReleases;