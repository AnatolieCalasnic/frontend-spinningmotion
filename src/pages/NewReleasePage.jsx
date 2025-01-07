import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useParams } from 'react-router-dom';

const NewReleasePage = () => {
  const { genre } = useParams(); // Get genre from URL if available
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        setLoading(true);
        let url = 'http://localhost:8080/records/new-releases';
        if (genre) {
          url = `http://localhost:8080/records/new-releases/${genre.toLowerCase()}`;
        }
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
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="border-8 border-black mb-8">
        <h1 className="bg-red-600 text-white text-3xl font-bold p-6 text-center">
          {genre ? `NEW ${genre.toUpperCase()} RELEASES` : 'NEW RELEASES'}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {newReleases.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default NewReleasePage;