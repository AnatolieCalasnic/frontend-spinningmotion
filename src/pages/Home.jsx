import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Loader, ArrowDown, Facebook, Instagram, Twitter, Music} from 'lucide-react';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import ProductCard from '../components/ProductCard';
import FeaturedArtistCard from '../components/FeaturedArtistCard';
import NewsletterSubscription from '../components/NewsletterSubscription';
import AboutSection from '../components/site_navigation/AboutSection';
import MusicPlayer from '../components/site_navigation/MusicPlayer';

export default function Home() {
  useAuthRedirect();
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestReleases, setLatestReleases] = useState([]);
  const [popularArtists, setPopularArtists] = useState([]);

  useEffect(() => {
    loadFeaturedAlbums();
    loadGenres();
    loadLatestReleases();
  }, []);

  useEffect(() => {
    const loadPopularArtists = async () => {
      try {
        const response = await axios.get('http://localhost:8080/records/popular-artists');
        setPopularArtists(response.data);
      } catch (error) {
        console.error("Error loading popular artists:", error);
        setPopularArtists([]);
      }
    };
  
    loadPopularArtists();
  }, []);
  
  const loadFeaturedAlbums = async () => {
    setIsLoading(true);
    try {
      const result = await axios.get("http://localhost:8080/featured-albums");
      setFeaturedAlbums(result.data);
    } catch (error) {
      console.error("Error loading featured albums:", error);
      setFeaturedAlbums([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGenres = async () => {
    try {
      const result = await axios.get("http://localhost:8080/genres");
      if (result.data && result.data.genres) {
        setGenres(result.data.genres);
      } else {
        console.error("Unexpected data structure for genres");
        setGenres([]);
      }
    } catch (error) {
      console.error("Error loading genres:", error);
      setGenres([]);
    }
  };
  const loadLatestReleases = async () => {
    try {
      const response = await axios.get('http://localhost:8080/records/new-releases');
      setLatestReleases(response.data.slice(0, 6)); // Get only the first 6 records
    } catch (error) {
      console.error("Error loading latest releases:", error);
      setLatestReleases([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <main className="flex-grow">
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* Featured Album */}
          <div className="col-span-12">
          <MusicPlayer />
          </div>

          {/* New Releases */}
          <div className="col-span-12 lg:col-span-8 bg-blue-600 p-6 text-lg">
            <h2 className="text-white  text-xl lg:text-2xl font-bold mb-4">NEW RELEASES</h2>
            <Link 
                to="/new-releases" 
                className="text-white hover:underline"
              >
                View All
              </Link>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader className="animate-spin text-white h-8 w-8" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
                  {latestReleases.length > 0 ? (
                  latestReleases.map((record) => (
                    <ProductCard key={record.id} product={record} />
                  ))
                ) : (
                  <p className="col-span-4 text-white text-center">No new releases available</p>
                )}
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="col-span-12 lg:col-span-4 bg-yellow-400 p-6">
            <h2 className="text-black text-xl lg:text-2xl font-bold mb-4">GENRES</h2>
            {genres.length > 0 ? (
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                {genres.map((genre, index) => (
                  <li key={index}>
                    <Link 
                      to={`/genre/${typeof genre === 'string' ? genre.toLowerCase() : genre.name.toLowerCase()}`} 
                      className="text-black uppercase hover:underline"
                    >
                      {typeof genre === 'string' ? genre : genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No genres available</p>
            )}
          </div>

          {/* About Us */}
          <div className="col-span-12 lg:col-span-4">
          <AboutSection />
          </div>

          {/* Featured Artists */}
          <div className="col-span-12 lg:col-span-8 bg-black text-white p-6">
            <h2 className="text-xl lg:text-2xl font-bold mb-4">FEATURED ARTISTS</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
                <div className="col-span-3 flex justify-center items-center h-32">
                  <Loader className="animate-spin text-white h-8 w-8" />
                </div>
              ) : popularArtists.length > 0 ? (
                popularArtists.map((artist, index) => (
                  <div 
                    key={artist.id} 
                    className="bg-white text-black border-4 border-black p-4 overflow-hidden"
                  >
                    {/* Artist Image or Placeholder */}
                    <FeaturedArtistCard artist={artist} />
                    
                    {/* Artist Info */}
                    <div className="mb-">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-xl">{artist.artist}</h3>
                        <span className="text-sm font-bold text-red-600">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-100 p-2 text-center">
                          <span className="block font-bold text-red-600">
                            {artist.title || 'Top Album'}
                          </span>
                          <span className="text-xs">Best Selling</span>
                        </div>
                        <Link 
                          to={`/artist/${artist.artist.toLowerCase().replace(/\s+/g, '-')}`}
                          className="bg-red-600 text-white p-2 text-center uppercase font-bold hover:bg-red-700 transition-colors"
                        >
                          View Collection
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="col-span-3 text-center">No featured artists available</p>
              )}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="col-span-12 bg-white border-4 border-black p-6">
            <NewsletterSubscription />
          </div>
        </div>
      </main>

    
    </div>
  );
}