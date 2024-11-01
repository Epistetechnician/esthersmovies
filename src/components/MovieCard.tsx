import React from 'react';
import type { Movie } from '../data/movies';
import { motion } from 'framer-motion';
import { ScratchCard } from './scratchoff';
import confetti from 'canvas-confetti';

interface MovieCardProps {
  movie: Movie;
  isScratched: boolean;
  onScratch: (id: number) => void;
}

export function MovieCard({ movie, isScratched, onScratch }: MovieCardProps) {
  const handleReveal = async () => {
    try {
      // Try vibration first
      if ('vibrate' in navigator && navigator.vibrate) {
        console.log('Attempting vibration...');
        await navigator.vibrate(200); // Increased duration for better feedback
      } else {
        console.log('Vibration API not supported');
      }

      // Try confetti with mobile-optimized settings
      console.log('Attempting confetti...');
      confetti({
        particleCount: 50, // Reduced for better mobile performance
        spread: 70,
        origin: { 
          x: 0.5,
          y: 0.6 
        },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#DDA0DD'],
        zIndex: 9999, // Increased to ensure visibility
        disableForReducedMotion: true,
        scalar: 1.5, // Increased size for better visibility on mobile
        gravity: 1.5, // Increased gravity for faster animation
        startVelocity: 20, // Reduced for better mobile performance
        ticks: 150 // Reduced duration for mobile
      });
    } catch (error) {
      console.error('Error in handleReveal:', error);
    }
    
    onScratch(movie.id);
  };

  return (
    <div 
      className="movie-card"
      role="button"
      tabIndex={0}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full aspect-square"
      >
        {!isScratched ? (
          <ScratchCard
            width={150}
            height={150}
            coverColor="#1f1f1f"
            revealThreshold={50}
            onReveal={handleReveal}
          >
            <div 
              className="w-full h-full relative"
              style={{
                backgroundImage: `url(${movie.posterUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl filter drop-shadow-lg">{movie.icon}</span>
              </div>
            </div>
          </ScratchCard>
        ) : (
          <div 
            className="w-full h-full relative rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(${movie.posterUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl filter drop-shadow-lg">{movie.icon}</span>
            </div>
          </div>
        )}
      </motion.div>

      <h3 className="mt-1 text-xs sm:text-sm text-center text-neutral-400 line-clamp-2 px-1">
        {movie.title}
      </h3>
    </div>
  );
}