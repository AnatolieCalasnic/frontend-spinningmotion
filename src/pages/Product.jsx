import React, { useState, useEffect } from 'react';
import { useParams, Link} from 'react-router-dom';
import { ArrowRight } from 'lucide-react';


import jazzFestImage from '../images/jazzfest-011824-98f274e7866c4dc89f0957d20210973e.jpg';

// Fake data for different genres
const fakeProductsData = {
  jazz: [
    { id: 1, title: "Kind of Blue", artist: "Miles Davis", price: 24.99 },
    { id: 2, title: "A Love Supreme", artist: "John Coltrane", price: 21.95 },
    { id: 3, title: "Time Out", artist: "Dave Brubeck Quartet", price: 19.99 },
    { id: 4, title: "Ella and Louis", artist: "Ella Fitzgerald & Louis Armstrong", price: 22.95 },
    { id: 5, title: "Head Hunters", artist: "Herbie Hancock", price: 20.99 },
    { id: 6, title: "Bitches Brew", artist: "Miles Davis", price: 26.99 },
    { id: 7, title: "Giant Steps", artist: "John Coltrane", price: 23.95 },
    { id: 8, title: "Mingus Ah Um", artist: "Charles Mingus", price: 22.99 },
    { id: 9, title: "The Black Saint and the Sinner Lady", artist: "Charles Mingus", price: 25.95 },
    { id: 10, title: "Blue Train", artist: "John Coltrane", price: 21.99 }
  ],
  rock: [
    { id: 1, title: "The Dark Side of the Moon", artist: "Pink Floyd", price: 29.99 },
    { id: 2, title: "Led Zeppelin IV", artist: "Led Zeppelin", price: 27.95 },
    { id: 3, title: "Back in Black", artist: "AC/DC", price: 23.99 },
    { id: 4, title: "Nevermind", artist: "Nirvana", price: 25.95 },
    { id: 5, title: "Appetite for Destruction", artist: "Guns N' Roses", price: 24.99 },
    { id: 6, title: "The Joshua Tree", artist: "U2", price: 26.99 },
    { id: 7, title: "Born to Run", artist: "Bruce Springsteen", price: 23.95 },
    { id: 8, title: "Rumours", artist: "Fleetwood Mac", price: 22.99 },
    { id: 9, title: "Who's Next", artist: "The Who", price: 24.95 },
    { id: 10, title: "Ten", artist: "Pearl Jam", price: 21.99 }
  ],
  blues: [
    { id: 1, title: "The Complete Recordings", artist: "Robert Johnson", price: 34.99 },
    { id: 2, title: "At Last!", artist: "Etta James", price: 22.95 },
    { id: 3, title: "Born Under a Bad Sign", artist: "Albert King", price: 21.99 },
    { id: 4, title: "Texas Flood", artist: "Stevie Ray Vaughan", price: 23.95 },
    { id: 5, title: "I Am the Blues", artist: "Willie Dixon", price: 20.99 },
    { id: 6, title: "The Healer", artist: "John Lee Hooker", price: 24.99 },
    { id: 7, title: "Riding with the King", artist: "B.B. King & Eric Clapton", price: 26.95 },
    { id: 8, title: "Hard Again", artist: "Muddy Waters", price: 22.99 },
    { id: 9, title: "Born to Play Guitar", artist: "Buddy Guy", price: 23.95 },
    { id: 10, title: "The Real Folk Blues", artist: "Howlin' Wolf", price: 21.99 }
  ],
  folk: [
    { id: 1, title: "The Freewheelin' Bob Dylan", artist: "Bob Dylan", price: 26.99 },
    { id: 2, title: "Blue", artist: "Joni Mitchell", price: 23.95 },
    { id: 3, title: "Bridge Over Troubled Water", artist: "Simon & Garfunkel", price: 22.99 },
    { id: 4, title: "Graceland", artist: "Paul Simon", price: 24.95 },
    { id: 5, title: "Sweet Baby James", artist: "James Taylor", price: 21.99 },
    { id: 6, title: "Tea for the Tillerman", artist: "Cat Stevens", price: 23.99 },
    { id: 7, title: "Harvest", artist: "Neil Young", price: 25.95 },
    { id: 8, title: "The Tracks of My Tears", artist: "Joan Baez", price: 22.99 },
    { id: 9, title: "After the Gold Rush", artist: "Neil Young", price: 24.95 },
    { id: 10, title: "If I Could Only Remember My Name", artist: "David Crosby", price: 21.99 }
  ],
  classical: [
    { id: 1, title: "The Four Seasons", artist: "Antonio Vivaldi", price: 28.99 },
    { id: 2, title: "Symphony No. 9", artist: "Ludwig van Beethoven", price: 30.95 },
    { id: 3, title: "The Nutcracker Suite", artist: "Pyotr Ilyich Tchaikovsky", price: 27.99 },
    { id: 4, title: "Clair de Lune", artist: "Claude Debussy", price: 25.95 },
    { id: 5, title: "The Planets", artist: "Gustav Holst", price: 29.99 },
    { id: 6, title: "Eine kleine Nachtmusik", artist: "Wolfgang Amadeus Mozart", price: 26.99 },
    { id: 7, title: "The Well-Tempered Clavier", artist: "Johann Sebastian Bach", price: 31.95 },
    { id: 8, title: "Ride of the Valkyries", artist: "Richard Wagner", price: 28.99 },
    { id: 9, title: "Canon in D", artist: "Johann Pachelbel", price: 24.95 },
    { id: 10, title: "1812 Overture", artist: "Pyotr Ilyich Tchaikovsky", price: 27.99 }
  ],
  electronic: [
    { id: 1, title: "Random Access Memories", artist: "Daft Punk", price: 29.99 },
    { id: 2, title: "Worlds", artist: "Porter Robinson", price: 26.95 },
    { id: 3, title: "Cross", artist: "Justice", price: 24.99 },
    { id: 4, title: "Homework", artist: "Daft Punk", price: 27.95 },
    { id: 5, title: "Immunity", artist: "Jon Hopkins", price: 25.99 },
    { id: 6, title: "Discovery", artist: "Daft Punk", price: 28.99 },
    { id: 7, title: "Syro", artist: "Aphex Twin", price: 26.95 },
    { id: 8, title: "Settle", artist: "Disclosure", price: 23.99 },
    { id: 9, title: "Untrue", artist: "Burial", price: 25.95 },
    { id: 10, title: "In Colour", artist: "Jamie xx", price: 24.99 }
  ],
  country: [
    { id: 1, title: "Breathe", artist: "Faith Hill", price: 22.99 },
    { id: 2, title: "The Woman in Me", artist: "Shania Twain", price: 21.95 },
    { id: 3, title: "Traveller", artist: "Chris Stapleton", price: 24.99 },
    { id: 4, title: "Golden Hour", artist: "Kacey Musgraves", price: 23.95 },
    { id: 5, title: "Crash My Party", artist: "Luke Bryan", price: 20.99 },
    { id: 6, title: "Fearless", artist: "Taylor Swift", price: 25.99 },
    { id: 7, title: "Ripcord", artist: "Keith Urban", price: 22.95 },
    { id: 8, title: "Here for the Party", artist: "Gretchen Wilson", price: 21.99 },
    { id: 9, title: "Chief", artist: "Eric Church", price: 23.95 },
    { id: 10, title: "Montevallo", artist: "Sam Hunt", price: 22.99 }
  ],
  reggae: [
    { id: 1, title: "Legend", artist: "Bob Marley & The Wailers", price: 29.99 },
    { id: 2, title: "Catch a Fire", artist: "The Wailers", price: 24.95 },
    { id: 3, title: "Exodus", artist: "Bob Marley & The Wailers", price: 26.99 },
    { id: 4, title: "Burnin'", artist: "The Wailers", price: 23.95 },
    { id: 5, title: "Uprising", artist: "Bob Marley & The Wailers", price: 25.99 },
    { id: 6, title: "Natty Dread", artist: "Bob Marley & The Wailers", price: 24.99 },
    { id: 7, title: "Two Sevens Clash", artist: "Culture", price: 22.95 },
    { id: 8, title: "Equal Rights", artist: "Peter Tosh", price: 23.99 },
    { id: 9, title: "Marcus Garvey", artist: "Burning Spear", price: 21.95 },
    { id: 10, title: "Funky Kingston", artist: "Toots & The Maytals", price: 20.99 }
  ],
  pop: [
    { id: 1, title: "21", artist: "Adele", price: 24.99 },
    { id: 2, title: "Thriller", artist: "Michael Jackson", price: 26.95 },
    { id: 3, title: "1989", artist: "Taylor Swift", price: 23.99 },
    { id: 4, title: "Born This Way", artist: "Lady Gaga", price: 22.95 },
    { id: 5, title: "Teenage Dream", artist: "Katy Perry", price: 21.99 },
    { id: 6, title: "The Fame Monster", artist: "Lady Gaga", price: 23.99 },
    { id: 7, title: "In the Zone", artist: "Britney Spears", price: 20.95 },
    { id: 8, title: "Confessions", artist: "Usher", price: 22.99 },
    { id: 9, title: "Justified", artist: "Justin Timberlake", price: 21.95 },
    { id: 10, title: "Thank U, Next", artist: "Ariana Grande", price: 24.99 }
  ],
  "hip hop": [
    { id: 1, title: "The Blueprint", artist: "Jay-Z", price: 24.99 },
    { id: 2, title: "To Pimp a Butterfly", artist: "Kendrick Lamar", price: 26.95 },
    { id: 3, title: "The Marshall Mathers LP", artist: "Eminem", price: 23.99 },
    { id: 4, title: "The College Dropout", artist: "Kanye West", price: 25.95 },
    { id: 5, title: "Illmatic", artist: "Nas", price: 22.99 },
    { id: 6, title: "The Chronic", artist: "Dr. Dre", price: 24.99 },
    { id: 7, title: "Ready to Die", artist: "The Notorious B.I.G.", price: 23.95 },
    { id: 8, title: "The Low End Theory", artist: "A Tribe Called Quest", price: 21.99 },
    { id: 9, title: "My Beautiful Dark Twisted Fantasy", artist: "Kanye West", price: 27.95 },
    { id: 10, title: "good kid, m.A.A.d city", artist: "Kendrick Lamar", price: 25.99 }
  ]
};

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

  useEffect(() => {
      const normalizedGenre = genre.toLowerCase();
      setProducts(fakeProductsData[normalizedGenre] || []);
      setNewsItems(fakeNewsData[normalizedGenre] || []);
  }, [genre]);

  const formattedGenre = genre.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="max-w-6xl mx-auto bg-white text-black font-sans p-4">
      <h1 className="text-4xl font-bold mb-8 bg-red-600 text-white p-4">{genre.charAt(0).toUpperCase() + genre.slice(1)}: This Week New</h1>
      
      {/* New Releases Section */}
       <div className="mb-12 border-4 border-black p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold bg-yellow-400 p-2">New Releases</h2>
          <button className="bg-black text-white px-4 py-2 flex items-center">
            View all <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {products.slice(0, 5).map((record, index) => (
            <Link key={record.id} to={`/product/${record.id}`} className="text-center border-2 border-black p-2 hover:bg-gray-100 transition-colors">
              <div className="aspect-square mb-2 overflow-hidden">
                {record.image ? (
                  <img src={record.image} alt={record.title} className="w-full h-full object-cover" />
                ) : (
                  <div className={`w-full h-full ${index % 2 === 0 ? 'bg-blue-600' : 'bg-red-600'}`}></div>
                )}
              </div>
              <h3 className="font-bold text-sm">{record.title}</h3>
              <p className="text-xs">{record.artist}</p>
              <p className="font-bold text-sm mt-1 bg-yellow-400 inline-block px-2">€{record.price.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Edition Records Campaign Section */}
      <div className="mb-12 border-4 border-black p-4">
        <h2 className="text-2xl font-bold mb-4 bg-blue-600 text-white p-2">Edition Records Campaign</h2>
        <div className="grid grid-cols-5 gap-4">
          {products.slice(5, 10).map((record, index) => (
            <Link key={record.id} to={`/product/${record.id}`} className="text-center border-2 border-black p-2 hover:bg-gray-100 transition-colors">
              <div className={`aspect-square mb-2 ${index % 2 === 0 ? 'bg-yellow-400' : 'bg-red-600'}`}></div>
              <h3 className="font-bold text-sm">{record.title}</h3>
              <p className="text-xs">{record.artist}</p>
              <p className="font-bold text-sm mt-1 bg-blue-600 text-white inline-block px-2">€{record.price.toFixed(2)}</p>
            </Link>
          ))}
          <Link to="/campaign" className="flex items-center justify-center border-2 border-black hover:bg-gray-100 transition-colors">
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