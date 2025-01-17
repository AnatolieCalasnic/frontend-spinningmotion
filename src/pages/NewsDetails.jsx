import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

import jazzFestImage from '../images/jazzfest-011824-98f274e7866c4dc89f0957d20210973e.jpg';
const newsData = {
  jazz: [
    { 
      id: 1, 
      title: "New Orleans Jazz Fest Announces Lineup", 
      image: jazzFestImage,
      content: "The legendary New Orleans Jazz & Heritage Festival has unveiled its highly anticipated lineup for this year. Music lovers can expect an incredible mix of local and international jazz talents, celebrating the rich musical heritage of New Orleans. The festival promises to showcase both legendary performers and emerging artists, continuing its tradition of musical excellence."
    },
    { 
      id: 2, 
      title: "Legendary Jazz Pianist Chick Corea Passes Away", 
      image: "",
      content: "The jazz world mourns the loss of Chick Corea, a revolutionary pianist and composer who reshaped the landscape of jazz fusion. Known for his incredible technical skill and innovative approach to music, Corea won 23 Grammy Awards and was a pivotal figure in the jazz fusion movement of the 1970s. His legacy continues to inspire musicians across generations."
    },
    { 
      id: 3, 
      title: "Jazz at Lincoln Center Reopens with Star-Studded Concert", 
      image: "",
      content: "Jazz at Lincoln Center has reopened its doors with a spectacular concert featuring some of the most renowned jazz musicians of our time. The event marks a triumphant return to live performances, celebrating the resilience of jazz and its cultural significance. Audiences can expect an unforgettable night of music that honors both traditional and contemporary jazz styles."
    }
  ],
  rock: [
    { 
      id: 1, 
      title: "Foo Fighters Announce World Tour", 
      image: "",
      content: "The Foo Fighters are set to embark on a massive world tour, marking their return to the global stage. Fans can expect an electrifying series of concerts that showcase the band's legendary rock energy. The tour promises to be a celebration of their extensive catalog and their continued relevance in the rock music scene."
    },
    { 
      id: 2, 
      title: "Classic Rock Band Led Zeppelin Teases Reunion", 
      image: "",
      content: "Rumors are swirling about a potential Led Zeppelin reunion that has rock fans around the world buzzing with excitement. While details remain sparse, the band has hinted at a possible special performance that would celebrate their monumental impact on rock music. Music enthusiasts are eagerly awaiting more information about this potential historic event."
    },
    { 
      id: 3, 
      title: "Rock & Roll Hall of Fame Inductees Announced", 
      image: "",
      content: "The Rock & Roll Hall of Fame has revealed its latest class of inductees, honoring the most influential and groundbreaking artists in rock music. This year's selection celebrates musicians who have pushed the boundaries of rock and influenced generations of artists. The induction ceremony promises to be a star-studded event celebrating musical excellence."
    }
  ],
  blues: [
    { 
      id: 1, 
      title: "Chicago Blues Festival Returns After Hiatus", 
      image: "",
      content: "The legendary Chicago Blues Festival is making a triumphant return after a challenging hiatus. Music lovers can once again experience the raw emotion and incredible talent of blues musicians from around the world. The festival promises to showcase both veteran performers and emerging artists, keeping the blues tradition alive and vibrant."
    },
    { 
      id: 2, 
      title: "B.B. King's Guitar 'Lucille' Sells for Record Price at Auction", 
      image: "",
      content: "A piece of blues history has been sold as B.B. King's iconic guitar 'Lucille' fetched an unprecedented price at a recent auction. The sale highlights the enduring legacy of the blues legend and the immense cultural significance of his music. Collectors and music enthusiasts from around the world competed for this historic instrument."
    },
    { 
      id: 3, 
      title: "New Buddy Guy Album Features Collaborations with Young Blues Artists", 
      image: "",
      content: "Blues legend Buddy Guy has announced a groundbreaking new album that bridges generations of blues musicians. The record features exciting collaborations with young, up-and-coming blues artists, showcasing the continuing evolution of the genre. Guy continues to prove why he's considered a living legend in the blues world."
    }
  ],
  folk: [
    { 
      id: 1, 
      title: "Bob Dylan's Handwritten Lyrics Fetch Millions at Auction", 
      image: "",
      content: "A collection of Bob Dylan's handwritten lyrics has sold for a staggering amount at a recent auction, underscoring the artistic and historical value of his work. The manuscripts provide a rare glimpse into the creative process of one of folk music's most influential songwriters. Collectors and music historians are thrilled by this significant acquisition."
    },
    { 
      id: 2, 
      title: "Newport Folk Festival Celebrates 60th Anniversary", 
      image: "",
      content: "The iconic Newport Folk Festival is marking its 60th anniversary, celebrating six decades of musical innovation and cultural significance. From Bob Dylan's legendary electric performance to today's emerging folk artists, the festival continues to be a cornerstone of American folk music. Special performances and commemorative events are planned to honor this milestone."
    },
    { 
      id: 3, 
      title: "Joni Mitchell Surprises Fans with Rare Live Performance", 
      image: "",
      content: "Legendary folk artist Joni Mitchell delighted fans with a rare and unexpected live performance, reminding the world of her incredible musical talent. After years of limited public appearances, Mitchell's performance was a momentous occasion for music lovers. Her return to the stage showcases the enduring power of folk music."
    }
  ],
  classical: [
    { 
      id: 1, 
      title: "Vienna Philharmonic Announces New Year's Concert Program", 
      image: "",
      content: "The world-renowned Vienna Philharmonic has unveiled its upcoming New Year's Concert program, promising a spectacular musical experience. Known for its traditional and prestigious New Year's Day concert, the orchestra will present a carefully curated selection of classical masterpieces. Music enthusiasts can look forward to an evening of unparalleled musical excellence."
    },
    { 
      id: 2, 
      title: "Lost Mozart Manuscript Discovered in Prague Archives", 
      image: "",
      content: "A groundbreaking discovery has sent waves through the classical music world: a previously unknown manuscript by Wolfgang Amadeus Mozart has been found in Prague's archives. Music historians and Mozart scholars are excited about the potential insights this manuscript might provide into the composer's creative process and musical genius."
    },
    { 
      id: 3, 
      title: "Young Prodigy Wins International Chopin Piano Competition", 
      image: "",
      content: "A young, extraordinarily talented pianist has emerged victorious at the prestigious International Chopin Piano Competition. The competition, known for discovering and nurturing classical music's brightest young talents, has once again highlighted the incredible potential of the next generation of classical musicians."
    }
  ],
  electronic: [
    { 
      id: 1, 
      title: "Daft Punk Hints at Possible Reunion", 
      image: "",
      content: "Electronic music fans are buzzing with excitement as Daft Punk seemingly teases a potential reunion. The legendary electronic duo, known for their groundbreaking music and iconic performances, has been silent for years, making this hint of a comeback a major event in the electronic music world. Fans are eagerly awaiting more details."
    },
    { 
      id: 2, 
      title: "Massive Electronic Music Festival Tomorrowland Goes Virtual", 
      image: "",
      content: "In a groundbreaking move, the world-famous Tomorrowland Electronic Music Festival has announced a fully virtual edition. This innovative approach brings the festival's incredible energy and top-tier electronic music to a global audience, breaking down geographical barriers and creating a unique digital music experience."
    },
    { 
      id: 3, 
      title: "Aphex Twin Releases Surprise Album of Unreleased Tracks", 
      image: "",
      content: "Electronic music innovator Aphex Twin has surprised fans with a new album featuring previously unreleased tracks. Known for his experimental and groundbreaking approach to electronic music, this release promises to be another milestone in the artist's influential career. Fans and critics alike are eager to dive into these newly unveiled musical gems."
    }
  ],
  country: [
    { 
      id: 1, 
      title: "Dolly Parton Inducted into Rock & Roll Hall of Fame", 
      image: "",
      content: "Country music icon Dolly Parton has been inducted into the Rock & Roll Hall of Fame, cementing her status as a musical legend that transcends genre boundaries. The ceremony celebrated her incredible career, musical innovation, and cultural impact. Parton continues to be a beloved figure in the music world and beyond."
    },
    { 
      id: 2, 
      title: "CMA Awards Announce This Year's Nominees", 
      image: "",
      content: "The Country Music Association has revealed the nominees for this year's CMA Awards, highlighting the best and brightest in country music. The list includes both established stars and emerging talents, showcasing the diversity and vibrant nature of contemporary country music. Music fans are eagerly anticipating the star-studded awards ceremony."
    },
    { 
      id: 3, 
      title: "Rising Country Star Makes Grand Ole Opry Debut", 
      image: "",
      content: "A promising new country music artist has made their debut at the legendary Grand Ole Opry, a milestone moment in any country musician's career. The performance showcased the artist's talent and potential, continuing the Opry's tradition of introducing and celebrating the next generation of country music stars."
    }
  ],
  reggae: [
    { 
      id: 1, 
      title: "Bob Marley's 'One Love' Named Song of the Century", 
      image: "",
      content: "In a landmark recognition, Bob Marley's iconic song 'One Love' has been named the Song of the Century. This powerful acknowledgment celebrates the enduring message of unity and peace embodied in Marley's music. The designation highlights the profound cultural and musical impact of reggae on a global scale."
    },
    { 
      id: 2, 
      title: "Reggae Sunsplash Festival Makes Comeback After 14 Years", 
      image: "",
      content: "The legendary Reggae Sunsplash Festival is making a triumphant return after a 14-year hiatus. This iconic event, which has been crucial in promoting reggae music worldwide, promises to bring together the best talents in the genre. Fans are excited to experience the vibrant culture and music that Reggae Sunsplash represents."
    },
    { 
      id: 3, 
      title: "Jamaican Government Declares Reggae Month", 
      image: "",
      content: "In a significant cultural recognition, the Jamaican government has officially declared a month-long celebration of reggae music. This declaration highlights the genre's importance to Jamaican culture and its global influence. The celebration will feature concerts, exhibitions, and events honoring reggae's rich history and ongoing legacy."
    }
  ],
  pop: [
    { 
      id: 1, 
      title: "Beyoncé Breaks Grammy Record with Most Wins", 
      image: "",
      content: "Pop icon Beyoncé has made history by breaking the record for the most Grammy Awards ever won by a single artist. This incredible achievement underscores her unparalleled impact on the music industry and her continued artistic excellence. Fans and music critics alike are celebrating this momentous milestone."
    },
    { 
      id: 2, 
      title: "Taylor Swift Announces Re-Recorded Album Release Date", 
      image: "",
      content: "Taylor Swift has announced the release date for her highly anticipated re-recorded album, continuing her mission to reclaim ownership of her musical catalog. Fans are excited to hear these new versions of beloved songs, which promise to bring fresh perspectives to Swift's earlier work. The announcement has generated massive buzz in the music world."
    }
  ],
  "hip hop": [
    { 
      id: 1, 
      title: "Kendrick Lamar Announces New Album", 
      image: "",
      content: "Critically acclaimed rapper Kendrick Lamar has announced his upcoming album, sending waves of excitement through the hip hop community. Known for his profound lyrical depth and innovative musical approach, Lamar's new release is highly anticipated by fans and music critics alike. The announcement promises another groundbreaking addition to his legendary discography."
    },
    { 
      id: 2, 
      title: "Hip Hop Hall of Fame Museum to Open in Harlem", 
      image: "",
      content: "A landmark moment for hip hop culture: a dedicated Hall of Fame Museum is set to open in Harlem, the birthplace of hip hop. This museum will celebrate the genre's rich history, cultural significance, and influential artists. It promises to be a crucial institution for preserving and honoring hip hop's incredible legacy."
    },
    { 
      id: 3, 
      title: "Drake Breaks Streaming Record with Latest Release", 
      image: "",
      content: "Drake has once again made music industry history by breaking streaming records with his latest release. The artist continues to demonstrate his dominance in the pop and hip hop landscape, showcasing his ability to consistently capture global audience attention. This achievement further cements Drake's status as a major force in contemporary music."
    }
  ]
};

const NewsDetailPage = () => {
  const navigate = useNavigate();
  const { genre, newsId } = useParams();
  const newsItem = newsData[genre]?.find(item => item.id === parseInt(newsId));
  const normalizedGenre = genre.toLowerCase();

  if (!newsItem) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">News Article Not Found</h1>
        <Link to={`/genre/${normalizedGenre}`} className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2" size={20} /> Back to {genre} Page
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Link to={`/genre/${normalizedGenre}`} className="flex items-center mb-4 text-blue-600 hover:text-blue-800">
      <motion.button
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-black"
        onClick={() => navigate('/admin/orders')}
      >
        <ArrowLeft size={20} />
        <span>Back to Orders</span>
      </motion.button>
      </Link>

      <article>
        <h1 className="text-4xl font-bold mb-6 bg-black text-white p-4">{newsItem.title}</h1>
        
        {newsItem.image && (
          <div className="mb-6 border-4 border-black">
            <img 
              src={newsItem.image} 
              alt={newsItem.title} 
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg bg-gray-100 p-6 border-4 border-black">
          <p className="text-lg leading-relaxed">{newsItem.content}</p>
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage;