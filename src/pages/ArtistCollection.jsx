import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { 
  Grid, 
  LayoutList, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter,
  ArrowUpDown
} from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function ArtistCollection() {
  const { artistName } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const genreParam = searchParams.get('genre');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('none'); // 'none', 'asc', 'desc'

  const itemsPerPage = viewMode === 'grid' ? 18 : 10;

  useEffect(() => {
    const fetchArtistRecords = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/records/artist/${artistName}`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching artist records:', err);
        setError('Failed to load artist records');
      } finally {
        setLoading(false);
      }
    };

    fetchArtistRecords();
  }, [artistName]);

  let filteredProducts = products.filter(product =>
    searchQuery === '' || 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (sortOrder !== 'none') {
    filteredProducts = [...filteredProducts].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
  }
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-8 border-black mb-8">
        <h1 className="bg-red-600 text-white text-3xl font-bold p-6 text-center">
          {artistName.toUpperCase()} RECORDS
        </h1>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search records..."
            className="w-full border-4 border-black p-2 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* View Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setViewMode('grid')}
            className={`border-4 border-black p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`border-4 border-black p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            <LayoutList size={20} />
          </button>
         <button
            onClick={() => {
              setSortOrder(current => {
                if (current === 'none') return 'asc';
                if (current === 'asc') return 'desc';
                return 'none';
              });
            }}
            className={`border-4 border-black p-2 ${
              sortOrder !== 'none' ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100'
            }`}
            title={sortOrder === 'asc' ? 'Price: Low to High' : sortOrder === 'desc' ? 'Price: High to Low' : 'Sort by Price'}
          >
            <ArrowUpDown size={20} />
          </button>
        </div>
      </div>

      {/* Product Grid/List */}
      <div className={`mb-8 ${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4' 
          : 'space-y-4'
      }`}>
        {currentProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4">
        <button 
          className="p-2 border-4 border-black disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <div className="flex space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`w-10 h-10 flex items-center justify-center border-4 border-black
                ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button 
          className="p-2 border-4 border-black disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Results Count */}
      <div className="text-center mt-4 text-gray-600">
        Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} records
      </div>
    </div>
  );
}