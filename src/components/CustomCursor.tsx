import React, { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  time: number;
  maxAge: number;
  speed: number;
}

interface SparkleParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  type: 'star' | 'dot' | 'micro';
}

export const CustomCursor: React.FC = () => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(pointer: coarse)').matches ||
      ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches)
    );
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Check if touch / mobile device
    const checkTouch = () => {
      const isTouch =
        window.matchMedia('(pointer: coarse)').matches ||
        ('ontouchstart' in window && !window.matchMedia('(pointer: fine)').matches);
      setIsTouchDevice(isTouch);
    };

    checkTouch();
    window.addEventListener('resize', checkTouch);

    if (isTouchDevice) {
      return () => window.removeEventListener('resize', checkTouch);
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number | null = null;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Cursor state
    const cursor = {
      x: -200,
      y: -200,
      targetX: -200,
      targetY: -200,
      lastX: -200,
      lastY: -200,
      speed: 0,
      isHovering: false,
      isClicking: false,
      isVisible: false,
      ringX: -200,
      ringY: -200,
      ringScale: 1,
      ringTargetScale: 1,
    };

    const trailPoints: TrailPoint[] = [];
    const particles: SparkleParticle[] = [];
    let lastSparkleTime = 0;

    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (!cursor.isVisible) {
        cursor.isVisible = true;
        cursor.x = currentX;
        cursor.y = currentY;
        cursor.ringX = currentX;
        cursor.ringY = currentY;
        cursor.lastX = currentX;
        cursor.lastY = currentY;
      }

      cursor.targetX = currentX;
      cursor.targetY = currentY;

      const dx = currentX - cursor.lastX;
      const dy = currentY - cursor.lastY;
      const dist = Math.hypot(dx, dy);
      cursor.speed = dist;

      // Dynamic trail lifetime based on cursor speed (longer and more luminous during fast sweeps)
      const baseLifetime = cursor.isHovering ? 320 : 260;
      const dynamicLifetime = Math.min(480, baseLifetime + cursor.speed * 4.5);

      // Smooth point interpolation so there are never jagged segments during rapid flicks
      if (dist > 3) {
        const steps = Math.min(Math.floor(dist / 3), 8);
        for (let i = 1; i <= steps; i++) {
          const ratio = i / (steps + 1);
          trailPoints.push({
            x: cursor.lastX + dx * ratio,
            y: cursor.lastY + dy * ratio,
            time: now - (steps - i) * 2,
            maxAge: dynamicLifetime,
            speed: cursor.speed,
          });
        }
      }

      trailPoints.push({
        x: currentX,
        y: currentY,
        time: now,
        maxAge: dynamicLifetime,
        speed: cursor.speed,
      });

      // Spawn soft sparkling stars and neon micro-dots (✦ • · · ·) along the trail
      if (now - lastSparkleTime > 35 && dist > 2) {
        lastSparkleTime = now;
        const particleType = Math.random() < 0.28 ? 'star' : Math.random() < 0.65 ? 'dot' : 'micro';
        const angle = Math.random() * Math.PI * 2;
        const pSpeed = Math.random() * 0.4 + 0.1;
        const offsetDist = Math.random() * 4;

        particles.push({
          x: currentX + Math.cos(angle) * offsetDist,
          y: currentY + Math.sin(angle) * offsetDist,
          vx: (Math.random() - 0.5) * pSpeed,
          vy: (Math.random() - 0.5) * pSpeed,
          size: particleType === 'star' ? Math.random() * 2.5 + 2.5 : particleType === 'dot' ? Math.random() * 1.8 + 1.2 : Math.random() * 1.0 + 0.6,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 260 + 200,
          type: particleType,
        });
      }

      cursor.lastX = currentX;
      cursor.lastY = currentY;

      // Keep arrays strictly bounded for constant memory & 60fps
      if (trailPoints.length > 90) {
        trailPoints.splice(0, trailPoints.length - 90);
      }
      if (particles.length > 45) {
        particles.splice(0, particles.length - 45);
      }

      // Check hover on interactive elements across all pages
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest(
          'button, a, input, select, textarea, [role="button"], .cursor-pointer, .glass-card, .clickable, [data-interactive="true"]'
        );
        const hovering = !!interactive;
        cursor.isHovering = hovering;
        cursor.ringTargetScale = hovering ? 1.6 : 1;
      }
    };

    const onMouseDown = () => {
      cursor.isClicking = true;
      cursor.ringTargetScale = cursor.isHovering ? 1.2 : 0.75;
    };

    const onMouseUp = () => {
      cursor.isClicking = false;
      cursor.ringTargetScale = cursor.isHovering ? 1.6 : 1;
    };

    const onMouseLeave = () => {
      cursor.isVisible = false;
      trailPoints.length = 0;
      particles.length = 0;
    };

    const onMouseEnter = (e: MouseEvent) => {
      cursor.isVisible = true;
      cursor.x = e.clientX;
      cursor.y = e.clientY;
      cursor.targetX = e.clientX;
      cursor.targetY = e.clientY;
      cursor.ringX = e.clientX;
      cursor.ringY = e.clientY;
      cursor.lastX = e.clientX;
      cursor.lastY = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    // Draw 4-point star sparkle (✦)
    const drawStar = (context: CanvasRenderingContext2D, cx: number, cy: number, size: number, alpha: number) => {
      context.save();
      context.beginPath();
      context.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      context.shadowColor = 'rgba(255, 255, 255, 0.95)';
      context.shadowBlur = 6;

      const half = size * 0.3;
      context.moveTo(cx, cy - size);
      context.quadraticCurveTo(cx, cy, cx + size, cy);
      context.quadraticCurveTo(cx, cy, cx, cy + size);
      context.quadraticCurveTo(cx, cy, cx - size, cy);
      context.quadraticCurveTo(cx, cy, cx, cy - size);
      context.closePath();
      context.fill();

      // Center bright core
      context.beginPath();
      context.arc(cx, cy, half, 0, Math.PI * 2);
      context.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.2)})`;
      context.fill();
      context.restore();
    };

    // Animation Render Loop
    const render = () => {
      animId = requestAnimationFrame(render);

      // Clear canvas accurately
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      if (!cursor.isVisible) {
        return;
      }

      const now = performance.now();

      // Smooth cursor position interpolation
      cursor.x += (cursor.targetX - cursor.x) * 0.9;
      cursor.y += (cursor.targetY - cursor.y) * 0.9;

      // Smooth follower halo ring lerp
      cursor.ringX += (cursor.x - cursor.ringX) * 0.32;
      cursor.ringY += (cursor.y - cursor.ringY) * 0.32;
      cursor.ringScale += (cursor.ringTargetScale - cursor.ringScale) * 0.18;

      // 1. Filter and clean expired trail points
      for (let i = trailPoints.length - 1; i >= 0; i--) {
        if (now - trailPoints[i].time > trailPoints[i].maxAge) {
          trailPoints.splice(i, 1);
        }
      }

      // 2. Draw Soft Neon Glowing Trail Ribbon
      if (trailPoints.length > 1) {
        // Pass A: Soft wide white neon aura with electric luminescence
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = cursor.isHovering ? 'rgba(255, 255, 255, 0.95)' : 'rgba(220, 240, 255, 0.75)';
        ctx.shadowBlur = cursor.isHovering ? 18 : 12;

        for (let i = 0; i < trailPoints.length - 1; i++) {
          const p0 = trailPoints[i];
          const p1 = trailPoints[i + 1];

          const life0 = Math.max(0, 1 - (now - p0.time) / p0.maxAge);
          const life1 = Math.max(0, 1 - (now - p1.time) / p1.maxAge);
          const avgLife = (life0 + life1) / 2;

          if (avgLife <= 0.01) continue;

          const width = Math.max(0.6, Math.pow(avgLife, 1.2) * (cursor.isHovering ? 5.5 : 4.0));
          const alpha = Math.pow(avgLife, 1.3) * (cursor.isHovering ? 0.6 : 0.42);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineWidth = width;
          ctx.strokeStyle = `rgba(235, 248, 255, ${alpha})`;
          ctx.stroke();
        }
        ctx.restore();

        // Pass B: Intense bright white core line
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'rgba(255, 255, 255, 1)';
        ctx.shadowBlur = 6;

        for (let i = 0; i < trailPoints.length - 1; i++) {
          const p0 = trailPoints[i];
          const p1 = trailPoints[i + 1];

          const life0 = Math.max(0, 1 - (now - p0.time) / p0.maxAge);
          const life1 = Math.max(0, 1 - (now - p1.time) / p1.maxAge);
          const avgLife = (life0 + life1) / 2;

          if (avgLife <= 0.01) continue;

          const width = Math.max(0.4, Math.pow(avgLife, 1.4) * (cursor.isHovering ? 2.8 : 2.0));
          const alpha = Math.pow(avgLife, 1.1) * (cursor.isHovering ? 0.95 : 0.85);

          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineWidth = width;
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Render Fading Trail Sparkles & Light Dots (✦ • · · ·)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += 16;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const lifeRatio = 1 - p.life / p.maxLife;
        const alpha = Math.pow(lifeRatio, 1.2) * 0.9;

        if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size * lifeRatio, alpha);
        } else if (p.type === 'dot') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.restore();
        } else {
          // Micro dust particle (·)
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * lifeRatio, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(240, 250, 255, ${alpha * 0.8})`;
          ctx.shadowColor = 'rgba(200, 240, 255, 0.6)';
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.restore();
        }
      }

      // 4. Render Outer Follower Halo Ring (Soft White Neon)
      const baseRingRadius = cursor.isHovering ? 18 : 12;
      const currentRingRadius = baseRingRadius * cursor.ringScale;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cursor.ringX, cursor.ringY, currentRingRadius, 0, Math.PI * 2);
      ctx.strokeStyle = cursor.isHovering ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = cursor.isHovering ? 1.4 : 1.0;
      ctx.shadowColor = cursor.isHovering ? 'rgba(255, 255, 255, 0.95)' : 'rgba(215, 245, 255, 0.6)';
      ctx.shadowBlur = cursor.isHovering ? 16 : 8;
      ctx.stroke();

      // Soft subtle halo fill when hovering
      if (cursor.isHovering) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fill();
      }
      ctx.restore();

      // 5. Render Primary Cursor Indicator (Bright White Center + Soft White Neon Glow)
      const centerRadius = cursor.isHovering ? 4.2 : cursor.isClicking ? 2.2 : 3.2;

      // Outer soft neon bloom
      ctx.save();
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, centerRadius + 2.5, 0, Math.PI * 2);
      ctx.fillStyle = cursor.isHovering ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.25)';
      ctx.shadowColor = cursor.isHovering ? 'rgba(255, 255, 255, 1)' : 'rgba(220, 245, 255, 0.85)';
      ctx.shadowBlur = cursor.isHovering ? 22 : 14;
      ctx.fill();
      ctx.restore();

      // Inner brilliant pure white pinpoint
      ctx.save();
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, centerRadius, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
      if (animId !== null) {
        cancelAnimationFrame(animId);
      }
    };
  }, [isTouchDevice]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      id="custom-cursor-canvas"
      className="pointer-events-none fixed inset-0 z-[99999] h-full w-full overflow-hidden will-change-transform"
      style={{
        width: '100vw',
        height: '100vh',
      }}
    />
  );
};
