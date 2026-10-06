'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface Particle { x: number; y: number; vx: number; vy: number; radius: number }

export default function ParticlesBackground({ particleCount = 80, maxDistance = 100 }: { particleCount?: number; maxDistance?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('home');
    if (!ctx || !hero) return;
    let particles: Particle[] = [];
    let frame = 0;
    let previousTime = 0;
    let inView = true;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(particleCount, Math.ceil(canvas.width * canvas.height / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7, vy: (Math.random() - 0.5) * 0.7, radius: Math.random() * 3 + 2,
      }));
    };
    const animate = (time: number) => {
      const step = previousTime ? Math.min((time - previousTime) / 16.67, 2) : 1;
      previousTime = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#3b82f6';
      ctx.strokeStyle = '#2563eb';
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i];
        particle.x += particle.vx * step;
        particle.y += particle.vy * step;
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        ctx.globalAlpha = 0.8;
        ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2); ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const squaredDistance = (particle.x - other.x) ** 2 + (particle.y - other.y) ** 2;
          if (squaredDistance >= maxDistance ** 2) continue;
          ctx.globalAlpha = (1 - Math.sqrt(squaredDistance) / maxDistance) * 0.65;
          ctx.beginPath(); ctx.moveTo(particle.x, particle.y); ctx.lineTo(other.x, other.y); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(animate);
    };
    const updatePlayback = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
      const active = inView && !document.hidden && !document.querySelector('dialog[open]');
      canvas.dataset.running = String(Boolean(active));
      if (active) frame = requestAnimationFrame(animate);
    };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; updatePlayback(); });
    observer.observe(hero);
    const dialogObserver = new MutationObserver(updatePlayback);
    const dialog = document.getElementById('navigation-dialog');
    if (dialog) dialogObserver.observe(dialog, { attributes: true, attributeFilter: ['open'] });
    resize();
    updatePlayback();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', updatePlayback);
    return () => {
      cancelAnimationFrame(frame);
      canvas.dataset.running = 'false';
      observer.disconnect(); dialogObserver.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', updatePlayback);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [particleCount, maxDistance, reduceMotion]);

  return <canvas aria-hidden="true" ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 h-full w-full" />;
}
