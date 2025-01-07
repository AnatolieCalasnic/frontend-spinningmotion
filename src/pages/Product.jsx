import React, { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import NewReleases from '../components/NewReleases';


import jazzFestImage from '../images/jazzfest-011824-98f274e7866c4dc89f0957d20210973e.jpg';



const fakeNewsData = {
  jazz: [
    { id: 1, title: "New Orleans Jazz Fest Announces Lineup", image: jazzFestImage },
    { id: 2, title: "Legendary Jazz Pianist Chick Corea Passes Away", image: "" },
    { id: 3, title: "Jazz at Lincoln Center Reopens with Star-Studded Concert", image: "" }
  ],
  rock: [
    { id: 1, title: "Foo Fighters Announce World Tour", image: "" },
    { id: 2, title: "Classic Rock Band Led Zeppelin Teases Reunion", image: "" },
    { id: 3, title: "Rock & Roll Hall of Fame Inductees Announced", image: "" }
  ],
  blues: [
    { id: 1, title: "Chicago Blues Festival Returns After Hiatus", image: "" },
    { id: 2, title: "B.B. King's Guitar 'Lucille' Sells for Record Price at Auction", image: "" },
    { id: 3, title: "New Buddy Guy Album Features Collaborations with Young Blues Artists", image: "" }
  ],
  folk: [
    { id: 1, title: "Bob Dylan's Handwritten Lyrics Fetch Millions at Auction", image: "" },
    { id: 2, title: "Newport Folk Festival Celebrates 60th Anniversary", image: "" },
    { id: 3, title: "Joni Mitchell Surprises Fans with Rare Live Performance", image: "" }
  ],
  classical: [
    { id: 1, title: "Vienna Philharmonic Announces New Year's Concert Program", image: "" },
    { id: 2, title: "Lost Mozart Manuscript Discovered in Prague Archives", image: "" },
    { id: 3, title: "Young Prodigy Wins International Chopin Piano Competition", image: "" }
  ],
  electronic: [
    { id: 1, title: "Daft Punk Hints at Possible Reunion", image: "daft-punk.jpg" },
    { id: 2, title: "Massive Electronic Music Festival Tomorrowland Goes Virtual", image: "" },
    { id: 3, title: "Aphex Twin Releases Surprise Album of Unreleased Tracks", image: "" }
  ],
  country: [
    { id: 1, title: "Dolly Parton Inducted into Rock & Roll Hall of Fame", image: "" },
    { id: 2, title: "CMA Awards Announce This Year's Nominees", image: "" },
    { id: 3, title: "Rising Country Star Makes Grand Ole Opry Debut", image: "" }
  ],
  reggae: [
    { id: 1, title: "Bob Marley's 'One Love' Named Song of the Century", image: "" },
    { id: 2, title: "Reggae Sunsplash Festival Makes Comeback After 14 Years", image: "" },
    { id: 3, title: "Jamaican Government Declares Reggae Month", image: "" }
  ],
  pop: [
    { id: 1, title: "Beyoncé Breaks Grammy Record with Most Wins", image: "" },
    { id: 2, title: "Taylor Swift Announces Re-Recorded Album Release Date", image: ""},
  ],
   "hip hop": [
    { id: 1, title: "Kendrick Lamar Announces New Album", image: "" },
    { id: 2, title: "Hip Hop Hall of Fame Museum to Open in Harlem", image: "" },
    { id: 3, title: "Drake Breaks Streaming Record with Latest Release", image: "" }
  ]
}

const ProductPage = () => {
  const { genre } = useParams();
  const [products, setProducts] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReleases, setNewReleases] = useState([]);



  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const normalizedGenre = genre.toLowerCase();
        // Call your backend API to get records by genre
        const response = await axios.get(`http://localhost:8080/records/genre/${normalizedGenre}`);
        setProducts(response.data);
        
        const newReleasesResponse = await axios.get(`http://localhost:8080/records/new-releases/${normalizedGenre}`);
        setNewReleases(newReleasesResponse.data);
        
        // Keep the news data fake for now
        setNewsItems(fakeNewsData[normalizedGenre] || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
  
    if (genre) {
      fetchProducts();
    }
  }, [genre]);


  const formattedGenre = genre.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-600">{error}</div>;
  }
  return (
    <div className="max-w-6xl mx-auto bg-white text-black font-sans p-4">
      <h1 className="text-4xl font-bold mb-8 bg-red-600 text-white p-4">{genre.charAt(0).toUpperCase() + genre.slice(1)}: This Week New</h1>
      
      {/* New Releases Section */}
       <div className="mb-12 border-4 border-black p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-yellow-400 p-2">New Releases</h2>
          <Link to={`/new-releases/${genre}`}
              className="bg-black text-white px-4 py-2 flex items-center">
            View all <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
        
        {newReleases.length === 0 ? (
        <div className="text-center py-4 text-gray-600">No releases as of yet</div>
        ) : (
          <NewReleases genre={genre} limit={5} />
        )}     
      </div>

      {/* All Records Section */}
      <div className="mb-12 border-4 border-black p-4">
        <h2 className="text-2xl font-bold mb-4 bg-blue-600 text-white p-2">All records</h2>
        <div className="grid grid-cols-5 gap-4">
          {products.slice(0, 5).map((record) => (
             <ProductCard key={record.id} product={record} />
            ))}
          <Link to={`/products?genre=${genre}`}  className="flex items-center justify-center border-2 border-black hover:bg-gray-100 transition-colors">
            <button className="bg-black text-white p-4 w-full h-full">
              <ArrowRight size={24} />
            </button>
          </Link>
        </div>
      </div>

      {/* Genre News Section */}
      <div className="border-4 border-black p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-red-600 text-white p-2">{formattedGenre}: News</h2>
          <Link to="/news" className="bg-yellow-400 font-bold px-4 py-2 hover:bg-yellow-500 transition-colors">View all</Link>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {newsItems.map((item, index) => (
            <Link key={item.id} to={`/news/${item.id}`} className="border-2 border-black p-2 hover:bg-gray-100 transition-colors">
              <div className="aspect-video mb-2 overflow-hidden">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${index % 3 === 0 ? 'bg-blue-600' : index % 3 === 1 ? 'bg-red-600' : 'bg-yellow-400'}`}></div>
                )}
              </div>
              <h3 className="font-bold bg-black text-white p-1">{item.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;