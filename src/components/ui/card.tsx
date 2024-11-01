export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`bg-neutral-800 rounded-lg overflow-hidden ${className || ''}`}>
      {children}
    </div>
  );
} 