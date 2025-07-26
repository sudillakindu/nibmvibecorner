import React, { useEffect, useState, useRef } from 'react';
import { VolumeXIcon, Volume2Icon } from 'lucide-react';

export const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://song.sgp1.digitaloceanspaces.com/song/5a7c54a3-1801-4f3a-b6be-94931780f1bc.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 1;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      onClick={toggleMusic} 
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 backdrop-blur-md shadow-lg rounded-full p-3 md:p-4 transition-all transform hover:scale-110 border ${
        isPlaying 
          ? 'bg-chocolate-700/80 border-chocolate-600 shadow-glow-brown' 
          : 'bg-white/80 dark:bg-charcoal-800/80 border-cream-500 dark:border-charcoal-700'
      }`} 
      aria-label={isPlaying ? 'Mute background music' : 'Unmute background music'} 
      title={isPlaying ? 'Mute background music' : 'Unmute background music'}
    >
      {isPlaying ? (
        <Volume2Icon className="w-5 h-5 md:w-6 md:h-6 text-mustard-500 animate-pulse" />
      ) : (
        <VolumeXIcon className="w-5 h-5 md:w-6 md:h-6 text-charcoal-500 dark:text-cream-500" />
      )}
    </button>
  );
};