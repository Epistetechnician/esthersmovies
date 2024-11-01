import React from 'react';
import type { Movie } from '../data/movies';
import { motion } from 'framer-motion';
import { ScratchCard } from './scratchoff';

interface MovieCardProps {
  movie: Movie;
  isScratched: boolean;
  onScratch: (id: number) => void;
}

export function MovieCard({ movie, isScratched, onScratch }: MovieCardProps) {
  return (
    <div className="flex flex-col items-center">
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
            onReveal={() => onScratch(movie.id)}
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