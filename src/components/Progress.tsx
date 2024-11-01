import React from 'react';
import { Film, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProgressProps {
  total: number;
  watched: number;
}

export function Progress({ total, watched }: ProgressProps) {
  const percentage = (watched / total) * 100;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-white/5"
    >
      {percentage === 100 ? (
        <Trophy className="text-amber-400" size={28} />
      ) : (
        <Film className="text-white/80" size={28} />
      )}
      
      <div className="flex-1">
        <div className="h-3 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-amber-500 to-amber-400"
          />
        </div>
        <div className="mt-2 flex justify-between items-center">
          <div className="text-sm text-white/80">
            {watched} of {total} movies watched
          </div>
          <div className="text-sm font-medium text-amber-400">
            {percentage.toFixed(0)}%
          </div>
        </div>
      </div>
    </motion.div>
  );
}