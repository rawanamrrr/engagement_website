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

// Alternating entrance variants
const slideFromLeft: Variants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  }
}

const slideFromRight: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
  }
}

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.15 }
  }
}

interface ProAnimatedEngagementPageProps {
  onImageLoad?: () => void;
  playGifTrigger?: boolean;
}

export default function ProAnimatedEngagementPage({ onImageLoad, playGifTrigger }: ProAnimatedEngagementPageProps) {
  const t = useTranslation()
  const { language } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [gifHasPlayed, setGifHasPlayed] = useState(false)
  const [gifPreloaded, setGifPreloaded] = useState(false)
  const gifRef = useRef<HTMLImageElement>(null)
  const gifTimerRef = useRef<NodeJS.Timeout | null>(null)
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

  // On mount: preload both static image AND GIF for instant display
  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      // Preload static PNG
      const staticImg = new window.Image();
      staticImg.src = "/invitation-design.png";

      // Aggressively preload GIF to avoid lag
      const gifImg = new window.Image();
      gifImg.src = "/invitation-design.gif";
      gifImg.onload = () => {
        console.log('✅ GIF preloaded and cached');
        setGifPreloaded(true);
      };
      gifImg.onerror = () => {
        console.log('⚠️ GIF preload failed, will use static image');
        setGifHasPlayed(true); // Skip GIF if it fails to preload
      };
    }

    // Cleanup timer on unmount
    return () => {
      if (gifTimerRef.current) {
        clearTimeout(gifTimerRef.current);
      }
    };
  }, []);

  // When intro finishes (skipped or completed), show the GIF once and set timer
  useEffect(() => {
    if (playGifTrigger && !gifHasPlayed) {
      console.log('🎬 Playing GIF - playGifTrigger:', playGifTrigger, 'gifHasPlayed:', gifHasPlayed);
      
      // Clear any existing timer
      if (gifTimerRef.current) {
        clearTimeout(gifTimerRef.current);
      }
      
      // Set timer to end GIF after duration
      const duration = 1000; // 1 second
      console.log('⏱️ GIF will play for', duration, 'ms');
      gifTimerRef.current = setTimeout(() => {
        console.log('⏹️ GIF finished, switching to static image');
        setGifHasPlayed(true);
        gifTimerRef.current = null;
      }, duration);
    }
  }, [playGifTrigger, gifHasPlayed]);

  const handleImageLoad = () => {
    setImageLoaded(true)
    onImageLoad?.()
  }

  const handleGifError = () => {
    console.log('❌ GIF error, switching to static image');
    setGifHasPlayed(true);
    if (gifTimerRef.current) {
      clearTimeout(gifTimerRef.current);
      gifTimerRef.current = null;
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        className="relative"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div 
          className="w-full relative z-10"
          variants={slideUp}
        >
          {/* Optimized Image with immediate loading */}
          <div className="relative w-full h-auto">
            {(() => {
              const shouldShowGif = playGifTrigger && !gifHasPlayed;
              console.log('🖼️ Rendering:', shouldShowGif ? 'GIF' : 'STATIC IMAGE');
              return shouldShowGif ? (
                <img
                  key="animated-gif"
                  ref={gifRef}
                  src="/invitation-design.gif"
                  alt="Zeyad & Rawan Engagement Invitation"
                  className="w-full h-auto rounded-lg shadow-2xl"
                  onLoad={() => {
                    console.log('✅ GIF loaded successfully');
                    handleImageLoad();
                  }}
                  onError={handleGifError}
                  style={{ display: 'block' }}
                  fetchPriority="high"
                  decoding="async"
                />
              ) : (
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
              );
            })()}
            
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
        
        {/* Scroll Down Indicator */}
        <motion.div
          className="absolute bottom-12 left-8 flex flex-col items-center gap-3 z-20"
          initial="hidden"
          animate="visible"
          variants={slideFromLeft}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <div className="bg-background/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-accent/30">
            <span className="text-base md:text-lg text-foreground font-medium tracking-wide">
              {language === 'ar' ? 'مرر للأسفل' : 'Scroll Down'}
            </span>
          </div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="bg-accent/90 p-2 rounded-full shadow-lg"
          >
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
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
        className="relative py-20 px-4 md:py-32 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          <motion.div 
            className="inline-flex flex-col items-center mb-16"
            variants={staggerContainer}
          >
            <motion.div className="flex items-center gap-4 mb-8" variants={slideFromLeft}>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            </motion.div>
            <motion.h2 className="font-luxury text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-6 tracking-wide" variants={slideFromRight}>
              {t('ourSpecialDay')}
            </motion.h2>
            <motion.p className="font-luxury text-xl md:text-2xl text-muted-foreground font-light max-w-3xl italic" variants={slideUp}>
              {t('countingMoments')}
            </motion.p>
          </motion.div>

          <motion.div variants={scaleIn}>
            <CountdownTimer targetDate={new Date("2025-11-07T19:00:00")} />
          </motion.div>
        </div>
      </motion.section>

      {/* Venue & RSVP Section */}
      <motion.section 
        className="relative py-20 px-4 md:py-32 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            variants={staggerContainer}
          >
            <motion.div className="flex items-center justify-center gap-4 mb-8" variants={slideFromLeft}>
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
              <div className="w-3 h-3 rotate-45 bg-accent" />
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />
            </motion.div>
            <motion.h2 className="font-luxury text-5xl md:text-6xl lg:text-7xl text-foreground leading-tight mb-4 tracking-wide" variants={slideFromRight}>
              {t('joinUsAt')}
            </motion.h2>
          </motion.div>

          <motion.div 
            className="max-w-3xl mx-auto space-y-8"
            variants={staggerContainer}
          >
            <div className="relative bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-md border-2 border-accent/20 rounded-3xl p-10 md:p-14 shadow-2xl overflow-hidden">
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-accent/30 rounded-tl-3xl" />
              <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-accent/30 rounded-br-3xl" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-6">
                  <svg className="w-12 h-12 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 className="font-elegant text-4xl md:text-5xl text-foreground mb-3 text-center tracking-wide">
                  {t('location').split(', ')[0]}
                </h3>
                <p className="font-luxury text-xl md:text-2xl text-muted-foreground mb-10 text-center italic">
                  {t('location').split(', ')[1]}
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-10 pb-10 border-t-2 border-b-2 border-accent/20">
                  <motion.div 
                    className="flex items-center gap-4 bg-accent/10 px-6 py-3 rounded-full"
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideFromLeft}
                  >
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-luxury text-lg text-foreground font-medium">{formattedDate}</span>
                  </motion.div>
                  <div className="hidden md:block w-px h-10 bg-accent/30" />
                  <motion.div 
                    className="flex items-center gap-4 bg-accent/10 px-6 py-3 rounded-full"
                    initial="hidden" whileInView="visible" viewport={{ once: true }} variants={slideFromRight}
                  >
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span className="font-luxury text-lg text-foreground font-medium">{formattedTime}</span>
                  </motion.div>
                </div>

                {/* Map integrated inside the card */}
                <motion.div
                  className="mt-10"
                  initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn}
                >
                  <VenueMap />
                </motion.div>
              </div>
            </div>
          </motion.div>
          
        </div>
      </motion.section>

      {/* Message Section */}
      <HandwrittenMessage />
      
      {/* Footer */}
      <motion.footer 
        className="relative py-24 text-center bg-gradient-to-t from-accent/10 to-transparent"
        variants={fadeIn}
      >
        <div className="max-w-3xl mx-auto px-4">
          <motion.p 
            className="font-luxury text-3xl md:text-4xl text-foreground mb-8 italic leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('footerMessage')}
          </motion.p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent to-accent" />
            <motion.span 
              className="text-3xl text-accent drop-shadow-lg"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              ♥
            </motion.span>
            <div className="w-24 h-px bg-gradient-to-l from-transparent via-accent to-accent" />
          </div>
          <div className="flex items-center justify-center gap-3 opacity-60">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
          </div>
        </div>
      </motion.footer>
    </div>
  )
}