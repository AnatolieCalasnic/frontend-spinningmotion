import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  // play/pause toggles - this function manages both the audio playback
  // and the visual state of the play button
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // using void to handle the promise returned by play()
        void audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // volume changes - this function updates both the visual slider
  // and the actual audio volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="col-span-12 bg-red-600 p-6">
      <div className="flex items-center mb-4">
        <div className="w-32 h-32 bg-white rounded-full flex-shrink-0 flex items-center justify-center mr-6">
          <button 
            onClick={togglePlay} 
            className="text-red-600"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? 
              <Pause className="h-12 w-12" /> : 
              <Play className="h-12 w-12" />
            }
          </button>
        </div>
        <div>
          <h2 className="text-white text-3xl font-bold mb-2">FEATURED ALBUM</h2>
          <p className="text-white">Experience our top pick of the week</p>
        </div>
      </div>


      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Blade Runner Vibe</h3>
            <p className="text-red-600 font-medium tracking-wide">MADE BY ME ! ! !</p>
          </div>
          <span className="text-xs text-gray-500 italic">ALL RIGHTS RESERVED</span>
        </div>

        {/* Volume Control with Enhanced Styling */}
        <div className="flex items-center space-x-4 mt-6">
          <Volume2 
            className="h-6 w-6 text-gray-600 transition-colors duration-300 hover:text-red-600" 
            aria-hidden="true" 
          />
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gradient-to-r from-red-200 to-red-400 rounded-lg appearance-none cursor-pointer
                       hover:from-red-300 hover:to-red-500 transition-all duration-300
                       focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              aria-label="Volume Control"
            />
            <div 
              className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500"
            >
              {Math.round(volume * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/Copy_Blade Runner_Vibe.mp3"
        loop
      />
    </div>
  );
};

export default MusicPlayer;