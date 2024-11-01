import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';
import { movies } from './data/movies';
import { MovieCard } from './components/MovieCard';
import { Progress } from './components/Progress';

export default function App() {
  const [scratched, setScratched] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem('scratched-movies');
    if (saved) {
      setScratched(new Set(JSON.parse(saved)));
    }
    setMounted(true);
  }, []);

  const handleScratch = (id: number) => {
    const newScratched = new Set(scratched);
    if (scratched.has(id)) {
      newScratched.delete(id);
    } else {
      newScratched.add(id);
    }
    setScratched(newScratched);
    // Save to localStorage whenever state changes
    localStorage.setItem('scratched-movies', JSON.stringify([...newScratched]));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 px-4 pt-safe pb-safe">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Camera className="text-amber-400" size={28} />
            <h1 className="text-3xl font-bold text-white">
              Esther's 100 Movies Bucket List
            </h1>
          </div>
          <p className="text-neutral-400 text-sm">
            Scratch off the movies you've watched to reveal their iconic symbols
          </p>
        </motion.div>

        <div className="mb-8">
          <Progress total={movies.length} watched={scratched.size} />
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-3"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isScratched={scratched.has(movie.id)}
              onScratch={handleScratch}
            />
          ))}
        </motion.div>

        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 pb-8 text-center text-neutral-500 text-xs"
        >
          <p>Scratch on a tile to reveal the movie</p>
          <p className="mt-1 text-neutral-600">Your progress is automatically saved</p>
        </motion.footer>
      </div>
    </div>
  );
}