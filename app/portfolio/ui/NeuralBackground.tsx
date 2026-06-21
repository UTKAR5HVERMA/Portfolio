"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/*
  Neural-network particle field on a full-screen canvas.
  Theme-aware (lighter lines in light mode), with particle count
  scaled down on smaller screens for performance.
*/
export default function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isLight = theme === "light";
    // Dots stay red in both themes; lines flip to white on dark so the
    // network is visible against the black background.
    const dotColor = isLight ? "220, 38, 38" : "239, 68, 68";
    const lineColor = isLight ? "185, 28, 28" : "255, 255, 255";
    // White lines need a touch more opacity to read on black.
    const lineAlpha = isLight ? 0.2 : 0.35;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999, radius: 150 };

    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      density: number;
      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.density = Math.random() * 30 + 1;
        this.vx = (Math.random() - 0.5) * 1;
        this.vy = (Math.random() - 0.5) * 1;
      }
      draw() {
        ctx!.fillStyle = `rgba(${dotColor}, 0.5)`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.closePath();
        ctx!.fill();
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas!.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas!.height) this.vy = -this.vy;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * this.density;
          this.y -= (dy / distance) * force * this.density;
        }
        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      // Higher divisor on small screens => fewer particles.
      const divisor = window.innerWidth < 768 ? 28000 : 15000;
      const count = Math.min(
        140,
        (canvas.height * canvas.width) / divisor
      );
      for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const connect = () => {
      const maxDistSq = (canvas.width / 7) * (canvas.height / 7);
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = dx * dx + dy * dy;
          if (distance < maxDistSq) {
            const opacity = 1 - distance / 20000;
            ctx.strokeStyle = `rgba(${lineColor}, ${opacity * lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => p.update());
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    if (reduced) {
      // Draw a single static frame, no animation loop.
      particles.forEach((p) => p.draw());
      connect();
    } else {
      animate();
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-60"
    />
  );
}
