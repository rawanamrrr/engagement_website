"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import CountdownTimer from "@/components/countdown-timer"
import VenueMap from "@/components/venue-map"
import Image from "next/image"
import HandwrittenMessage from "@/components/handwritten-message"
import { Variants } from "framer-motion"
import { useTranslation } from "@/lib/translations"
import { useLanguage } from "@/contexts/LanguageContext"
import { Button } from "@/components/ui/button"

// Format date in Arabic or English
const formatDate = (date: Date, locale: string) => {
  return date.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Format time in Arabic or English
const formatTime = (date: Date, locale: string) => {
  return date.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

// Professional animation variants
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

const slideUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

const scaleIn: Variants = {
  hidden: { scale: 0.98, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1] as const
    }
  }
}

interface ProAnimatedEngagementPageProps {
  onImageLoad?: () => void;
}

export default function ProAnimatedEngagementPage({ onImageLoad }: ProAnimatedEngagementPageProps) {
  const t = useTranslation()
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [gifHasPlayed, setGifHasPlayed] = useState(false)
  const gifRef = useRef<HTMLImageElement>(null)
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05])
  
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.1], [0, -20])
  
  // Animation values for the path
  const pathLength = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const pathY1 = useTransform(scrollYProgress, [0, 0.5], [0, 20])
  const pathY2 = useTransform(scrollYProgress, [0, 0.5], [0, 40])
  
  const eventDate = new Date("2025-11-07T19:00:00");
  const formattedDate = formatDate(eventDate, language);
  const formattedTime = formatTime(eventDate, language);

  // Check if we've already shown the GIF in this session
  useEffect(() => {
    setMounted(true);
    
    // Check if we've already shown the GIF
    const hasShownGif = typeof window !== 'undefined' && localStorage.getItem('gifHasPlayed') === 'true';
    if (hasShownGif) {
      setGifHasPlayed(true);
    }
    
    // Preload the static image
    if (typeof window !== 'undefined') {
      const img = new window.Image();
      img.src = "/invitation-design.png";
    }
  }, []);

  // Handle GIF end
  const handleGifEnd = () => {
    setGifHasPlayed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gifHasPlayed', 'true');
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true)
    onImageLoad?.()
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative flex items-center justify-center px-4 py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.div 
          className="w-full max-w-2xl mx-auto relative z-10"
          variants={scaleIn}
        >
          {/* Optimized Image with immediate loading */}
          <div className="relative w-full h-auto">
            {gifHasPlayed ? (
              <Image
                key="static-image"
                src="/invitation-design.png"
                alt="Zeyad & Rawan Engagement Invitation"
                width={768}
                height={1365}
                className="w-full h-auto rounded-lg shadow-2xl"
                priority
                loading="eager"
                quality={80}
                onLoad={handleImageLoad}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, (max-width: 1200px) 80vw, 70vw"
              />
            ) : (
              <img
                key="animated-gif"
                ref={gifRef}
                src="/invitation-design.gif"
                alt="Zeyad & Rawan Engagement Invitation"
                className="w-full h-auto rounded-lg shadow-2xl"
                onLoad={() => {
                  handleImageLoad();
                  // Force the GIF to play only once by reloading it after a short delay
                  // This ensures it doesn't loop on desktop
                  const gif = gifRef.current;
                  if (gif) {
                    const originalSrc = gif.src;
                    const duration = 5000; // Adjust this to match your GIF's duration
                    
                    // Set a timeout to switch to the static image after the GIF finishes playing
                    const timer = setTimeout(() => {
                      handleGifEnd();
                    }, duration);

                    // Cleanup function to clear the timer if component unmounts
                    return () => clearTimeout(timer);
                  }
                }}
                onError={handleGifEnd}
                style={{ display: 'block' }}
              />
            )}
            
            {/* Minimal loading state */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-muted-foreground">{t('loading')}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Subtle parallax background elements */}
        <motion.div 
          className="absolute -left-20 top-1/4 w-64 h-64 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl"
          style={{ y: pathY1 }}
        />
        <motion.div 
          className="absolute -right-20 bottom-1/4 w-72 h-72 bg-accent/5 rounded-full mix-blend-multiply filter blur-3xl"
          style={{ y: pathY2 }}
        />
      </motion.section>

      {/* Countdown Section */}
      <motion.section 
        className="relative py-16 px-4 md:py-24 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div 
            className="inline-flex flex-col items-center mb-12"
            variants={slideUp}
          >
            <div className="w-16 h-px bg-accent/30 mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
              {t('ourSpecialDay')}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl">
              {t('countingMoments')}
            </p>
          </motion.div>

          <motion.div variants={scaleIn}>
            <CountdownTimer targetDate={new Date("2025-11-07T19:00:00")} />
          </motion.div>
        </div>
      </motion.section>

      {/* Venue & RSVP Section */}
      <motion.section 
        className="relative py-16 px-4 md:py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeIn}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            variants={slideUp}
          >
            <div className="w-16 h-px bg-accent/30 mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
              {t('joinUsAt')}
            </h2>
          </motion.div>

          <motion.div 
            className="max-w-2xl mx-auto space-y-8"
            variants={scaleIn}
          >
            <div className="bg-card/50 backdrop-blur-sm border border-accent/10 rounded-2xl p-8 md:p-10 shadow-lg">
              <h3 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
                {t('location').split(', ')[0]}
              </h3>
              <p className="text-xl text-muted-foreground mb-8">
                {t('location').split(', ')[1]}
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-8 border-t border-accent/10">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-foreground">{formattedDate}</span>
                </div>
                <div className="hidden md:block w-px h-6 bg-accent/20" />
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-foreground">{formattedTime}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-16"
            variants={slideUp}
          >
            <VenueMap />
          </motion.div>
          
        </div>
      </motion.section>

      {/* Message Section */}
      <HandwrittenMessage />
      
      {/* Footer */}
      <motion.footer 
        className="relative py-16 text-center"
        variants={fadeIn}
      >
        <div className="max-w-2xl mx-auto px-4">
          <motion.p 
            className="font-serif text-2xl md:text-3xl text-foreground mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('footerMessage')}
          </motion.p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-px bg-accent/30" />
            <motion.span 
              className="text-xl text-accent"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              ♥
            </motion.span>
            <div className="w-12 h-px bg-accent/30" />
          </div>
        </div>
      </motion.footer>
    </div>
  )
}