import React, { useEffect, useRef } from 'react';

interface RainCanvasProps {
  className?: string;
  opacity?: number;
  speedMultiplier?: number;
  enabled?: boolean;
}

export const RainCanvas: React.FC<RainCanvasProps> = ({
  className = '',
  opacity = 0.5,
  speedMultiplier = 1,
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number | null = null;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Rain Droplets
    const dropsCount = Math.min(140, Math.max(60, Math.floor(width / 11)));
    const drops: Array<{
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      color: string;
      trailWidth: number;
    }> = [];

    const colors = [
      'rgba(235, 178, 255, ', // neon purple/pink tint
      'rgba(0, 251, 251, ',   // cyan/neon blue tint
      'rgba(255, 255, 255, ', // cool silver/white
    ];

    for (let i = 0; i < dropsCount; i++) {
      const colorBase = colors[Math.floor(Math.random() * colors.length)];
      drops.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 24 + 12,
        speed: (Math.random() * 6 + 5) * speedMultiplier,
        opacity: Math.random() * 0.45 + 0.15,
        color: colorBase,
        trailWidth: Math.random() * 1.2 + 0.6,
      });
    }

    // Glass streaks (condensation running slowly down the glass)
    const streaksCount = 10;
    const streaks: Array<{
      x: number;
      y: number;
      radius: number;
      speed: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < streaksCount; i++) {
      streaks.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 1,
        speed: Math.random() * 0.35 + 0.08,
        opacity: Math.random() * 0.25 + 0.1,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render rain streaks
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.2, d.y + d.length);
        ctx.strokeStyle = `${d.color}${d.opacity * opacity})`;
        ctx.lineWidth = d.trailWidth;
        ctx.lineCap = 'round';
        ctx.stroke();

        d.y += d.speed;
        d.x -= 0.6; // Slight wind slant

        if (d.y > height) {
          d.y = -d.length;
          d.x = Math.random() * (width + 60);
        }
        if (d.x < -20) {
          d.x = width + 10;
        }
      }

      // Render condensation droplets on glass
      for (let j = 0; j < streaks.length; j++) {
        const s = streaks[j];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(235, 178, 255, ${s.opacity * opacity * 0.5})`;
        ctx.fill();

        s.y += s.speed;
        if (s.y > height) {
          s.y = -5;
          s.x = Math.random() * width;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      ctx.clearRect(0, 0, width, height);
    };
  }, [opacity, speedMultiplier, enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden ${className}`}
    />
  );
};
