import React, { useEffect } from 'react';
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
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    return () => {
      document.body.removeChild(canvas);
    };
  }, []);

  const handleReveal = async () => {
    try {
      // Check for vibration support and try to vibrate
      if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
        try {
          if ('permissions' in navigator) {
            const permission = await navigator.permissions.query({ name: 'vibrate' as PermissionName });
            if (permission.state === 'granted') {
              navigator.vibrate([100, 50, 100]);
            }
          } else {
            navigator;
          }
        } catch (e) {
          console.log('Vibration failed:', e);
        }
      }

      // Simpler confetti configuration
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#DDA0DD'],
        zIndex: 9999,
        disableForReducedMotion: true,
        scalar: 2,
        startVelocity: 20,
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
