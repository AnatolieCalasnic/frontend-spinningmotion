import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Play, Pause, Loader, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedAlbums();
    loadGenres();
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
      console.log("Genres data received:", result.data);
      if (result.data && Array.isArray(result.data.genres)) {
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

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans">
      <main className="flex-grow">
        <div className="grid grid-cols-12 gap-4 p-4">
          {/* Featured Album */}
          <div className="col-span-12 bg-red-600 p-6 flex items-center">
            <div className="w-32 h-32 bg-white rounded-full flex-shrink-0 flex items-center justify-center mr-6">
              <button onClick={() => setIsPlaying(!isPlaying)} className="text-red-600">
                {isPlaying ? <Pause className="h-12 w-12" /> : <Play className="h-12 w-12" />}
              </button>
            </div>
            <div>
              <h2 className="text-white text-3xl font-bold mb-2">FEATURED ALBUM</h2>
              <p className="text-white">Experience our top pick of the week</p>
            </div>
          </div>

          {/* New Releases */}
          <div className="col-span-8 bg-blue-600 p-6">
            <h2 className="text-white text-2xl font-bold mb-4">NEW RELEASES</h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader className="animate-spin text-white h-12 w-12" />
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {featuredAlbums.length > 0 ? (
                  featuredAlbums.slice(0, 4).map((album, index) => (
                    <div key={index} className="bg-white aspect-square"></div>
                  ))
                ) : (
                  <p className="col-span-4 text-white text-center">No new releases available</p>
                )}
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="col-span-4 bg-yellow-400 p-6">
            <h2 className="text-black text-2xl font-bold mb-4">GENRES</h2>
            {genres.length > 0 ? (
              <ul className="grid grid-cols-2 gap-2">
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
          <div className="col-span-4 bg-white border-4 border-black p-6">
            <h2 className="text-black text-2xl font-bold mb-4">ABOUT US</h2>
            <p className="text-black">BLAH BLAH BLAH, BEST RECORDS... BLAH BLAH BLAH.</p>
          </div>

          {/* Featured Artists */}
          <div className="col-span-8 bg-black text-white p-6">
            <h2 className="text-2xl font-bold mb-4">FEATURED ARTISTS</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white aspect-square"></div>
              <div className="bg-red-600 aspect-square"></div>
              <div className="bg-blue-600 aspect-square"></div>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="col-span-12 bg-white border-4 border-black p-6">
            <h2 className="text-black text-2xl font-bold mb-4">JOIN OUR MAILING LIST</h2>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-grow p-2 border-2 border-black" />
              <button className="bg-black text-white px-6 py-2 uppercase font-bold">Subscribe</button>
            </div>
          </div>
        </div>
      </main>

    
    </div>
  );
}