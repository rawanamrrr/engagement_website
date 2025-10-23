"use client"

import { useEffect, useState } from "react"

interface VideoIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export default function VideoIntro({ onComplete, onSkip }: VideoIntroProps) {
  const [gifLoaded, setGifLoaded] = useState(false);

  // Auto-complete after GIF duration (adjust timing as needed)
  useEffect(() => {
    if (!gifLoaded) return;
    
    // Set timeout to match your GIF duration
    const timer = setTimeout(() => {
      onComplete();
    }, 15000); // Adjust this duration to match your GIF length in milliseconds

    return () => clearTimeout(timer);
  }, [gifLoaded, onComplete]);

  return (
    <div 
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      onClick={onComplete}
    >
      <img 
        src="/engagement-video.gif"
        alt="Engagement intro"
        className="w-full h-full object-contain"
        onLoad={() => setGifLoaded(true)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: 'black'
        }}
      />
    </div>
  );
}
