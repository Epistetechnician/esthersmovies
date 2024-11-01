import React, { useEffect, useRef, useState } from 'react';
import { Card } from './ui/card';

interface Point {
  x: number;
  y: number;
}

interface ScratchCardProps {
  width?: number;
  height?: number;
  coverColor?: string;
  revealThreshold?: number;
  onReveal?: () => void;
  children: React.ReactNode;
}

export const ScratchCard = ({
  width = 300,
  height = 300,
  coverColor = '#888888',
  revealThreshold = 50,
  onReveal,
  children
}: ScratchCardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize the scratch-off layer
    ctx.fillStyle = coverColor;
    ctx.fillRect(0, 0, width, height);
  }, [width, height, coverColor]);

  const getMousePos = (e: MouseEvent | TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const distanceBetween = (point1: Point, point2: Point): number => {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
  };

  const angleBetween = (point1: Point, point2: Point): number => {
    return Math.atan2(point2.x - point1.x, point2.y - point1.y);
  };

  const getRevealedPercentage = (): number => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return 0;

    const imageData = ctx.getImageData(0, 0, width, height);
    const pixels = imageData.data;
    let transparentPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) {
        transparentPixels++;
      }
    }

    return (transparentPixels / (pixels.length / 4)) * 100;
  };

  const handleScratch = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas || !lastPoint) return;

    const currentPoint = getMousePos(e);
    const distance = distanceBetween(lastPoint, currentPoint);
    const angle = angleBetween(lastPoint, currentPoint);

    for (let i = 0; i < distance; i += 1) {
      const x = lastPoint.x + (Math.sin(angle) * i);
      const y = lastPoint.y + (Math.cos(angle) * i);
      
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2, false);
      ctx.fill();
    }

    setLastPoint(currentPoint);

    const revealedPercentage = getRevealedPercentage();
    if (revealedPercentage > revealThreshold && !isRevealed) {
      setIsRevealed(true);
      onReveal?.();
    }
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setLastPoint(getMousePos(e.nativeEvent));
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  return (
    <Card className="inline-block">
      <div
        ref={containerRef}
        className="relative select-none"
        style={{ width, height }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
        {!isRevealed && (
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="absolute top-0 left-0 touch-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={(e) => handleScratch(e.nativeEvent)}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={(e) => handleScratch(e.nativeEvent)}
          />
        )}
      </div>
    </Card>
  );
};