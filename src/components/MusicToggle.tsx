import React, { useEffect, useState, useRef } from 'react';
import { VolumeXIcon, Volume2Icon } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { database } from '../firebase/firebase';

export const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicUrl, setMusicUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchMusicUrl = async () => {
      try {
        const musicRef = ref(database, 'music/mp3');
        const snapshot = await get(musicRef);
        
        if (snapshot.exists()) {
          const url = snapshot.val();
          setMusicUrl(url);
          
          // Initialize audio with the fetched URL
          audioRef.current = new Audio(url);
          audioRef.current.loop = true;
          audioRef.current.volume = 0.5; // Set volume to 50%
        } else {
          console.log('No music URL found in database');
        }
      } catch (error) {
        console.error('Error fetching music URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMusicUrl();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current || isLoading || !musicUrl) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(error => {
        console.error('Audio playback failed:', error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  // Don't render button if music is not available
  if (!musicUrl && !isLoading) {
    return null;
  }

  return (
    <button 
      onClick={toggleMusic} 
      disabled={isLoading || !musicUrl}
      className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 backdrop-blur-md shadow-lg rounded-full p-3 md:p-4 transition-all transform hover:scale-110 border ${
        isLoading 
          ? 'bg-gray-400/80 border-gray-500 cursor-not-allowed' 
          : isPlaying 
            ? 'bg-chocolate-700/80 border-chocolate-600 shadow-glow-brown' 
            : 'bg-white/80 dark:bg-charcoal-800/80 border-cream-500 dark:border-charcoal-700'
      }`} 
      aria-label={isLoading ? 'Loading music...' : isPlaying ? 'Mute background music' : 'Unmute background music'} 
      title={isLoading ? 'Loading music...' : isPlaying ? 'Mute background music' : 'Unmute background music'}
    >
      {isLoading ? (
        <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <Volume2Icon className="w-5 h-5 md:w-6 md:h-6 text-mustard-500 animate-pulse" />
      ) : (
        <VolumeXIcon className="w-5 h-5 md:w-6 md:h-6 text-charcoal-500 dark:text-cream-500" />
      )}
    </button>
  );
};