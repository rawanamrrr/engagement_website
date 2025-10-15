"use client"

import { useEffect, useRef, useState } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(true)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if iOS
    const userAgent = window.navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) || 
                       (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);
  }, []);

  const handlePlay = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();
      setIsPlaying(true);
      setShowPlayButton(false);
    } catch (error) {
      console.error("Error playing video:", error);
      setShowPlayButton(true);
    }
  };

  // Handle the case where autoplay might work
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isIOS) return;

    const tryAutoplay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
        setShowPlayButton(false);
      } catch (err) {
        console.log("Autoplay prevented, showing play button");
        setShowPlayButton(true);
      }
    };

    tryAutoplay();
  }, [isIOS]);

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      onClick={() => {
        if (!isPlaying) {
          handlePlay();
        } else {
          onComplete();
        }
      }}
    >
      <video 
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline 
        muted 
        autoPlay
        preload="auto"
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="true"
        x5-video-orientation="portrait"
        onEnded={onComplete}
      >
        <source src="/engagement-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Play button overlay */}
      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <button 
            className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            aria-label="Play video"
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            <svg 
              className="w-16 h-16 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
