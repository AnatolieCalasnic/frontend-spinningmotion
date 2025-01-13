import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const MusicPlayer = () => {
  // Create state for playback control
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);

  // Handle play/pause toggles - this function manages both the audio playback
  // and the visual state of the play button
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // We use void to handle the promise returned by play()
        void audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume changes - this function updates both the visual slider
  // and the actual audio volume
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="bg-accent flex flex-col rounded-lg border-2 border-red-600 shadow-lg max-w-sm">
      {/* Album Art and Play Button Container */}
      <div className="relative">
        <img
          src="/api/placeholder/200/200"
          alt="Blade Runner Vibe"
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {/* Centered play/pause button with hover effects */}
        <button
          onClick={togglePlay}
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-white rounded-full p-4 shadow-lg hover:bg-gray-100 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-red-600"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-red-600" />
          ) : (
            <Play className="h-8 w-8 text-red-600" />
          )}
        </button>
      </div>

      {/* Track Information and Controls */}
      <div className="p-4 bg-white rounded-b-lg">
        <h3 className="text-lg font-bold mb-2">Blade Runner Vibe</h3>
        <p className="text-gray-600 mb-4">MADE BY ME ! ! ! ("ALL RIGHTS ARE PRESERVED")</p>

        {/* Volume Control with aria-labels for accessibility */}
        <div className="flex items-center space-x-2">
          <Volume2 className="h-5 w-5 text-gray-600" aria-hidden="true" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                     hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-red-600"
            aria-label="Volume Control"
          />
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