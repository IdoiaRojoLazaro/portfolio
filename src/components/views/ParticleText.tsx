import React, {useEffect, useRef, useState} from 'react';

/**
 * ParticleText Component
 * Interactive particle text effect for React
 */
export const ParticleText = ({
  text = 'IDOIA ROJO',
  particleGap = 4,
  particleSize = 2,
  mouseRadius = 80,
  returnSpeed = 0.05,
  mouseForce = 0.3,
  colors = ['#00ff88', '#00ccff', '#ff00ff', '#ffff00'],
  fontSize = 120,
  fontFamily = 'Arial',
  className = '',
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({x: null, y: null, radius: mouseRadius});
  const animationRef = useRef(null);

  // Particle class
  class Particle {
    constructor(x, y, color) {
      this.baseX = x;
      this.baseY = y;
      this.x = x;
      this.y = y;
      this.color = color;
      this.size = particleSize;
      this.density = Math.random() * 30 + 1;
      this.vx = 0;
      this.vy = 0;
    }

    draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
    }

    update() {
      const mouse = mouseRef.current;
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      let forceDirectionX = dx / distance;
      let forceDirectionY = dy / distance;
      let maxDistance = mouse.radius;
      let force = (maxDistance - distance) / maxDistance;
      let directionX = forceDirectionX * force * this.density * mouseForce;
      let directionY = forceDirectionY * force * this.density * mouseForce;

      if (distance < mouse.radius) {
        this.vx -= directionX;
        this.vy -= directionY;
      } else {
        this.vx += (this.baseX - this.x) * returnSpeed;
        this.vy += (this.baseY - this.y) * returnSpeed;
      }

      this.vx *= 0.85;
      this.vy *= 0.85;
      this.x += this.vx;
      this.y += this.vy;
    }
  }

  // Create particles from text
  const createParticles = (canvas, ctx, textContent) => {
    particlesRef.current = [];

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.fillText(textContent, centerX, centerY);

    const textCoords = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < canvas.height; y += particleGap) {
      for (let x = 0; x < canvas.width; x += particleGap) {
        const index = (y * canvas.width + x) * 4;
        const alpha = textCoords.data[index + 3];

        if (alpha > 128) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          particlesRef.current.push(new Particle(x, y, color));
        }
      }
    }

    // Initial animation
    setTimeout(() => {
      particlesRef.current.forEach((particle, i) => {
        setTimeout(() => {
          particle.x = particle.baseX + (Math.random() - 0.5) * 500;
          particle.y = particle.baseY + (Math.random() - 0.5) * 500;
        }, i * 0.5);
      });
    }, 100);
  };

  // Animation loop
  const animate = (canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let particle of particlesRef.current) {
      particle.update();
      particle.draw(ctx);
    }

    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx));
  };

  // Setup canvas and initialize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      createParticles(canvas, ctx, text);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse events
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    // Touch events
    const handleTouchMove = (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current.x = touch.clientX - rect.left;
      mouseRef.current.y = touch.clientY - rect.top;
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    // Start animation
    animate(canvas, ctx);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [
    text,
    particleGap,
    particleSize,
    mouseRadius,
    returnSpeed,
    mouseForce,
    fontSize,
    fontFamily,
  ]);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
};

export default ParticleText;
