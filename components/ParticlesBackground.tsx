"use client"; // Required for Next.js client-side rendering

import { useEffect, useRef } from "react";

class Particle {
  radius: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;

  constructor(public effect: Effect) {
    this.radius = Math.random() * 5 + 2;
    this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
    this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.color = Math.random() > 0.5 ? "#3b82f6" : "#9333ea"; // Blue & Purple variation
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.vx;
    if (this.x > this.effect.width - this.radius || this.x < this.radius) this.vx *= -1;
    this.y += this.vy;
    if (this.y > this.effect.height - this.radius || this.y < this.radius) this.vy *= -1;
  }
}

class Effect {
  width: number;
  height: number;
  particles: Particle[];

  constructor(public canvas: HTMLCanvasElement, public particleCount: number, public maxDistance: number) {
    this.width = canvas.width;
    this.height = canvas.height;
    this.particles = [];
    this.createParticles();
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this));
    }
  }

  handleParticles(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);

    this.particles.forEach((particle) => {
      particle.update();
      particle.draw(ctx);
    });

    this.connectParticles(ctx);
  }

  connectParticles(ctx: CanvasRenderingContext2D) {
    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.hypot(dx, dy);
        if (distance < this.maxDistance) {
          // Create a gradient stroke effect
          const gradient = ctx.createLinearGradient(
            this.particles[i].x,
            this.particles[i].y,
            this.particles[j].x,
            this.particles[j].y
          );
          gradient.addColorStop(0, "#3b82f6"); // Blue
          gradient.addColorStop(1, "#9333ea"); // Purple

          ctx.strokeStyle = gradient;
          ctx.globalAlpha = 1 - distance / this.maxDistance;
          ctx.beginPath();
          ctx.moveTo(this.particles[i].x, this.particles[i].y);
          ctx.lineTo(this.particles[j].x, this.particles[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }
}

interface ParticlesBackgroundProps {
  particleCount?: number;
  maxDistance?: number;
}

const ParticlesBackground = ({ particleCount = 200, maxDistance = 100 }: ParticlesBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const effect = new Effect(canvas, particleCount, maxDistance);

    const animate = () => {
      effect.handleParticles(ctx);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particleCount, maxDistance]);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
};

export default ParticlesBackground;