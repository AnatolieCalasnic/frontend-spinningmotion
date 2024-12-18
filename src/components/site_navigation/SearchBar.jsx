import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ onClose }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm.length < 2) {
                setSearchResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://localhost:8080/search?searchTerm=${searchTerm}`);
                if (!response.ok) {
                    throw new Error('Search failed');
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error('Search error:', error);
                setError('Failed to fetch search results');
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleRecordClick = (recordId) => {
        navigate(`/product/${recordId}`);
        onClose();
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search records by title or artist"
                className="bg-transparent text-white px-4 py-2 w-full focus:outline-none placeholder-gray-400"
            />
            
            {/* Results Dropdown */}
            {searchResults.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white mt-1 rounded-md shadow-lg max-h-96 overflow-y-auto z-50">
                {searchResults.map((record) => (
                    <div 
                        key={record.id} 
                        className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleRecordClick(record.id)}
                    >
                        <div className="flex items-center flex-1">
                            <div className="text-gray-800">
                                <span className="font-medium">{record.artist}</span>
                                <span className="mx-2">-</span>
                                <span>{record.title}</span>
                                <span className="ml-2 text-gray-500">({record.year})</span>
                            </div>
                        </div>
                        {record.images && record.images[0] && (
                            <img 
                                src={record.images[0]} 
                                alt={record.title}
                                className="w-12 h-12 object-cover ml-4"
                            />
                        )}
                    </div>
                ))}
            </div>
        )}

            {isLoading && (
                <div className="absolute top-full left-0 w-full bg-white mt-1 p-4 rounded-md shadow-lg text-center text-gray-600">
                    Loading...
                </div>
            )}

            {error && (
                <div className="absolute top-full left-0 w-full bg-white mt-1 p-4 rounded-md shadow-lg text-center text-red-600">
                    {error}
                </div>
            )}

            {searchTerm.length > 0 && !isLoading && searchResults.length === 0 && !error && (
                <div className="absolute top-full left-0 w-full bg-white mt-1 p-4 rounded-md shadow-lg text-center text-gray-600">
                    No records found
                </div>
            )}
        </div>
    );
}