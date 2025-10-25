'use client';

import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/translations';

export function RomanticAudio() {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wasPlayingRef = useRef(false); // Track if music was playing before tab switch
  const t = useTranslation();

  // Handle first user interaction to start audio
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleFirstInteraction = async () => {
      if (audioRef.current && !isPlaying) {
        try {
          audioRef.current.muted = false;
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.log('Autoplay prevented, waiting for user interaction');
        }
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    // Add event listeners for first user interaction
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [isPlaying]);

  // Initialize audio settings
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // Set initial volume and mute state
    audio.volume = 0.25;
    audio.muted = isMuted;

    // Wait for audio to be ready before attempting to play
    const handleCanPlay = () => {
      // Try to play automatically (works on some browsers)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            wasPlayingRef.current = true;
          })
          .catch(() => console.log('Autoplay prevented'));
      }
    };

    // Add event listener for when audio is ready
    audio.addEventListener('canplay', handleCanPlay, { once: true });

    // If audio is already ready, trigger immediately
    if (audio.readyState >= 3) {
      handleCanPlay();
    }

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      if (audio && !audio.paused) {
        audio.pause();
      }
    };
  }, []);

  // Handle mute state changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.muted = isMuted;
  }, [isMuted]);

  // Pause music when user leaves the browser/tab
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (!audioRef.current) return;

      try {
        if (document.hidden) {
          // User left the tab/browser - save playing state and pause
          const isCurrentlyPlaying = !audioRef.current.paused && !isMuted;
          wasPlayingRef.current = isCurrentlyPlaying;
          
          if (isCurrentlyPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
        } else {
          // User returned to the tab - resume only if it was playing before
          if (wasPlayingRef.current && !isMuted && audioRef.current.paused) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch((err) => {
                  console.log('Failed to resume audio:', err);
                  wasPlayingRef.current = false;
                });
            }
          }
        }
      } catch (error) {
        console.error('Error in visibility change handler:', error);
      }
    };

    // Also handle blur/focus events as backup
    const handleBlur = () => {
      if (!audioRef.current) return;
      
      try {
        const isCurrentlyPlaying = !audioRef.current.paused && !isMuted;
        wasPlayingRef.current = isCurrentlyPlaying;
        
        if (isCurrentlyPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error in blur handler:', error);
      }
    };

    const handleFocus = () => {
      if (!audioRef.current) return;
      
      try {
        if (wasPlayingRef.current && !isMuted && audioRef.current.paused) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => setIsPlaying(true))
              .catch((err) => {
                console.log('Failed to resume audio:', err);
                wasPlayingRef.current = false;
              });
          }
        }
      } catch (error) {
        console.error('Error in focus handler:', error);
      }
    };

    // Add event listeners with proper error handling
    try {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('blur', handleBlur);
      window.addEventListener('focus', handleFocus);
    } catch (error) {
      console.error('Error adding event listeners:', error);
    }

    return () => {
      try {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('blur', handleBlur);
        window.removeEventListener('focus', handleFocus);
      } catch (error) {
        console.error('Error removing event listeners:', error);
      }
    };
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="
          rounded-full w-12 h-12 
          bg-pink-100 hover:bg-pink-200 
          active:bg-pink-300
          transition-all duration-200 
          flex items-center justify-center
          shadow-md
          text-pink-700
        "
        aria-label={isMuted ? t('unmuteMusic') : t('muteMusic')}
        title={isMuted ? t('unmuteMusic') : t('muteMusic')}
      >
        {isMuted ? (
          <VolumeX className="h-6 w-6" aria-hidden="true" />
        ) : (
          <Volume2 className="h-6 w-6" aria-hidden="true" />
        )}
      </Button>
      
      <audio
        ref={audioRef}
        loop
        playsInline
        preload="auto"
        className="hidden"
      >
        <source src="/romantic-piano.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}